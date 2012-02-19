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

One.prototype.isNull = function() {
    return false;
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

function Ref(func, name) {
    if(this.constructor === Ref) {
        this.func = func;
        this.name = name;
        this.expr = undefined;
        
        this.fixed = {
            derive: undefined,
            delta: undefined,
            isNullable: undefined,
            isNull: undefined,
            parseNull: undefined
        };
        
        this.cache = {
            derive: {},
            delta: {}
        };
        
        return this;
    } else {
        return new Ref(func, name);
    }
}

util.inherits(Ref, Expr);

Ref.prototype.derive = function(element) {
    if(this.cache.derive[String(element)] !== undefined) {
        return this.cache.derive[String(element)];
    } else if(this.fixed.derive === undefined) {
        var result, found;
        
        this.expr = this.expr || this.func();
        
        // first try Void
        this.fixed.derive = Void();
        
        found = this.expr.derive(element);
        
        if(found.equals(Void())) {
            var sys = require('sys');
            
            this.cache.derive[String(element)] = found;
            this.fixed.derive = undefined;
            
            return found;
        }
        
        // otherwise, define a reference as being the result
        result = new Ref(function() {
            throw new Error("Unable to find fixed point for derive");
        }, this.name + '\'');
        
        this.fixed.derive = result;
        
        found = this.expr.derive(element);
        
        result.func = function() {
            return found;
        }
        
        this.cache.derive[String(element)] = result;
        this.fixed.derive = undefined;
        
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

Ref.prototype.isNull = function() {
    if(this.fixed.isNull === undefined) {
        var found = undefined;
        
        [false, true].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.isNull = fixed;
                
                // FIXME: aargh
                try {
                    this.expr = this.expr || this.func();
                } catch(error) {
                    // no fixed point for derive yet, but we need a value for isNull to get it...
                    // assume false, but try again later
                    this.fixed.isNull = undefined;
                    found = false;
                    return;
                }
                
                if(this.expr.isNull() === fixed) {
                    found = fixed;
                }
                
                //this.fixed.isNull = undefined;
            } else {
                return;
            }
        }.bind(this));
        
        if(found === undefined) {
            throw new Error("Unable to find fixed point for isNull");
        } else {
            return found;
        }
    } else {
        return this.fixed.isNull;
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
    return "Ref([" + this.name + "])";
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

Node.prototype.indent = true;

Node.prototype.toString = function(prefix) {
    prefix = prefix === undefined ? '' : prefix;
    
    if(this.value.every(function(x) { return typeof x === 'string' && x.length === 1; })) {
        return prefix + this.type + ' ' + String(this.value.join(''));
    } else if(this.indent) {
        var extra = '    ';
        var newPrefix = prefix + extra;
        return prefix + this.type + '(\n' + this.value.map(function(x) {
            if(typeof x === 'string') {
                return newPrefix + x;
            } else if(x instanceof Array) {
                return newPrefix + '[\n' + x.map(function(y) { return y.toString(newPrefix + extra); }).join(',\n') + '\n' + newPrefix + ']';
            } else {
                return x.toString(newPrefix);
            }
        }).join(',\n') + '\n' + prefix + ')';
    } else {
        return prefix + this.type + '(' + this.value.map(function(x) {
            if(typeof x === 'string') {
                return x;
            } else if(x instanceof Array) {
                return '[' + x.map(function(y) { return y.toString(); }).join(', ') + ']';
            } else {
                return x.toString();
            }
        }).join(', ') + ')';
    }
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

function parse(expr, str, report) {
    for(var i = 0; i < str.length; i++) {
        expr = expr.derive(str[i]);
        
        if(report && expr.equals(Void())) {
            if(str[i] instanceof Node) {
                throw new Error("Parse error: unexpected token " + str[i].toString());
            } else {
                var lines = str.substr(0, i).split('\n');
                var line = lines.length;
                var char = lines.pop().length + 1;
                throw new Error("Parse error: unexpected character " + JSON.stringify(str[i]) + " at " + line + ":" + char);
            }
        }
    }
    
    var result = expr.parseNull();
    
    if(!report) {
        return result;
    } else if(result.length === 0) {
        var error = new Error("Parse error: expected more input");
        
        throw error;
    } else if(result.length > 1) {
        var error = new Error("Parse error: ambiguous expression");
        error.result = result;
        
        throw error;
    } else {
        return result[0];
    }
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
