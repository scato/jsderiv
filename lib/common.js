// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
// http://arxiv.org/PS_cache/arxiv/pdf/1010/1010.5023v1.pdf

var util = require('util');

function Expr() {
    throw new Error('cannot instantiate Expr');
};

Expr.prototype.simplify = function() {
    return this;
};

Expr.prototype.equals = function(expr) {
    return this.constructor === expr.constructor;
};

Expr.prototype.isNullable = function() {
    return this.delta().equals(Empty());
};

Expr.prototype.isNull = function() {
    return this.equals(Null());
};

function Null() {
    if(this.constructor === Null) {
        return this;
    } else {
        return new Null();
    }
}

util.inherits(Null, Expr);

Null.prototype.derive = function() {
    return Null();
};

Null.prototype.delta = function() {
    return Null();
};

Null.prototype.toString = function() {
    return 'Null()';
};

Null.prototype.parseNull = function() {
    return [];
};

function Empty() {
    if(this.constructor === Empty) {
        return this;
    } else {
        return new Empty();
    }
}

util.inherits(Empty, Expr);

Empty.prototype.derive = function() {
    return Null();
};

Empty.prototype.delta = function() {
    return Empty();
};

Empty.prototype.toString = function() {
    return 'Empty()';
};

Empty.prototype.parseNull = function() {
    return [[]];
};

function Seq(left, right) {
    if(this.constructor === Seq) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new Seq(left, right);
    }
}

util.inherits(Seq, Expr);

Seq.prototype.derive = function(element, metadata) {
    if(!this.left.isNullable()) {
        return Seq(this.left.derive(element, metadata), this.right);
    } else {
        var func = function() {
            return this.left.parseNull();
        }.bind(this);
        
        return Or(Seq(this.left.derive(element, metadata), this.right), Seq(Red(this.left.delta(), func), this.right.derive(element, metadata)));
    }
};

Seq.prototype.delta = function() {
    return And(this.left.delta(), this.right.delta());
};

Seq.prototype.toString = function() {
    return 'Seq(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Seq.prototype.simplify = function() {
    if(this.left.equals(Null()) || this.right.equals(Null())) {
        return Null();
    } else if(this.left.equals(Empty())) {
        return this.right;
    } else if(this.right.equals(Empty())) {
        return this.left;
    } else if(this.right instanceof Seq) {
        return Seq(Seq(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

Seq.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.left.equals(expr.left)
        && this.right.equals(expr.right);
};

Seq.prototype.parseNull = function() {
    var result = [];
    
    this.left.parseNull().forEach(function(x) {
        this.right.parseNull().forEach(function(y) {
            result.push(x.concat(y));
        }.bind(this));
    }.bind(this));
    
    return result;
};

function Or(left, right) {
    if(this.constructor === Or) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new Or(left, right);
    }
};

util.inherits(Or, Expr);

Or.prototype.derive = function(element, metadata) {
    return Or(this.left.derive(element, metadata), this.right.derive(element, metadata));
};

Or.prototype.delta = function() {
    return Or(this.left.delta(), this.right.delta());
};

Or.prototype.toString = function() {
    return 'Or(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Or.prototype.simplify = function() {
    if(this.left.equals(Null())) {
        return this.right;
    } else if(this.right.equals(Null())) {
        return this.left;
    } else if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Not(Null())) || this.right.equals(Not(Null()))) {
        return Not(Null());
    } else if(this.right instanceof Or) {
        return Or(Or(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

Or.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && ( (this.left.equals(expr.left) && this.right.equals(expr.right))
          || (this.left.equals(expr.right) && this.right.equals(expr.left))
        );
};

Or.prototype.parseNull = function() {
    return this.left.parseNull().concat(this.right.parseNull());
};

function And(left, right) {
    if(this.constructor === And) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new And(left, right);
    }
}

util.inherits(And, Expr);

And.prototype.derive = function(element, metadata) {
    return And(this.left.derive(element, metadata), this.right.derive(element, metadata));
};

And.prototype.delta = function() {
    return And(this.left.delta(), this.right.delta());
};

And.prototype.toString = function() {
    return 'And(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

And.prototype.simplify = function() {
    if(this.left.equals(new Null()) || this.right instanceof Null) {
        return Null();
    } else if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Not(Null()))) {
        return this.right;
    } else if(this.right.equals(Not(Null()))) {
        return this.left;
    } else if(this.right instanceof And) {
        return And(And(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

And.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && ( (this.left.equals(expr.left) && this.right.equals(expr.right))
          || (this.left.equals(expr.right) && this.right.equals(expr.left))
        );
};

function Any(expr) {
    if(this.constructor === Any) {
        this.expr = expr;
        
        return this.simplify();
    } else {
        return new Any(expr);
    }
}

util.inherits(Any, Expr);

Any.prototype.derive = function(element, metadata) {
    return Seq(this.expr.derive(element, metadata), Any(this.expr));
};

Any.prototype.delta = function() {
    return Empty();
};

Any.prototype.toString = function() {
    return 'Any(' + this.expr.toString() + ')';
};

Any.prototype.simplify = function() {
    if(this.expr.equals(Null())) {
        return Empty();
    } else if(this.expr.equals(Empty())) {
        return Empty();
    } else if(this.expr instanceof Any) {
        return this.expr;
    } else {
        return this;
    }
};

Any.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr);
};

Any.prototype.parseNull = function() {
    return [[]];
};

function Not(expr) {
    if(this.constructor === Not) {
        this.expr = expr;
        
        return this.simplify();
    } else {
        return new Not(expr);
    }
}

util.inherits(Not, Expr);

Not.prototype.derive = function(element, metadata) {
    return Red(Not(this.expr.derive(element, metadata)), function(x) { return [[element].concat(x)]; });
    //return Not(this.expr.derive(element));
};

Not.prototype.delta = function() {
    if(this.expr.delta().equals(Null())) {
        return Empty();
    } else {
        return Null();
    }
};

Not.prototype.toString = function() {
    return 'Not(' + this.expr.toString() + ')';
};

Not.prototype.simplify = function() {
    if(this.expr instanceof Not) {
        return this.expr.expr;
    } else {
        return this;
    }
};

Not.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr);
};

