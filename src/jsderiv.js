var ArgumentError = exports.ArgumentError = function(message) {
    this.name = 'ArgumentError';
    this.message = message;
    
    var error = new Error(message);
    
    if(error.stack !== undefined) {
        if(error.fileName !== undefined && error.lineNumber !== undefined) {
            // Firefox
            this.stack = error.stack.split('\n').slice(1).join('\n');
            this.fileName = this.stack.split('\n')[0].match(/^.*@(.*):(\d+)$/)[1];
            this.lineNumber = this.stack.split('\n')[0].match(/^.*@(.*):(\d+)$/)[2];
        } else if(error.stack !== undefined) {
            // V8
            this.stack = ['ArgumentError: ' + message].concat(error.stack.split('\n').slice(2)).join('\n');
        }
    }
}

ArgumentError.prototype = Object.create(ArgumentError.prototype);
ArgumentError.prototype.constructor = ArgumentError;

var Expr = function() {};

Expr.prototype.parse = function(input) {
    if(input === undefined) {
        throw new ArgumentError('Not enough arguments');
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

Const.prototype.isNullable = function() {
    return false;
};

Const.prototype.isVoidable = function() {
    return true;
};

Const.prototype.delta = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Void();
};

Const.prototype.parseNull = function() {
    return [];
};

var Void = exports.Void = Const.define('Void');

Void.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Void();
};

var Null = exports.Null = Const.define('Null');

Null.prototype.isNullable = function() {
    return true;
};

Null.prototype.delta = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Null();
};

Null.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Void();
};

Null.prototype.parseNull = function() {
    return [[]];
};

var One = exports.One = Const.define('One');

One.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Red(Null(), function() {
        return element;
    });
};

