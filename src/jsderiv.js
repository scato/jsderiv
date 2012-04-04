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

//Void.prototype = Object.create(Expr.prototype);
//Void.prototype.constructor = Void;

Void.prototype.equals = function(expr) {
    return expr === this;
};

Void.prototype.toString = function() {
    return 'Void()';
};

Void.prototype.isNullable = function() {
    return false;
};

Void.prototype.isVoidable = function() {
    return true;
};

Void.prototype.delta = function() {
    return Void();
};

Void.prototype.bigDelta = function(element) {
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

Void.prototype.parse = function(input) {
    if(input === undefined) {
        throw new Error('Not enough arguments');
    }
    
    return [];
}
