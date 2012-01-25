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
        function cons(value, metadata) {
            if(this.constructor === cons) {
                Token.apply(this, [id, value, metadata]);
                
                return this;
            } else {
                return new cons(value, metadata);
            }
        };
        
        cons.id = id;
        
        util.inherits(cons, Token);
        
        return cons;
    };
    
    Ref.createFunc = function(cons) {
        return function(chars, metadata) {
            // join chars into a string and use this to start a list of tokens
            // this means tokens cannot be nested, but they won't
            return cons(chars.join(''), metadata);
        };
    };
    
    this.Ref = Ref;
    this.Def = Ref.define;
}

Grammar.prototype.toExpr = function() {
    var expr = Void();
    
    for(var id in this.Ref.definitions) {
        if(this.Ref.definitions.hasOwnProperty(id)) {
            expr = Or(expr, this.Ref.definitions[id]);
        }
    }
    
    return Any(expr);
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

function Token(type, value, metadata) {
    this.type = type;
    this.value = value;
    this.metadata = metadata;
}

Token.prototype.toString = function() {
    return this.type + '(' + JSON.stringify(this.value) + ')';
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

Stream.prototype.forEach = function(callback, owner) {
    this.tokens.forEach(callback, owner);
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

Stream.prototype.toString = function() {
    return 'Stream(' + this.tokens.map(function(token) {
        return token.toString();
    }).join(', ') + ')';
};


function position(i, input) {
    var lines = input.substr(0, i + 1).split(/\n|\r\n|\r(?!\n)/);
    
    return {
        line: lines.length,
        char: lines.pop().length
    };
}

function tokenize(input, grammar) {
    var expr = grammar.toExpr();
    var stream = new Stream();
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
        throw new Error("Syntax error");
    }
    
    if(result.length === 0) {
        return null;
        throw new Error("Could not tokenize string.");
    } else if(result.length > 1) {
        return result.map(function(tokens) {
            var stream = new Stream();
            stream.tokens = tokens;
            return stream;
        });
        throw new Error("Grammar is ambiguous.");
    } else {
        stream.tokens = result[0];
        
        return stream;
    }
}

function Class() {
    if(arguments.length === 1) {
        return Char(arguments[0]);
    } else {
        var slice = Array.prototype.slice.apply(arguments, [1]);
        
        return Or(Class.apply(null, slice), Char(arguments[0]));
    }
}

exports.Char     = Char;
exports.One      = One;
exports.No       = No;
exports.Literal  = Literal;
exports.Range    = Range;
exports.Class    = Class;

exports.Token    = Token;
exports.Stream   = Stream;
exports.Grammar  = Grammar;

exports.tokenize = tokenize;