var Char = exports.Char = function(char) {
    if(this instanceof Char) {
        if(char === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(typeof char !== 'string' || char.length !== 1) {
            throw new ArgumentError('Not a character: ' + char.toString());
        }
        
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

Char.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(element === this.char) {
        return One.prototype.derive.apply(this, [element]);
    } else {
        return Void();
    }
};

var Literal = exports.Literal = function(string) {
    if(string === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(typeof string !== 'string') {
        throw new ArgumentError('Not a string' + string.toString());
    }
    
    if(string.length === 0) {
        return Null();
    } else {
        return Seq(Literal(string.substring(0, string.length - 1)), Char(string[string.length - 1]));
    }
};

var Cat = exports.Cat = function(cat) {
    if(this instanceof Cat) {
        if(cat === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(typeof cat !== 'string' || !Cat._isValid(cat)) {
            throw new ArgumentError('Invalid category: ' + JSON.stringify(cat));
        }
        
        this.cat = cat;
        
        if(this.cat.length === 1) {
            this._regexp = new RegExp('\\' + this.cat);
        } else {
            this._complement = !!this.cat.match(/^P\{(\w+)\}$/);
            this._unicode = Cat._unicodeCategories[this.cat.match(/^[pP]\{(\w+)\}$/)[1]];
        }
        
        return this;
    } else {
        return new Cat(cat);
    }
};

Cat.prototype = Object.create(One.prototype);
Cat.prototype.constructor = Cat;

Cat._unicodeCategories = require('./unicode').categories;

Cat._isValid = function(cat) {
    if(cat.match(/^[wWdDsS]$/)) {
        return true;
    } else if(cat.match(/^[pP]\{(\w+)\}$/)) {
        return Cat._unicodeCategories[cat.match(/^[pP]\{(\w+)\}$/)[1]] !== undefined;
    } else {
        return false;
    }
};

Cat.prototype.equals = function(expr) {
    return expr instanceof Cat && expr.cat === this.cat;
};

Cat.prototype.toString = function() {
    return 'Cat(' + JSON.stringify(this.cat) + ')';
};

Cat.prototype._test = function(char) {
    if(this._regexp !== undefined) {
        return this._regexp.test(char);
    } else {
        var charCode = char.charCodeAt(0);
        
        for(var i = 0; i < this._unicode.length; i += 2) {
            if(this._unicode[i] <= charCode && charCode <= this._unicode[i + 1]) {
                return !this._complement;
            }
        }
        
        return this._complement;
    }
};

Cat.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(typeof element === 'string' && element.length === 1 && this._test(element)) {
        return One.prototype.derive.apply(this, [element]);
    } else {
        return Void();
    }
};

var Range = exports.Range = function(min, max) {
    if(this instanceof Range) {
        if(min === undefined || max === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(typeof min !== 'string' || min.length !== 1) {
            throw new ArgumentError('Not a character: ' + min.toString());
        }
        
        if(typeof max !== 'string' || max.length !== 1) {
            throw new ArgumentError('Not a character: ' + max.toString());
        }
        
        this.min = min;
        this.max = max;
        
        return this;
    } else {
        return new Range(min, max);
    }
};

Range.prototype = Object.create(One.prototype);
Range.prototype.constructor = Range;

Range.prototype.equals = function(expr) {
    return expr instanceof Range && expr.min === this.min && expr.max === this.max;
};

Range.prototype.toString = function() {
    return 'Range(' + JSON.stringify(this.min) + ', ' + JSON.stringify(this.max) + ')';
};

Range.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(typeof element === 'string' && element.length === 1 && this.min.charCodeAt(0) <= element.charCodeAt(0) && element.charCodeAt(0) <= this.max.charCodeAt(0)) {
        return One.prototype.derive.apply(this, [element]);
    } else {
        return Void();
    }
};

var InstanceOf = exports.InstanceOf = function(ctor) {
    if(this instanceof InstanceOf) {
        if(ctor === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(typeof ctor !== 'function') {
            throw new ArgumentError('Not a function: ' + ctor.toString());
        }
        
        if(!(ctor.prototype instanceof Node)) {
            throw new ArgumentError('Constructor does not inherit from Node');
        }
        
        this.ctor = ctor;
        
        return this;
    } else {
        return new InstanceOf(ctor);
    }
};

InstanceOf.prototype = Object.create(One.prototype);
InstanceOf.prototype.constructor = InstanceOf;

InstanceOf.prototype.equals = function(expr) {
    return expr.ctor === this.ctor;
};

InstanceOf.prototype.toString = function() {
    return 'InstanceOf([Function])';
};

InstanceOf.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(element instanceof this.ctor) {
        return Red(Null(), function() {
            return element.childNodes;
        });
    } else {
        return Void();
    }
}

var Unary = function() {};

Unary.prototype = Object.create(Expr.prototype);
Unary.prototype.constructor = Unary;

Unary.define = function(type) {
    var ctor = function(expr) {
        if(this instanceof ctor) {
            if(expr === undefined) {
                throw new ArgumentError('Not enough arguments');
            }
            
            if(!(expr instanceof Expr)) {
                throw new ArgumentError('Not an expression: ' + expr.toString());
            }
            
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

Unary.prototype.isNullable = function() {
    return this.expr.isNullable();
};

Unary.prototype.isVoidable = function() {
    return this.expr.isVoidable();
};

Unary.prototype.delta = function(element) {
    return this.expr.delta(element);
};

Unary.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return new this.constructor(this.expr.derive(element));
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
        throw new ArgumentError('Not enough arguments');
    }
    
    return Null();
};

Any.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Seq(this.expr.derive(element), this);
};

Any.prototype.parseNull = function() {
    return [[]];
};

var Maybe = exports.Maybe = function(expr) {
    return Or(expr, Null());
};

var Many = exports.Many = function(expr) {
    return Seq(expr, Any(expr));
};

var Not = exports.Not = Unary.define('Not');

Not.prototype._simplify = function() {
    if(this.expr instanceof Not) {
        return this.expr.expr;
    } else {
        return this;
    }
};

Not.prototype.isNullable = function() {
    return !this.expr.isNullable();
};

Not.prototype.isVoidable = function() {
    return !this.expr.equals(Void());
};

Not.prototype.delta = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    if(this.expr.delta(element).equals(Void())) {
        return Null();
    } else {
        return Void();
    }
};

Not.prototype.parseNull = function() {
    if(this.expr.isNullable()) {
        return [];
    } else {
        return [[]];
    }
};

var Look = exports.Look = Unary.define('Look');

Look.prototype._simplify = function() {
    if(this.expr.equals(Void())) {
        return Void();
    } else if(this.expr.equals(Null())) {
        return Null();
    } else if(this.expr.equals(Not(Void()))) {
        return Null();
    } else if(this.expr.equals(Not(Null()))) {
        return Void();
    } else if(this.expr instanceof Map) {
        return Look(this.expr.expr);
    } else if(this.expr instanceof Not && this.expr.expr instanceof Map) {
        return Look(Not(this.expr.expr.expr));
    } else {
        return this;
    }
};

Look.prototype.isNullable = function() {
    return true;
};

Look.prototype.isVoidable = function() {
    return true;
};

Look.prototype.delta = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    var deriv = this.expr.derive(element);
    
    if(deriv.isNullable()) {
        return Null();
    } else {
        return Look(deriv);
    }
};

Look.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
    }
    
    return Void();
};

Look.prototype.parseNull = function() {
    return [[]];
};

