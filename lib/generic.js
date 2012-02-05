var util   = require('util'),
    common = require('./common');

var Expr = common.Expr,
    Void = common.Void,
    Null = common.Null,
    Or   = common.Or,
    Seq  = common.Seq,
    Join = common.Join,
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
    return Join(Null(), function(x) { return [[char].concat(x)]; });
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
//        var matches = this.cache.filter(function(entry) {
//            return JSON.stringify(entry.element) === JSON.stringify(element);
//        });
//        
//        if(matches.length > 0) {
//            return matches[0].result;
//        }
        
        var result = new Ref(function() {
            throw new Error("Unable to find fixed point for derive");
        });
        
        this.fixed.derive = result;
        
        this.expr = this.expr || this.func();
        
        var found = this.expr.derive(element);
        
        this.fixed.derive.func = function() {
            return found;
        }
        
        this.fixed.derive = undefined;
        
//        this.cache.push({
//            element: element,
//            result: result
//        });
        
        return result;
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
    if(this.constructor === Literal) {
        this.str = str;
        
        return this.simplify();
    } else {
        return new Literal(str);
    }
}

util.inherits(Literal, One);

Literal.prototype.derive = function(element) {
    if(element instanceof Node) {
        if(element.value.join('') === this.str) {
            return Join(Null(), function(x) { return [element.value.concat(x)]; });
        } else {
            return Void();
        }
    } else {
        if(element === this.str.charAt(0)) {
            var substr = this.str.substring(1);
            
            return Seq(Join(Null(), function(x) { return [[element].concat(x)]; }), Literal(substr));
        } else {
            return Void();
        }
    }
};

Literal.prototype.toString = function() {
    return 'Literal("' + this.str + '")';
};

Literal.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.str === expr.str;
};

Literal.prototype.simplify = function() {
    if(this.str === '') {
        return Null();
    } else {
        return this;
    }
};

function InstanceOf(type) {
    if(this.constructor === InstanceOf) {
        this.type = type;
        
        return this;
    } else {
        return new InstanceOf(type);
    }
}

util.inherits(InstanceOf, One);

InstanceOf.prototype.derive = function(token) {
    if(token instanceof this.type) {
        return Join(Null(), function(x) { return [[token.value.join('')].concat(x)]; });
    } else {
        return Void();
    }
};

InstanceOf.prototype.toString = function() {
    return 'InstanceOf("[Function]")';
};

InstanceOf.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.type === expr.type;
};

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

function Cons(id) {
    var cons = function(value, metadata) {
        if(this.constructor === cons) {
            Node.apply(this, [id, value, metadata]);
            
            return this;
        } else {
            return new cons(value, metadata);
        }
    };
    
    cons.prototype = Object.create(Node.prototype);
    cons.prototype.constructor = cons;
    
    return cons;
}

Expr.prototype.isVoid = function() { return this.equals(Void()); };
Ref.prototype.isVoid = function() { this.expr = this.expr || this.func(); return this.expr.equals(Void()); };

function parse(expr, str) {
    for(var i = 0; i < str.length; i++) {
        expr = expr.derive(str[i]);
    }
    
    return expr.parseNull();
}

function List(values) {
    return values;
}

function Text(values) {
    return Array.prototype.join.apply(values, ['']);
}

exports.Char       = Char;
exports.One        = One;
exports.Range      = Range;
exports.Ref        = Ref;
exports.Literal    = Literal;
exports.InstanceOf = InstanceOf;

exports.Node    = Node;
exports.Cons    = Cons;

exports.parse   = parse;

exports.List    = List;
exports.Text    = Text;
