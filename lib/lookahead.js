// includes type alteration
// (like type augmentation, but changing methods instead of adding them)

var util = require('util');

var common = require('./common');

var Expr  = common.Expr,
    Empty = common.Empty,
    Null  = common.Null,
    Seq   = common.Seq,
    Or    = common.Or,
    And   = common.And,
    Not   = common.Not,
    Red   = common.Red;

// call delta with extra argument "element"
// in Seq.prototype.derive and all delta-methods

Expr.prototype.isNullable = function(element) {
    return this.delta(element).equals(Empty());
};

Seq.prototype.derive = function(element) {
    if(!this.left.isNullable(element)) {
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
        
        return Or(Seq(this.left.derive(element), this.right), Seq(Red(this.left.delta(element), func), this.right.derive(element)));
    }
};

Seq.prototype.delta = function(element) {
    return And(this.left.delta(element), this.right.delta(element));
};

Or.prototype.delta = function(element) {
    return Or(this.left.delta(element), this.right.delta(element));
};

And.prototype.delta = function(element) {
    return And(this.left.delta(element), this.right.delta(element));
};

Not.prototype.delta = function(element) {
    if(this.expr.delta(element).equals(Null())) {
        return Empty();
    } else {
        return Null();
    }
};

Red.prototype.delta = function(element) {
    return this.expr.delta(element);
};

function Look(expr) {
    if(this.constructor === Look) {
        this.expr = expr;
        
        return this.simplify();
    } else {
        return new Look(expr);
    }
}

util.inherits(Look, Expr);

Look.prototype.derive = function(element) {
    return Null();
};

Look.prototype.delta = function(element) {
    if(element === undefined) {
        return Null();
    } else {
        return Look(this.expr.derive(element));
    }
};

Look.prototype.toString = function() {
    return 'Look(' + this.expr.toString() + ')';
};

Look.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr);
};

Look.prototype.simplify = function() {
    if(this.expr.equals(Null())) {
        return Null();
    } else if(this.expr.isNullable()) {
        return Empty();
    } else {
        return this;
    }
};

Look.prototype.parseNull = function() {
    return [];
};

exports.Look = Look;

