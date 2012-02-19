// includes type alteration
// (like type augmentation, but changing methods instead of adding them)

var util = require('util');

var common  = require('./common'),
    generic = require('./generic');

var Expr = common.Expr,
    Null = common.Null,
    Void = common.Void,
    Seq  = common.Seq,
    Or   = common.Or,
    And  = common.And,
    Not  = common.Not,
    Red  = common.Red,
    Join = common.Join,
    Many = common.Many,
    Ref  = generic.Ref;

// call delta with extra argument "element"
// in Seq.prototype.derive and all delta-methods

Expr.prototype.isNullable = function(element) {
    return this.delta(element).equals(Null());
};

Seq.prototype.derive = function(element, metadata) {
    if(!this.left.isNullable(element)) {
        return Seq(this.left.derive(element, metadata), this.right);
    } else {
        var result = this.left.parseNull();
        var left;
        
        if(result.length === 1 && result[0].length === 0) {
            // in case of Ignore, this will happen often
            left = Null();
        } else {
            var func = function() { return result; };
            left = Join(this.left.delta(element), func);
        }
        
        // D(r) . s | d(left) +> f . D(right)
        return Or(Seq(this.left.derive(element, metadata), this.right), Seq(left, this.right.derive(element, metadata)));
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
    if(this.expr.delta(element).equals(Void())) {
        return Null();
    } else {
        return Void();
    }
};

Red.prototype.delta = function(element) {
    return this.expr.delta(element);
};

Ref.prototype.delta = function(element) {
    if(this.cache.delta[String(element)] !== undefined) {
        return this.cache.delta[String(element)];
    } else if(this.fixed.delta === undefined) {
        var i = 0;
        this.fixed.delta = Void();
        this.expr = this.expr || this.func();
        
        while(i++ < 255) {
            var result = this.expr.delta(element);
            
            if(this.fixed.delta.equals(result)) {
                this.cache.delta[String(element)] = result;
                this.fixed.delta = undefined;
                
                return result;
            } else {
                this.fixed.delta = result;
            }
        }
        
        throw new Error("Unable to find fixed point for delta...");
    } else {
        return this.fixed.delta;
    }
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
    return Void();
};

Look.prototype.delta = function(element) {
    if(element === undefined) {
        if(this.expr instanceof Not) {
            return Null();
        } else {
            return Void();
        }
    } else {
        var deriv = this.expr.derive(element);
        
        if(deriv.isNullable()) {
            return Null();
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
    if(this.expr.equals(Void())) {
        return Void();
    } else if(this.expr.equals(Null())) {
        return Null();
    } else if(this.expr instanceof Red || this.expr instanceof Join) {
        return Look(this.expr.expr);
    } else if(this.expr.equals(Not(Null()))) {
        return Void();
    } else {
        return this;
    }
};

Look.prototype.parseNull = function() {
    return [[]];
};

Look.prototype.isNull = function() {
    return false;
};

exports.Look  = Look;
