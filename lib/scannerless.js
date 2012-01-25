// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
// http://arxiv.org/PS_cache/arxiv/pdf/1010/1010.5023v1.pdf

var util   = require('util'),
    common = require('./common');

var Expr = common.Expr,
    Void = common.Void,
    Null = common.Null,
    Or   = common.Or,
    Seq  = common.Seq,
    Join = common.Join,
    Any  = common.Any;

function One() {
    if(this.constructor === One) {
        return this;
    } else {
        return new One();
    }
}

util.inherits(One, Expr);

One.prototype.derive = function(char) {
    return Join(Null(), function(x) { return [[char].concat(x)]; });
};

One.prototype.delta = function() {
    return Void();
};

One.prototype.parseNull = function() {
    return [];
};

function Char(char) {
    if(this.constructor === Char) {
        this.char = char;
        
        return this;
    } else {
        return new Char(char);
    }
}

util.inherits(Char, One);

Char.prototype.derive = function(char) {
    if(this.char === char) {
        return One.prototype.derive.apply(this, [char]);
    } else {
        return Void();
    }
};

Char.prototype.toString = function() {
    return 'Char("' + this.char + '")';
};

Char.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.char === expr.char;
};

function No(char) {
    if(this.constructor === No) {
        this.char = char;
        
        return this;
    } else {
        return new No(char);
    }
}

util.inherits(No, One);

No.prototype.derive = function(char) {
    if(this.char !== char) {
        return One.prototype.derive.apply(this, [char]);
    } else {
        return Void();
    }
};

No.prototype.toString = function() {
    return 'No("' + this.char + '")';
};

No.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.char === expr.char;
};

function Range(from, to) {
    if(this.constructor === Range) {
        this.from = from;
        this.to   = to;
        
        return this;
    } else {
        return new Range(from, to);
    }
}

util.inherits(Range, One);

Range.prototype.derive = function(char) {
    if(this.from.charCodeAt(0) <= char.charCodeAt(0) && char.charCodeAt(0) <= this.to.charCodeAt(0)) {
        return One.prototype.derive.apply(this, [char]);
    } else {
        return Void();
    }
};

Range.prototype.toString = function() {
    return 'Range("' + this.from + '", "' + this.to + '")';
};

Range.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.from === expr.from
        && this.to === expr.to;
};

function Grammar() {
    this.start = Array.prototype.slice.apply(arguments);
    
    function Ref(id) {
        if(this.constructor === Ref) {
            common.Ref.apply(this, [id]);
            
            return this.simplify();
        } else {
            return new Ref(id);
        }
    }

    util.inherits(Ref, common.Ref);

    common.Def(Ref);

    Ref.createCons = function(id) {
        function cons() {
            if(this.constructor === cons) {
                var tokens = Array.prototype.slice.apply(arguments);
                
                Term.apply(this, [id, tokens]);
                
                return this;
            } else {
                // manual construct
                var object = Object.create(cons.prototype);
                var result = cons.apply(object, arguments);
                
                if(result === undefined) {
                    return object;
                } else {
                    return result;
                }
            }
        };
        
        cons.id = id;
        
        util.inherits(cons, Term);
        
        return cons;
    };
    
    Ref.createFunc = function(cons) {
        return function(tokens) {
            return cons.apply(null, tokens);
        };
    };
    
    this.Ref = Ref;
    this.Def = Ref.define;
}

Grammar.prototype.toExpr = function() {
    var expr = Void();
    
    this.start.forEach(function(id) {
        expr = Or(expr, this.Ref(id));
    }.bind(this));
    
    return expr;
};

function Set() {
    this.trees = Array.prototype.slice.apply(arguments);
}

Set.prototype.equals = function(set) {
    if(this.trees.length !== set.trees.length) {
        return false;
    } else {
        var i = this.trees.length;
        
        while(i--) {
            if(!this.trees[i].equals(set.trees[i])) {
                return false;
            }
        }
        
        return true;
    }
};

Set.prototype.forEach = function(callback, owner) {
    this.trees.forEach(callback, owner);
};

Set.prototype.toString = function() {
    return '[' + this.trees.map(function(tree) {
        return tree.toString();
    }).join(', ') + ']';
};

function Term(type, tokens) {
    this.type = type;
    this.tokens = tokens;
}

Term.prototype.equals = function(term) {
    if(this.type !== term.type) {
        return false;
    } else if(this.tokens.length !== term.tokens.length) {
        return false;
    } else {
        var i = this.tokens.length;
        
        while(i--) {
            if(this.tokens[i] instanceof Term) {
                if(!this.tokens[i].equals(term.tokens[i])) {
                    return false;
                }
            } else {
                if(this.tokens[i] !== term.tokens[i]) {
                    return false;
                }
            }
        }
        
        return true;
    }
};

Term.prototype.toString = function() {
    return this.type + '(' + this.tokens.map(function(token) {
        if(token instanceof Term) {
            return token.toString();
        } else {
            return JSON.stringify(token);
        }
    }).join(', ') + ')';
};

function Literal(str) {
    if(str.length === 0) {
        return Null();
    } else if(str.length === 1) {
        return Char(str);
    } else {
        var length = str.length - 1;
        
        return Seq(Literal(str.substr(0, length)), Char(str[length]));
    }
}

function position(i, input) {
    var lines = input.substr(0, i + 1).split(/\n|\r\n|\r(?!\n)/);
    
    return {
        line: lines.length,
        char: lines.pop().length
    };
}

function parse(input, grammar) {
    var expr = grammar.toExpr();
    var set = new Set();
    var result;
    
    for(var i = 0; i < input.length; i++) {
        var pos = position(i, input);
        
        expr = expr.derive(input[i], pos);
        
        if(expr.equals(Void())) {
            throw new Error("Invalid character '" + input[i] + "' at " + pos.line + ":" + pos.char);
        }
    }
    
    if(expr.isNullable()) {
        result = expr.parseNull();
    } else {
        throw new Error("Parse error");
    }
    
    result.forEach(function(tokens) {
        set.trees.push(tokens[0]);
    });
    
    return set;
}

function Class() {
    if(arguments.length === 1) {
        return Char(arguments[0]);
    } else {
        var slice = Array.prototype.slice.apply(arguments, [1]);
        
        return Or(Class.apply(null, slice), Char(arguments[0]));
    }
}

exports.Char    = Char;
exports.One     = One;
exports.No      = No;
exports.Literal = Literal;
exports.Range   = Range;
exports.Class   = Class;

exports.Term    = Term;
exports.Set     = Set;
exports.Grammar = Grammar;

exports.parse   = parse;
