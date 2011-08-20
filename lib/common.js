// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
// http://arxiv.org/PS_cache/arxiv/pdf/1010/1010.5023v1.pdf

var util = require('util');

Expr = function() {
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

Seq.prototype.derive = function(element) {
    if(!this.left.delta().equals(Empty())) {
        return Seq(this.left.derive(element), this.right);
    } else {
        var func = function() {
            var forest = this.left.parseNull();
            
            if(forest.length === 1) {
                return forest[0];
            } else {
                throw new Exception("Que le fuck!");
            }
        }.bind(this);
        
        return Or(Seq(this.left.derive(element), this.right), Seq(Red(this.left.delta(), func), this.right.derive(element)));
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

Or.prototype.derive = function(element) {
    return Or(this.left.derive(element), this.right.derive(element));
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

And.prototype.derive = function(element) {
    return And(this.left.derive(element), this.right.derive(element));
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

Any.prototype.derive = function(element) {
    return Seq(this.expr.derive(element), Any(this.expr));
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

Not.prototype.derive = function(element) {
    return Red(Not(this.expr.derive(element)), function(x) { return [element].concat(x); });
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

Red.prototype.derive = function(element) {
    return Red(this.expr.derive(element), this.func);
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
    var result = this.expr.parseNull();
    
    return result.map(this.func);
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

