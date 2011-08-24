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
    Red   = common.Red,
    Many  = common.Many;

// call delta with extra argument "element"
// in Seq.prototype.derive and all delta-methods

Expr.prototype.isNullable = function(element) {
    if(element === undefined) {
        return this.delta().equals(Empty());
    } else {
        return this.delta(element).isNullable();
    }
};

Seq.prototype.derive = function(element, metadata) {
    if(!this.left.isNullable(element)) {
        return Seq(this.left.derive(element, metadata), this.right);
    } else {
        var func = function() {
            return this.left.parseNull();
        }.bind(this);
        
        return Or(Seq(this.left.derive(element, metadata), this.right), Seq(Red(this.left.delta(element), func), this.right.derive(element, metadata)));
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

Look.prototype.derive = function() {
    return Null();
};

Look.prototype.delta = function(element) {
    if(element === undefined) {
        if(this.expr instanceof Not) {
            return Empty();
        } else {
            return Null();
        }
    } else {
        var deriv = this.expr.derive(element);
        
        if(deriv.isNullable()) {
            return Empty();
        } else {
            return Look(deriv);
        }
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
    } else if(this.expr.equals(Empty())) {
        return Empty();
    } else {
        return this;
    }
};

Look.prototype.parseNull = function() {
    return [[]];
};

function Eager(part) {
    return Seq(Many(part), Look(Not(part)));
}

exports.Look  = Look;
exports.Eager = Eager;
