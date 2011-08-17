// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
// http://arxiv.org/PS_cache/arxiv/pdf/1010/1010.5023v1.pdf

var util   = require('util'),
    common = require('./common');

var Expr  = common.Expr,
    Null  = common.Null,
    Empty = common.Empty,
    Or    = common.Or,
    Seq   = common.Seq,
    Red   = common.Red,
    Any   = common.Any;

function Char(char) {
    if(this.constructor === Char) {
        this.char = char;
        
        return this;
    } else {
        return new Char(char);
    }
}

util.inherits(Char, Expr);

Char.prototype.derive = function(char) {
    if(this.char === char) {
        // debug
        return Red(Empty(), new Function('x', 'return ["' + char + '"].concat(x); '));
        return Red(Empty(), function(x) { return [char].concat(x); });
    } else {
        return new Null();
    }
};

Char.prototype.delta = function() {
    return Null();
};

Char.prototype.toString = function() {
    return 'Char("' + this.char + '")';
};

Char.prototype.parseNull = function() {
    return [];
};

Char.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.char === expr.char;
};

function Grammar() {
    function Ref(id) {
        if(this.constructor === Ref) {
            this.id = id;
            
            this.fixed = {
                derive: undefined,
                delta: undefined,
                toString: undefined,
                parseNull: undefined
            };
            
            return this.simplify();
        } else {
            return new Ref(id);
        }
    }

    util.inherits(Ref, Expr);

    Ref.definitions = {};
    Ref.references = {};

    Ref.define = function(id, expr, cons) {
        if(cons === undefined) {
            cons = function(value) {
                if(this.constructor === cons) {
                    Token.apply(this, [id, value]);
                    
                    return this;
                } else {
                    return new cons(value);
                }
            };
            
            util.inherits(cons, Token);
        }
        
        Ref.definitions[id] = expr;
        
        return cons;
    };

    Ref.prototype.resolve = function() {
        if(Ref.definitions[this.id] === undefined) {
            throw new Error("Could not resolve reference to '" + this.id + "', no definition found.");
        } else {
            return Ref.definitions[this.id];
        }
    };

    Ref.prototype.derive = function(char) {
        if(this.fixed.derive !== undefined) {
            return this.fixed.derive;
        } else {
            // We could use every existing definition as fixed points,
            // but simplify() doesn't work good enough for us to use
            // equals() to conclude that these two expressions are equal:
            // A := A | C    and    B := B | C
            
            var id = this.id + "_" + char;
            
            this.fixed.derive = Ref(id);
            
            Ref.define(id, this.resolve().derive(char));
            
            this.fixed.derive = undefined;
            
            return Ref(id);
        }
    };

    Ref.prototype.delta = function(char) {
        if(this.fixed.delta !== undefined) {
            return this.fixed.delta;
        } else {
            var found = undefined;
            
            [Null(), Empty()].forEach(function(fixed) {
                if(found === undefined) {
                    this.fixed.delta = fixed;
                    
                    if(this.resolve().delta().equals(fixed)) {
                        found = fixed;
                    }
                    
                    this.fixed.delta = undefined;
                }
            }.bind(this));
            
            if(found === undefined) {
                throw new Error('Unable to find fixed point for delta on ' + this.id + '.');
            } else {
                return found;
            }
        }
    };

    // write out one layer of recursion for references
    Ref.prototype.toString = function() {
        if(this.fixed.toString !== undefined) {
            return this.fixed.toString;
        } else {
            this.fixed.toString = 'ref("' + this.id + '")';
            
            var result = this.resolve().toString();
            
            this.fixed.toString = undefined;
            
            return result;
        }
    };

    Ref.prototype.simplify = function() {
        if(Ref.references[this.id] !== undefined) {
            return Ref.references[this.id];
        } else {
            Ref.references[this.id] = this;
            
            return this;
        }
    };

    Ref.prototype.equals = function(expr) {
        return Expr.prototype.equals.apply(this, [expr])
            && this.id === expr.id;
    };

    Ref.prototype.parseNull = function() {
        if(this.fixed.parseNull !== undefined) {
            return this.fixed.parseNull;
        } else {
            this.fixed.parseNull = [];
            
            function equal(a, b) {
                return JSON.stringify(a) === JSON.stringify(b);
            }
            
            while(true) {
                var a = this.resolve().parseNull();
                var b = this.fixed.parseNull;
                
                if(equal(a, b)) {
                    this.fixed.parseNull = undefined;
                    
                    return a;
                } else {
                    this.fixed.parseNull = a;
                }
            }
        }
    };
    
    this.Ref = Ref;
    this.Def = Ref.define;
}

Grammar.prototype.toExpr = function() {
    var expr = Null();
    
    for(var id in this.Ref.definitions) {
        if(this.Ref.definitions.hasOwnProperty(id)) {
            expr = Or(expr, this.Ref.definitions[id]);
        }
    }
    
    return Any(expr);
};

function Literal(str) {
    if(str.length === 0) {
        return Empty();
    } else if(str.length === 1) {
        return Char(str);
    } else {
        var length = str.length - 1;
        
        return Seq(Literal(str.substr(0, length)), Char(str[length]));
    }
}

function Token(type, value) {
    this.type = type;
    this.value = value;
}

Token.prototype.toString = function() {
    return this.value;
};

Token.prototype.equals = function(token) {
    return this.type === token.type && this.value === token.value;
};

function Stream() {
    this.tokens = Array.prototype.slice.apply(arguments);
}

Stream.prototype.exclude = function(cons) {
    var stream = new Stream();
    
    stream.tokens = this.tokens.filter(function(token) {
        return !(token instanceof cons);
    });
    
    return stream;
};

Stream.prototype.equals = function(stream) {
    if(this.tokens.length !== stream.tokens.length) {
        return false;
    } else {
        var i = this.tokens.length;
        
        while(i--) {
            if(!this.tokens[i].equals(stream.tokens[i])) {
                return false;
            }
        }
        
        return true;
    }
};

function parse(input, grammar) {
    var expr = grammar.toExpr();
    var stream = new Stream();
    var result;
    
    for(var i = 0; i < input.length; i++) {
        expr = expr.derive(input[i]);
    }
    
    if(expr.isNullable()) {
        result = expr.parseNull();
    } else {
        result = [];
    }
    
    if(result.length === 0) {
        throw new Error("Could not parse string.");
    } else if(result.length > 1) {
        throw new Error("Grammar is ambiguous.");
    } else {
        stream.tokens = result[0];
        
        return stream;
    }
}


exports.Char    = Char;
exports.Literal = Literal;
exports.Token   = Token;
exports.Stream  = Stream;
exports.Grammar = Grammar;
exports.parse   = parse;