Not.prototype.parseNull = function() {
    if(this.expr.isNullable()) {
        return [];
    } else {
        return [[]];
    }
};

function Red(expr, func) {
    if(this.constructor === Red) {
        this.expr = expr;
        this.func = func;
        
        return this.simplify();
    } else {
        return new Red(expr, func);
    }
}

util.inherits(Red, Expr);

Red.prototype.derive = function(element, metadata) {
    return Red(this.expr.derive(element, metadata), function(){
        return this.func.apply(null, Array.prototype.slice.apply(arguments).concat([metadata]));
    }.bind(this));
};

Red.prototype.delta = function() {
    return this.expr.delta();
};

Red.prototype.toString = function() {
    return 'Red(' + this.expr.toString() + ', [Function])';
};

Red.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr)
        && this.func === expr.func;
};

Red.prototype.parseNull = function() {
    var result = [];
    
    this.expr.parseNull().forEach(function(tree) {
        this.func(tree).forEach(function(tree) {
            result.push(tree);
        });
    }.bind(this));
    
    return result;
};

Red.prototype.simplify = function() {
    if(this.expr.equals(Null())) {
        return Null();
    } else {
        return this;
    }
};

// * = any
// + = many
// ? = opt

function Opt(expr)  {
    return Or(expr, Empty());
}

function Many(expr) {
    return Seq(expr, Any(expr));
}

function Ref() {
    throw new Error('cannot instantiate Ref');
};

util.inherits(Ref, Expr);

Ref.prototype.init = function(id) {
    this.id = id;
    
    this.fixed = {
        derive: undefined,
        delta: undefined,
        toString: undefined,
        parseNull: undefined
    };
};

Ref.prototype.resolve = function() {
    var self = this.constructor;
    
    if(self.definitions[this.id] === undefined) {
        throw new Error("Could not resolve reference to '" + this.id + "', no definition found.");
    } else {
        return self.definitions[this.id];
    }
};

Ref.prototype.derive = function(element, metadata) {
    var self = this.constructor;
    
    if(this.fixed.derive !== undefined) {
        return this.fixed.derive;
    } else {
        // We could use every existing definition as fixed points,
        // but simplify() doesn't work good enough for us to use
        // equals() to conclude that these two expressions are equal:
        // A := A | C    and    B := B | C
        
        var found = undefined;
        
        [Null(), Empty()].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.derive = fixed;
                
                if(this.resolve().derive(element, metadata).equals(fixed)) {
                    found = fixed;
                }
                
                this.fixed.derive = undefined;
            }
        }.bind(this));
        
        if(found !== undefined) {
            return found;
        } else {
            var id = this.id + "_" + element.toString();
            
            this.fixed.derive = self(id);
            
            self.define(id, this.resolve().derive(element, metadata), null);
            
            this.fixed.derive = undefined;
            
            return self(id);
        }
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
        this.fixed.toString = 'Ref("' + this.id + '")';
        
        var result = this.resolve().toString();
        
        this.fixed.toString = undefined;
        
        return result;
    }
};

Ref.prototype.simplify = function() {
    var self = this.constructor;
    
    if(self.references[this.id] !== undefined) {
        return self.references[this.id];
    } else {
        self.references[this.id] = this;
        
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

// todo: implement as Register-class instead of Def-mixin
function Def(Ref) {
    Ref.definitions = {};
    Ref.references = {};
    
    Ref.createCons = function(id) {
        throw new Error("Cannot call abstract method Ref.createCons");
    };

    Ref.createFunc = function(cons) {
        throw new Error("Cannot call abstract method Ref.createFunc");
    };

    Ref.define = function(id, expr, cons) {
        if(cons === undefined) {
            cons = Ref.createCons(id);
        }
        
        if(cons === null) {
            Ref.definitions[id] = expr;
        } else {
            Ref.definitions[id] = Red(expr, Ref.createFunc(cons));
        }
        
        return cons;
    };
}

exports.Expr  = Expr;
exports.Null  = Null;
exports.Empty = Empty;
exports.Seq   = Seq;
exports.Or    = Or;
exports.And   = And;
exports.Any   = Any;
exports.Not   = Not;
exports.Red   = Red;
exports.Opt   = Opt;
exports.Many  = Many;
exports.Ref   = Ref;
exports.Def   = Def;
