var util   = require('util'),
    common = require('./common');

var Expr    = common.Expr,
    Void    = common.Void,
    Null    = common.Null,
    Or      = common.Or,
    Seq     = common.Seq,
    RedMany = common.RedMany,
    Any     = common.Any;

function One() {
    if(this.constructor === One) {
        return this;
    } else {
        return new One();
    }
}

util.inherits(One, Expr);

One.prototype.derive = function(char) {
    return RedMany(Null(), function(x) { return [[char].concat(x)]; });
};

One.prototype.delta = function() {
    return Void();
};

One.prototype.parseNull = function() {
    return [];
};

One.prototype.toString = function() {
    return "One()";
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
        
        this.fixed = {
            derive: undefined,
            delta: undefined,
            isNullable: undefined,
            parseNull: undefined
        };
        
        this.cache = [];
        
        return this;
    } else {
        return new Ref(func);
    }
}

util.inherits(Ref, Expr);

Ref.prototype.derive = function(element) {
    if(this.fixed.derive === undefined) {
        this.fixed.derive = new Ref(function() {
            throw new Error("Unable to find fixed point for derive");
        });
        
        this.expr = this.expr || this.func();
        
        var found = this.expr.derive(element);
        
        this.fixed.derive.func = function() {
            return found;
        }
        
        this.fixed.derive = undefined;
        
        return found;
    } else {
        return this.fixed.derive;
    }
};

Ref.prototype.delta = function() {
    if(this.fixed.delta === undefined) {
        var found = undefined;
        
        [Null(), Void()].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.delta = fixed;
                
                this.expr = this.expr || this.func();
                
                if(this.expr.delta().equals(fixed)) {
                    found = fixed;
                }
                
                //this.fixed.delta = undefined;
            } else {
                return;
            }
        }.bind(this));
        
        if(found === undefined) {
            throw new Error("Unable to find fixed point for delta");
        } else {
            return found;
        }
    } else {
        return this.fixed.delta;
    }
};

Ref.prototype.isNullable = function() {
    if(this.fixed.isNullable === undefined) {
        var found = undefined;
        
        [true, false].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.isNullable = fixed;
                
                this.expr = this.expr || this.func();
                
                if(this.expr.isNullable() === fixed) {
                    found = fixed;
                }
                
                //this.fixed.isNullable = undefined;
            } else {
                return;
            }
        }.bind(this));
        
        if(found === undefined) {
            throw new Error("Unable to find fixed point for isNullable");
        } else {
            return found;
        }
    } else {
        return this.fixed.isNullable;
    }
};

Ref.prototype.parseNull = function() {
    if(this.fixed.parseNull === undefined) {
        var found;
        
        this.fixed.parseNull = [];
        
        this.expr = this.expr || this.func();
        
        found = this.expr.parseNull();
        
        // TODO: decent equals function
        while(JSON.stringify(this.fixed.parseNull) !== JSON.stringify(found)) {
            this.fixed.parseNull = found;
            
            found = this.expr.parseNull();
        }
        
        //this.fixed.parseNull = undefined;
        
        return found;
    } else {
        return this.fixed.parseNull;
    }
};

Ref.prototype.equals = function(expr) {
    return this === expr;
};

Ref.prototype.toString = function() {
    return "Ref([Function])";
};

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
    
    if(typeof this.value === 'string') {
        this.value = [];
        
        for(var i = 0; i < value.length; i ++) {
            this.value.push(value[i]);
        }
    }
}

Node.prototype.toString = function() {
    return this.type + '(' + JSON.stringify(this.value) + ')';
};

Node.prototype.equals = function(node) {
    if(this.type !== node.type) {
        return false;
    } else {
        if(this.value.length !== node.value.length) {
            return false;
        }
        
        var i = this.value.length;
        
        while(i--) {
            if(typeof this.value[i] === 'string') {
                if(this.value[i] !== node.value[i]) {
                    return false;
                }
            } else {
                if(!this.value[i].equals(node.value[i])) {
                    return false;
                }
            }
        }
    }
    
    return true;
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
