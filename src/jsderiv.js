var Expr = function() {};

Expr.prototype.equals = function(expr) {
    return expr === this;
};

Expr.prototype.parse = function(input) {
    if(input === undefined) {
        throw new Error('Not enough arguments');
    }
    
    var expr = this;
    
    for(var i = 0; i < input.length; i++) {
        expr = expr.derive(input[i]);
    }
    
    return expr.parseNull();
}

var Void = exports.Void = function() {
    if(Void._instance !== undefined) {
        return Void._instance;
    } else if(this instanceof Void) {
        Void._instance = this;
        
        return this;
    } else {
        return new Void();
    }
};

Void.prototype = Object.create(Expr.prototype);
Void.prototype.constructor = Void;

Void.prototype.toString = function() {
    return 'Void()';
};

Void.prototype.isNullable = function() {
    return false;
};

Void.prototype.isVoidable = function() {
    return true;
};

Void.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Void();
};

Void.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Void();
};

Void.prototype.parseNull = function() {
    return [];
};

var Null = exports.Null = function() {
    if(Null._instance !== undefined) {
        return Null._instance;
    } else if(this instanceof Null) {
        Null._instance = this;
        
        return this;
    } else {
        return new Null();
    }
};

Null.prototype = Object.create(Expr.prototype);
Null.prototype.constructor = Null;

Null.prototype.toString = function() {
    return 'Null()';
};

Null.prototype.isNullable = function() {
    return true;
};

Null.prototype.isVoidable = function() {
    return true;
};

Null.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Null();
};

Null.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Void();
};

Null.prototype.parseNull = function() {
    return [[]];
};

var Char = exports.Char = function(char) {
    if(char === undefined) {
        throw new Error('Not enough arguments');
    }
    
    if(this instanceof Char) {
        this.char = char;
        
        return this;
    } else {
        return new Char(char);
    }
};

Char.prototype = Object.create(Expr.prototype);
Char.prototype.constructor = Char;

Char.prototype.equals = function(expr) {
    return expr instanceof Char && expr.char === this.char;
};

Char.prototype.toString = function() {
    return 'Char(' + JSON.stringify(this.char) + ')';
};

Char.prototype.isNullable = function() {
    return false;
};

Char.prototype.isVoidable = function() {
    return true;
};

Char.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Void();
};

Char.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    if(element === this.char) {
        return Red(Null(), function() {
            return [element];
        });
    } else {
        return Void();
    }
};

Char.prototype.parseNull = function() {
    return [];
};

var Red = exports.Red = function(expr, func) {
    if(this instanceof Red) {
        this.expr = expr;
        this.func = func;
        
        return this;
    } else {
        return new Red(expr, func);
    }
};

Red.prototype.equals = function() {
    return false;
};

Red.prototype.derive = function() {
    return Void();
};

Red.prototype.parseNull = function() {
    return this.func();
};

var Or = exports.Or = function(left, right) {
    if(left === undefined || right === undefined) {
        throw new Error('Not enough arguments');
    }
    
    if(this instanceof Or) {
        this.left = left;
        this.right = right;
        
        return this._simplify();
    } else {
        return new Or(left, right);
    }
};

Or.prototype = Object.create(Expr.prototype);
Or.prototype.constructor = Or;

Or.prototype.equals = function(expr) {
    return expr instanceof Or && (this.left.equals(expr.left) && this.right.equals(expr.right) || this.left.equals(expr.right) && this.right.equals(expr.left));
};

Or.prototype._simplify = function() {
    if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Not(Void()))) {
        return Not(Void());
    } else if(this.right.equals(Not(Void()))) {
        return Not(Void());
    } else if(this.left.equals(Void())) {
        return this.right;
    } else if(this.right.equals(Void())) {
        return this.left;
    } else if(this.right instanceof Or) {
        return Or(Or(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

Or.prototype.toString = function() {
    return 'Or(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Or.prototype.isNullable = function() {
    return this.left.isNullable() || this.right.isNullable();
};

Or.prototype.isVoidable = function() {
    return this.left.isVoidable() && this.right.isVoidable();
};

Or.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Or(this.left.delta(element), this.right.delta(element));
};

Or.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Or(this.left.derive(element), this.right.derive(element));
};

Or.prototype.parseNull = function() {
    return this.left.parseNull().concat(this.right.parseNull());
};

var Seq = exports.Seq = function(left, right) {
    if(left === undefined || right === undefined) {
        throw new Error('Not enough arguments');
    }
    
    if(this instanceof Seq) {
        this.left = left;
        this.right = right;
        
        return this._simplify();
    } else {
        return new Seq(left, right);
    }
};

Seq.prototype._simplify = function() {
    if(this.left.equals(Void())) {
        return Void();
    } else if(this.right.equals(Void())) {
        return Void();
    } else if(this.left.equals(Null())) {
        return this.right;
    } else if(this.right.equals(Null())) {
        return this.left;
    } else if(this.right instanceof Seq) {
        return Seq(Seq(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

Seq.prototype.equals = function(expr) {
    return expr instanceof Seq && this.left.equals(expr.left) && this.right.equals(expr.right);
};

Seq.prototype.toString = function() {
    return 'Seq(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Seq.prototype.isNullable = function() {
    return this.left.isNullable() && this.right.isNullable();
};

Seq.prototype.isVoidable = function() {
    return this.left.isVoidable() || this.right.isVoidable();
};

Seq.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return And(this.left.delta(element), this.right.delta(element));
};

Seq.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    if(!this.left.isNullable()) {
        return Seq(this.left.derive(element), this.right);
    } else {
        var result = this.left.parseNull();
        
        if(result.length === 1 && result[0].length === 0) {
            return Or(Seq(this.left.derive(element), this.right), this.right.derive(element));
        } else {
            return Or(Seq(this.left.derive(element), this.right), Seq(Red(Null(), function() {
                return result;
            }.bind(this)), this.right.derive(element)));
        }
    }
};

var Not = exports.Not = function(expr) {
    if(this instanceof Not) {
        this.expr = expr;
        
        return this;
    } else {
        return new Not(expr);
    }
};

Not.prototype.equals = function(expr) {
    return expr instanceof Not && this.expr.equals(expr.expr);
};

Not.prototype.isVoidable = function() {
    if(this.expr.equals(Void())) {
        return false;
    } else {
        return true;
    }
};

var And = exports.And = function(left, right) {
    if(this instanceof And) {
        this.left = left;
        this.right = right;
        
        return this._simplify();
    } else {
        return new And(left, right);
    }
};

And.prototype._simplify = function() {
    if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Void())) {
        return Void();
    } else if(this.right.equals(Void())) {
        return Void();
    } else {
        return this;
    }
};

And.prototype.equals = function(expr) {
    return expr instanceof And && (this.left.equals(expr.left) && this.right.equals(expr.right) || this.left.equals(expr.right) && this.right.equals(expr.left));
};

