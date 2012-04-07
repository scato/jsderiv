var Expr = function() {};

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

var Const = function() {};

Const.prototype = Object.create(Expr.prototype);
Const.prototype.constructor = Const;

Const.define = function(type) {
    var ctor = function() {
        if(ctor._instance !== undefined) {
            return ctor._instance;
        } else if(this instanceof ctor) {
            ctor._instance = this;
            
            return this;
        } else {
            return new ctor();
        }
    };
    
    ctor.prototype = Object.create(Const.prototype);
    ctor.prototype.constructor = ctor;
    
    ctor.prototype._type = type;
    
    return ctor;
};

Const.prototype.equals = function(expr) {
    return expr === this;
};

Const.prototype.toString = function() {
    return this._type + '()';
};

var Void = exports.Void = Const.define('Void');

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

var Null = exports.Null = Const.define('Null');

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

var One = exports.One = Const.define('One');

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

Char.prototype = Object.create(One.prototype);
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
        return One.prototype.derive.apply(this, [element]);
    } else {
        return Void();
    }
};

One.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Red(Null(), function() {
        return [element];
    });
};

Char.prototype.parseNull = function() {
    return [];
};

var Unary = function() {};

Unary.prototype = Object.create(Expr.prototype);
Unary.prototype.constructor = Unary;

Unary.define = function(type) {
    var ctor = function(expr) {
        if(expr === undefined) {
            throw new Error('Not enough arguments');
        }
        
        if(this instanceof ctor) {
            this.expr = expr;
            
            return this._simplify();
        } else {
            return new ctor(expr);
        }
    };

    ctor.prototype = Object.create(Unary.prototype);
    ctor.prototype.constructor = ctor;
    
    ctor.prototype._type = type;
    
    return ctor;
};

Unary.prototype._simplify = function() {
    return this;
};

Unary.prototype.equals = function(expr) {
    return expr.constructor === this.constructor && expr.expr.equals(this.expr);
};

Unary.prototype.toString = function() {
    return this._type + '(' + this.expr.toString() + ')';
};

var Any = exports.Any = Unary.define('Any');

Any.prototype._simplify = function() {
    if(this.expr instanceof Any) {
        return this.expr;
    } else if(this.expr.equals(Null())) {
        return Null();
    } else if(this.expr.equals(Void())) {
        return Null();
    } else {
        return this;
    }
};

Any.prototype.isNullable = function() {
    return true;
};

Any.prototype.isVoidable = function() {
    return !this.expr.equals(One());
};

Any.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Null();
};

Any.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return Seq(this.expr.derive(element), this);
};

Any.prototype.parseNull = function() {
    return [[]];
};

var Not = exports.Not = Unary.define('Not');

Not.prototype.isVoidable = function() {
    return !this.expr.equals(Void());
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

Red.prototype.isNullable = function() {
    return true;
};

Red.prototype.derive = function() {
    return Void();
};

Red.prototype.parseNull = function() {
    return this.func();
};

var Binary = function() {};

Binary.prototype = Object.create(Expr.prototype);
Binary.prototype.constructor = Binary;

Binary.define = function(type) {
    var ctor = function(left, right) {
        if(left === undefined || right === undefined) {
            throw new Error('Not enough arguments');
        }
        
        if(this instanceof ctor) {
            this.left = left;
            this.right = right;
            
            return this._simplify();
        } else {
            return new ctor(left, right);
        }
    };
    
    ctor.prototype = Object.create(Binary.prototype);
    ctor.prototype.constructor = ctor;
    
    ctor.prototype._type = type;

    return ctor;
};

Binary.prototype._simplify = function() {
    if(this.left.equals(Void())) {
        return Void();
    } else if(this.right.equals(Void())) {
        return Void();
    } else if(this.right.constructor === this.constructor) {
        return new this.constructor(new this.constructor(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

Binary.prototype.equals = function(expr) {
    return expr.constructor === this.constructor && (this.left.equals(expr.left) && this.right.equals(expr.right) || this.left.equals(expr.right) && this.right.equals(expr.left));
};

Binary.prototype.toString = function() {
    return this._type + '(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Binary.prototype.isNullable = function() {
    return this.left.isNullable() && this.right.isNullable();
};

Binary.prototype.isVoidable = function() {
    return this.left.isVoidable() || this.right.isVoidable();
};

Binary.prototype.delta = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return And(this.left.delta(element), this.right.delta(element));
};

Binary.prototype.derive = function(element) {
    if(element === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return new this.constructor(this.left.derive(element), this.right.derive(element));
};

var Or = exports.Or = Binary.define('Or');

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
    } else {
        return Binary.prototype._simplify.apply(this, []);
    }
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

Or.prototype.parseNull = function() {
    return this.left.parseNull().concat(this.right.parseNull());
};

var Seq = exports.Seq = Binary.define('Seq');

Seq.prototype._simplify = function() {
    if(this.left.equals(Null())) {
        return this.right;
    } else if(this.right.equals(Null())) {
        return this.left;
    } else {
        return Binary.prototype._simplify.apply(this, []);
    }
};

Seq.prototype.equals = function(expr) {
    return expr instanceof Seq && this.left.equals(expr.left) && this.right.equals(expr.right);
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

Seq.prototype.parseNull = function() {
    var result = [];
    
    this.left.parseNull().forEach(function(left) {
        this.right.parseNull().forEach(function(right) {
            result.push(left.concat(right));
        });
    }.bind(this));
    
    return result;
};

var And = exports.And = Binary.define('And');

And.prototype._simplify = function() {
    if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Void())) {
        return Void();
    } else if(this.right.equals(Void())) {
        return Void();
    } else if(this.left.equals(Not(Void()))) {
        return this.right;
    } else if(this.right.equals(Not(Void()))) {
        return this.left;
    } else {
        return Binary.prototype._simplify.apply(this, []);
    }
};

And.prototype.parseNull = function() {
    return this.left.parseNull();
};