var Map = exports.Map = function(expr, lambda) {
    if(this instanceof Map) {
        if(expr === undefined || lambda === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(!(expr instanceof Expr)) {
            throw new ArgumentError('Not an expression: ' + expr.toString());
        }
        
        if(typeof lambda !== 'function') {
            throw new ArgumentError('Not a function: ' + lambda.toString());
        }
        
        this.expr = expr;
        this.lambda = lambda;
        
        return this._simplify();
    } else {
        return new Map(expr, lambda);
    }
};

Map.prototype = Object.create(Unary.prototype);
Map.prototype.constructor = Map;

Map.prototype._simplify = function() {
    if(this.expr.equals(Void())) {
        return Void();
    } else {
        return this;
    }
};

Map.prototype.equals = function(expr) {
    return expr instanceof Map && expr.expr.equals(this.expr) && expr.lambda === this.lambda;
};

Map.prototype.toString = function() {
    return 'Map(' + this.expr.toString() + ', [Function])';
};

Map.prototype.derive = function(element) {
    return Map(this.expr.derive(element), this.lambda);
};

Map.prototype.parseNull = function() {
    var result = [];
    
    this.expr.parseNull().forEach(function(list) {
        result = result.concat(this.lambda(list));
    }.bind(this));
    
    return result;
};

var Red = exports.Red = function(expr, lambda) {
    if(lambda === undefined) {
        throw new ArgumentError('Not enough arguments.');
    }
    
    if(typeof lambda !== 'function') {
        throw new ArgumentError('Not a function: ' + lambda.toString());
    }
    
    return Map(expr, function(list) {
        if(!(list instanceof Array)) {
            throw new ArgumentError('Not an array: ' + list.toString());
        }
        
        return [lambda.apply(null, list)];
    });
}

var Capture = exports.Capture = function(expr) {
    return Map(expr, function(list) {
        return [[list]];
    });
};

var Defer = exports.Defer = function(left, right) {
    if(right === undefined) {
        throw new ArgumentError('Not enough arguments.');
    }
    
    if(!(right instanceof Expr)) {
        throw new ArgumentError('Not an expression: ' + right.toString());
    }
    
    return Map(left, function(list) {
        return right.parse(list);
    });
};

var Ignore = exports.Ignore = function(expr) {
    return Map(expr, function() {
        return [[]];
    });
};

var Omit = exports.Omit = function(expr) {
    return Any(Ignore(expr));
};

var Binary = function() {};

Binary.prototype = Object.create(Expr.prototype);
Binary.prototype.constructor = Binary;

Binary.define = function(type) {
    var ctor = function(left, right) {
        if(this instanceof ctor) {
            if(left === undefined || right === undefined) {
                throw new ArgumentError('Not enough arguments');
            }
            
            if(!(left instanceof Expr)) {
                throw new ArgumentError('Not an expression: ' + left.toString());
            }
            
            if(!(right instanceof Expr)) {
                throw new ArgumentError('Not an expression: ' + right.toString());
            }
            
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
        throw new ArgumentError('Not enough arguments');
    }
    
    return And(this.left.delta(element), this.right.delta(element));
};

Binary.prototype.derive = function(element) {
    if(element === undefined) {
        throw new ArgumentError('Not enough arguments');
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
        throw new ArgumentError('Not enough arguments');
    }
    
    return Or(this.left.delta(element), this.right.delta(element));
};

Or.prototype.parseNull = function() {
    return this.left.parseNull().concat(this.right.parseNull());
};

var OneOf = exports.OneOf = function() {
    if(arguments.length === 0) {
        return Void();
    } else {
        return Or(OneOf.apply(null, Array.prototype.slice.apply(arguments, [0, arguments.length - 1])), arguments[arguments.length - 1]);
    }
};

var NoneOf = exports.NoneOf = function() {
    return ButNot(One(), OneOf.apply(null, arguments));
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
        throw new ArgumentError('Not enough arguments');
    }
    
    if(!this.left.isNullable()) {
        return Seq(this.left.derive(element), this.right);
    } else {
        var result = this.left.parseNull();
        
        if(result.length === 1 && result[0].length === 0) {
            return Or(Seq(this.left.derive(element), this.right), this.right.derive(element));
        } else {
            return Or(Seq(this.left.derive(element), this.right), Seq(Map(Null(), function() {
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
    if(this.left.parseNull().length === 0) {
        return [];
    } else {
        return this.right.parseNull();
    }
};

var ButNot = exports.ButNot = function(left, right) {
    return And(left, Not(right));
};

var Node = exports.Node = function(type, childNodes) {
    if(this instanceof Node) {
        if(type === undefined || childNodes === undefined) {
            throw new ArgumentError('Not enough arguments');
        }
        
        if(typeof type !== 'string') {
            throw new ArgumentError('Not a string: ' + type.toString());
        }
        
        if(!(childNodes instanceof Array)) {
            throw new ArgumentError('Not a array: ' + childNodes.toString());
        }
        
        this.type = type;
        this.childNodes = childNodes;
        
        return this;
    } else {
        return new Node(type, childNodes);
    }
};

Node.define = function(type) {
    var ctor = function() {
        if(this instanceof ctor) {
            return Node.apply(this, [type, Array.prototype.slice.apply(arguments)]);
        } else {
            return ctor.apply(Object.create(ctor.prototype), arguments);
        }
    };
    
    ctor.prototype = Object.create(Node.prototype);
    ctor.prototype.constructor = ctor;
    
    return ctor;
};

Node.prototype.toString = function() {
    return this.type + '(' + this.childNodes.map(function(childNode) {
        if(typeof childNode === 'string') {
            return JSON.stringify(childNode);
        } else {
            return childNode.toString();
        }
    }).join(', ') + ')';
};
