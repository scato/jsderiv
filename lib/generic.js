var util    = require('util'),
    common  = require('./common'),
    unicode = require('./unicode');

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

One.prototype.derive = function(chr) {
    return Join(Null(), function(x) { return [[chr].concat(x)]; });
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

function Char(chr) {
    if(this.constructor === Char) {
        this.chr = chr;
        
        return this;
    } else {
        return new Char(chr);
    }
}

util.inherits(Char, One);

Char.prototype.derive = function(chr) {
    if(this.chr === chr) {
        return One.prototype.derive.apply(this, [chr]);
    } else {
        return Void();
    }
};

Char.prototype.toString = function() {
    return 'Char("' + this.chr + '")';
};

Char.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.chr === expr.chr;
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

Range.prototype.derive = function(chr) {
    if(this.from.charCodeAt(0) <= chr.charCodeAt(0) && chr.charCodeAt(0) <= this.to.charCodeAt(0)) {
        return One.prototype.derive.apply(this, [chr]);
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

function Category(str) {
    if(this.constructor === Category) {
        var match = str.match(/^\\([dDsSwWpP])(?:{([A-Za-z_]+)})?$/);
        
        if(match === null) {
            throw new Error("invalid category: '" + str + "'");
        } else if(match[1].toLowerCase() === 'p') {
            this.type = 'unicode';
            this.category = match[2];
            this.complement = /[A-Z]/.test(match[1]);
            
            if(Category.unicode[this.category] === undefined) {
                throw new Error("invalid unicode category: '" + this.category + "'");
            }
        } else {
            this.type = 'regexp';
            this.category = match[1];
        }
    } else {
        return new Category(str);
    }
}

util.inherits(Category, One);

Category.regexp = {
    d: /\d/,
    D: /\D/,
    s: /\s/,
    S: /\S/,
    w: /\w/,
    W: /\W/
}

Category.unicode = unicode.categories;

Category.prototype.derive = function(chr) {
    if(this.type === 'regexp') {
        if(Category.regexp[this.category].test(chr)) {
            return One.prototype.derive.apply(this, [chr]);
        } else {
            return Void();
        }
    } else {
        var pairs = Category.unicode[this.category];
        var ord = chr.charCodeAt(0);
        
        for(var i = 0; i < pairs.length; i += 2) {
            if(pairs[i + 1] <= ord) {
                continue;
            } else if(ord < pairs[i]) {
                // does not match
                return this.complement ? One.prototype.derive.apply(this, [chr]) : Void();
            } else {
                // matches
                return this.complement ? Void() : One.prototype.derive.apply(this, [chr]);
            }
        }
    }
}

Category.prototype.toString = function() {
    
};

Category.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.type === expr.type
        && this.category === expr.category;
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

Ref.prototype.derive = function(element, metadata) {
    var key = String(element) + (metadata === undefined ? '' : ':' + metadata.line + ':' + metadata.chr);
    
    if(this.cache.derive[key] !== undefined) {
        return this.cache.derive[key];
    } else if(this.fixed.derive === undefined) {
        var result, found;
        
        this.expr = this.expr || this.func();
        
        // first try Void
        this.fixed.derive = Void();
        
        found = this.expr.derive(element, metadata);
        
        if(found.equals(Void())) {
            this.cache.derive[key] = found;
            this.fixed.derive = undefined;
            
            return found;
        }
        
        // otherwise, define a reference as being the result
        result = new Ref(function() {
            throw new Error("Unable to find fixed point for derive");
        }, this.name + '\'');
        
        this.fixed.derive = result;
        
        found = this.expr.derive(element, metadata);
        
        result.func = function() {
            return found;
        }
        
        this.cache.derive[key] = result;
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
    if(typeof element === 'string') {
        if(element === this.str.charAt(0)) {
            var substr = this.str.substring(1);
            
            return Seq(Join(Null(), function(x) { return [[element].concat(x)]; }), Literal(substr));
        } else {
            return Void();
        }
    } else if(element instanceof Node) {
        if(element.value.join('') === this.str) {
            return Join(Null(), function(x) { return [element.value.concat(x)]; });
        } else {
            return Void();
        }
    } else {
        if(element.join('') === this.str) {
            return Join(Null(), function(x) { return [element.concat(x)]; });
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

function Capture(expr) {
    if(this.constructor === Capture) {
        this.expr = expr;
        
        return this;
    } else {
        return new Capture(expr);
    }
}

util.inherits(Capture, One);

Capture.prototype.derive = function(element) {
    if(typeof element === 'string') {
        return new Capture(this.expr.derive(element));
    } else if(element instanceof Node) {
        // could be semantically wrong...
        return this.derive(element.value);
    } else {
        if(match(this.expr, element)) {
            return Join(Null(), function() { return [element]; });
        } else {
            return Void();
        }
    }
};

Capture.prototype.toString = function() {
    return 'Capture(' + this.expr.toString() + ')';
};

Capture.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr);
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

function parse(expr, str, report, debug) {
    var l = 1;
    
    for(var i = 0; i < str.length; i++) {
        var metadata, line, chr;
        
        if(report) {
            if(str[i] instanceof Node) {
                metadata = str[i].metadata;
            } else {
                var lines = str.substr(0, i).split('\n');
                line = lines.length;
                chr = lines.pop().length + 1;
                
                metadata = {chr: chr, line: line};
            }
        }
        
        expr = expr.derive(str[i], metadata);
        
        if(debug && str[i] === '\n') {
            require('sys').puts('line ' + l++);
            require('sys').puts('size ' + expr.func().toString().length);
            
            //if(l == 820) break;
        }
        
        if(report && expr.equals(Void())) {
            if(str[i] instanceof Node) {
                throw new Error("Parse error: unexpected token " + str[i].toString() + " at " + metadata.line + ':' + metadata.chr);
            } else {
                throw new Error("Parse error: unexpected character " + JSON.stringify(str[i]) + " at " + metadata.line + ":" + metadata.chr);
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

function match(expr, str) {
    return parse(expr, str).length > 0;
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
exports.Category   = Category;
exports.Ref        = Ref;
exports.Literal    = Literal;
exports.InstanceOf = InstanceOf;
exports.Capture    = Capture;

exports.Node    = Node;
exports.Cons    = Cons;

exports.parse   = parse;
exports.match   = match;

exports.List    = List;
exports.Text    = Text;
