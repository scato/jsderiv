var util   = require('util'),
    common = require('./common');

var Expr = common.Expr,
    Void = common.Void,
    Null = common.Null,
    Or   = common.Or,
    Seq  = common.Seq,
    Red  = common.Red,
    Any  = common.Any;

function One() {
    if(this.constructor === One) {
        return this;
    } else {
        return new One();
    }
}

util.inherits(One, Expr);

One.prototype.derive = function(char) {
    return Red(Null(), function(x) { return [[char].concat(x)]; });
};

One.prototype.delta = function() {
    return Void();
};

One.prototype.parseNull = function() {
    return [];
};

function Char(char) {
    if(this.constructor === Char) {
        this.char = char;
        
        return this;
    } else {
        return new Char(char);
    }
}

util.inherits(Char, One);

Char.prototype.derive = function(char) {
    if(this.char === char) {
        return One.prototype.derive.apply(this, [char]);
    } else {
        return Void();
    }
};

Char.prototype.toString = function() {
    return 'Char("' + this.char + '")';
};

Char.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.char === expr.char;
};

function Range(from, to) {
    if(this.constructor === Range) {
        this.from = from;
        this.to   = to;
        
        return this;
    } else {
        return new Range(from, to);
    }
}

util.inherits(Range, One);

Range.prototype.derive = function(char) {
    if(this.from.charCodeAt(0) <= char.charCodeAt(0) && char.charCodeAt(0) <= this.to.charCodeAt(0)) {
        return One.prototype.derive.apply(this, [char]);
    } else {
        return Void();
    }
};

Range.prototype.toString = function() {
    return 'Range("' + this.from + '", "' + this.to + '")';
};

Range.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.from === expr.from
        && this.to === expr.to;
};

function Ref(func) {
    if(this.constructor === Ref) {
        this.func = func;
        this.expr = undefined;
        
        return this;
    } else {
        return new Ref(func);
    }
}

util.inherits(Ref, Expr);

Ref.prototype.derive = function(element) {
    this.expr = this.expr || this.func();
    
    return this.expr.derive(element);
};

Ref.prototype.delta = function() {
    this.expr = this.expr || this.func();
    
    return this.expr.delta();
};

Ref.prototype.isNullable = function() {
    this.expr = this.expr || this.func();
    
    return this.expr.isNullable();
};

Ref.prototype.parseNull = function() {
    this.expr = this.expr || this.func();
    
    return this.expr.parseNull();
};

Ref.prototype.toString = function() {
    return "Ref([Function])";
}

function Literal(str) {
    if(str.length === 0) {
        return Null();
    } else if(str.length === 1) {
        return Char(str);
    } else {
        var length = str.length - 1;
        
        return Seq(Literal(str.substr(0, length)), Char(str[length]));
    }
}

function Node(type, value, metadata) {
    this.type = type;
    this.value = value;
    this.metadata = metadata;
}

Node.prototype.toString = function() {
    return this.type + '(' + JSON.stringify(this.value) + ')';
};

Node.prototype.equals = function(node) {
    return this.type === node.type && this.value === node.value;
};

function parse(expr, str) {
    for(var i = 0; i < str.length; i++) {
        expr = expr.derive(str.charAt(i));
    }
    
    return expr.parseNull();
}

exports.Char    = Char;
exports.One     = One;
exports.Range   = Range;
exports.Ref     = Ref;
exports.Literal = Literal;

exports.Node    = Node;

exports.parse   = parse;
