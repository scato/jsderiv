var util   = require('util'),
    common = require('./common');

var Expr  = common.Expr,
    Empty = common.Empty,
    Null  = common.Null,
    Or    = common.Or,
    Red   = common.Red;

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
        return Red(Empty(), function(x) { return [token].concat(x); });
    } else {
        return Null();
    }
};

Token.prototype.delta = function() {
    return Null();
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


function Grammar() {
    this.start = Array.prototype.slice.apply(arguments);
    
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
            cons = function() {
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
        }
        
        if(cons === null) {
            Ref.definitions[id] = expr;
        } else {
            var func = function(tokens) {
                return [cons.apply(null, tokens)];
            };
            
            Ref.definitions[id] = Red(expr, func);
        }
        
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
            
            Ref.define(id, this.resolve().derive(char), null);
            
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
    });
    
    if(expr.isNullable()) {
        result = expr.parseNull();
    } else {
        result = [];
    }
    
    result.forEach(function(tokens) {
        set.trees.push(tokens[0]);
    });
    
    return set;
}

exports.Token   = Token;

exports.Grammar = Grammar;
exports.Set     = Set;
exports.Term    = Term;

exports.parse   = parse;

