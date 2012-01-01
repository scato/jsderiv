var util   = require('util'),
    common = require('./common');

var Expr = common.Expr,
    Null = common.Null,
    Void = common.Void,
    Or   = common.Or,
    Red  = common.Red;

function Token(type) {
    if(this.constructor === Token) {
        this.type = type;
    } else {
        return new Token(type);
    }
}

util.inherits(Token, Expr);

Token.prototype.derive = function(token) {
    if(token instanceof this.type) {
        return Red(Null(), function(x) { return [token].concat(x); });
    } else {
        return Void();
    }
};

Token.prototype.delta = function() {
    return Void();
};

Token.prototype.toString = function() {
    return 'Token(' + this.type.id + ')';
};

Token.prototype.parseNull = function() {
    return [];
};

Token.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.type === expr.type;
};

function Literal(value) {
    if(this.constructor === Literal) {
        this.value = value;
    } else {
        return new Literal(value);
    }
}

util.inherits(Literal, Expr);

Literal.prototype.derive = function(token) {
    if(token.value === this.value) {
        return Red(Null(), function(x) { return [token].concat(x); });
    } else {
        return Void();
    }
};

Literal.prototype.delta = function() {
    return Void();
};

Literal.prototype.toString = function() {
    return 'Literal("' + this.value + '")';
};

Literal.prototype.parseNull = function() {
    return [];
};

Literal.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.value === expr.value;
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
            return [cons.apply(null, tokens)];
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
            if(!this.tokens[i].equals(term.tokens[i])) {
                return false;
            }
        }
        
        return true;
    }
};

Term.prototype.toString = function() {
    return this.type + '(' + this.tokens.map(function(token) {
        return token.toString();
    }).join(', ') + ')';
};

function parse(input, grammar) {
    var expr = grammar.toExpr();
    var set = new Set();
    var result;
    
    input.forEach(function(token) {
        expr = expr.derive(token);
        
        if(expr.equals(Void())) {
            if(token.metadata === undefined) {
                throw new Error("Unexpected token " + token.toString());
            } else {
                throw new Error("Unexpected token " + token.toString() + " at " + token.metadata.line + ":" + token.metadata.char);
            }
        }
    });
    
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

exports.Token   = Token;
exports.Literal = Literal;

exports.Grammar = Grammar;
exports.Set     = Set;
exports.Term    = Term;

exports.parse   = parse;

