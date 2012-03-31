// http://www.ccs.neu.edu/home/turon/re-deriv.pdf
// http://arxiv.org/PS_cache/arxiv/pdf/1010/1010.5023v1.pdf

var util = require('util');

function trim(treeset) {
    var found = [];
    var trimmed = [];
    
    treeset.forEach(function(tree) {
        var json = JSON.stringify(tree);
        
        if(found.indexOf(json) === -1) {
            found.push(json);
            trimmed.push(tree);
        }
    });
    
    return trimmed;
}

function Expr() {
    if(this.constructor === Expr) {
        throw new Error('Cannot instantiate abstract class Expr');
    }
};

Expr.prototype.simplify = function() {
    return this;
};

Expr.prototype.equals = function(expr) {
    return this.constructor === expr.constructor;
};

Expr.prototype.isNullable = function() {
    return this.delta().equals(Null());
};

Expr.prototype.isNull = function() {
    throw new Error("Not implemented");
};

function Void() {
    if(this.constructor === Void) {
        return this;
    } else {
        return new Void();
    }
}

util.inherits(Void, Expr);

Void.prototype.derive = function() {
    return Void();
};

Void.prototype.delta = function() {
    return Void();
};

Void.prototype.toString = function() {
    return 'Void()';
};

Void.prototype.parseNull = function() {
    return [];
};

Void.prototype.isNull = function() {
    return false;
};

function Null() {
    if(this.constructor === Null) {
        return this;
    } else {
        return new Null();
    }
}

util.inherits(Null, Expr);

Null.prototype.derive = function() {
    return Void();
};

Null.prototype.delta = function() {
    return Null();
};

Null.prototype.toString = function() {
    return 'Null()';
};

Null.prototype.parseNull = function() {
    return [[]];
};

Null.prototype.isNull = function() {
    return true;
};

function Seq(left, right) {
    if(this.constructor === Seq) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new Seq(left, right);
    }
}

util.inherits(Seq, Expr);

Seq.prototype.derive = function(element, metadata) {
    if(!this.left.isNullable()) {
        return Seq(this.left.derive(element, metadata), this.right);
    } else {
        var result = this.left.parseNull();
        var left;
        
        if(result.length === 1 && result[0].length === 0) {
            // in case of Ignore, this will happen often
            left = Null();
        } else {
            var func = function() { return result; };
            left = Join(this.left.delta(), func);
        }
        
        // D(r) . s | d(left) +> f . D(right)
        return Or(Seq(this.left.derive(element, metadata), this.right), Seq(left, this.right.derive(element, metadata)));
    }
};

Seq.prototype.delta = function() {
    return And(this.left.delta(), this.right.delta());
};

Seq.prototype.toString = function() {
    return 'Seq(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Seq.prototype.simplify = function() {
    if(this.left.equals(Void()) || this.right.equals(Void())) {
        return Void();
    } else if(this.left.equals(Null())) {
        return this.right;
    } else if(this.right.equals(Null())) {
        return this.left;
    } else if(this.right instanceof Seq) {
        return Seq(Seq(this.left, this.right.left), this.right.right);
//    } else if(this.left.isNull()) {
//        var result = this.left.parseNull();
//        
//        return Join(this.right, function(x) {
//            return result.map(function(y) {
//                return y.concat(x);
//            });
//        });
    } else {
        return this;
    }
};

Seq.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.left.equals(expr.left)
        && this.right.equals(expr.right);
};

Seq.prototype.parseNull = function() {
    var result = [];
    
    this.left.parseNull().forEach(function(x) {
        this.right.parseNull().forEach(function(y) {
            result.push(x.concat(y));
        }.bind(this));
    }.bind(this));
    
    return result;
};

Seq.prototype.isNull = function() {
    return this.left.isNull() && this.right.isNull();
};

function Or(left, right) {
    if(this.constructor === Or) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new Or(left, right);
    }
};

util.inherits(Or, Expr);

Or.prototype.derive = function(element, metadata) {
    return Or(this.left.derive(element, metadata), this.right.derive(element, metadata));
};

Or.prototype.delta = function() {
    return Or(this.left.delta(), this.right.delta());
};

Or.prototype.toString = function() {
    return 'Or(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

Or.prototype.contains = function(expr) {
    if(this.right.equals(expr)) {
        return true;
    } else {
        if(this.left instanceof Or) {
            return this.left.contains(expr);
        } else {
            return this.left.equals(expr);
        }
    }
}

Or.prototype.simplify = function() {
    if(this.left.equals(Void())) {
        return this.right;
    } else if(this.right.equals(Void())) {
        return this.left;
    } else if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Not(Void())) || this.right.equals(Not(Void()))) {
        return Not(Void());
    } else if(this.right instanceof Or) {
        return Or(Or(this.left, this.right.left), this.right.right);
//    } else if(this.left instanceof Or && this.left.contains(this.right)) {
//        return this.left;
    } else {
        return this;
    }
};

Or.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && ( (this.left.equals(expr.left) && this.right.equals(expr.right))
          || (this.left.equals(expr.right) && this.right.equals(expr.left))
        );
};

Or.prototype.parseNull = function() {
    return trim(this.left.parseNull().concat(this.right.parseNull()));
};

Or.prototype.isNull = function() {
    return this.left.isNull() && this.right.isNull();
};

function And(left, right) {
    if(this.constructor === And) {
        this.left = left;
        this.right = right;
        
        return this.simplify();
    } else {
        return new And(left, right);
    }
}

util.inherits(And, Expr);

And.prototype.derive = function(element, metadata) {
    return And(this.left.derive(element, metadata), this.right.derive(element, metadata));
};

And.prototype.delta = function() {
    return And(this.left.delta(), this.right.delta());
};

And.prototype.toString = function() {
    return 'And(' + this.left.toString() + ', ' + this.right.toString() + ')';
};

And.prototype.parseNull = function() {
    if(this.right.isNullable()) {
        return trim(this.left.parseNull().concat(this.right.parseNull()));
    } else {
        return [];
    }
};

And.prototype.simplify = function() {
    if(this.left.equals(Void()) || this.right.equals(Void())) {
        return Void();
    } else if(this.left.equals(this.right)) {
        return this.left;
    } else if(this.left.equals(Not(Void()))) {
        return this.right;
    } else if(this.right.equals(Not(Void()))) {
        return this.left;
    } else if(this.right instanceof And) {
        return And(And(this.left, this.right.left), this.right.right);
    } else {
        return this;
    }
};

And.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && ( (this.left.equals(expr.left) && this.right.equals(expr.right))
          || (this.left.equals(expr.right) && this.right.equals(expr.left))
        );
};

And.prototype.isNull = function() {
    // FIXME: or if the only point of intersection is the empty string :(
    return this.left.isNull() || this.right.isNull();
};

function Any(expr) {
    if(this.constructor === Any) {
        this.expr = expr;
        
        return this.simplify();
    } else {
        return new Any(expr);
    }
}

util.inherits(Any, Expr);

Any.prototype.derive = function(element, metadata) {
    return Seq(this.expr.derive(element, metadata), Any(this.expr));
};

Any.prototype.delta = function() {
    return Null();
};

Any.prototype.toString = function() {
    return 'Any(' + this.expr.toString() + ')';
};

Any.prototype.simplify = function() {
    if(this.expr.equals(Void())) {
        return Null();
    } else if(this.expr.equals(Null())) {
        return Null();
    } else if(this.expr instanceof Any) {
        return this.expr;
    } else {
        return this;
    }
};

Any.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr);
};

Any.prototype.parseNull = function() {
    return [[]];
};

Any.prototype.isNull = function() {
    return false;
};

function Not(expr) {
    if(this.constructor === Not) {
        this.expr = expr;
        
        return this.simplify();
    } else {
        return new Not(expr);
    }
}

util.inherits(Not, Expr);

Not.prototype.derive = function(element, metadata) {
    return Join(Not(this.expr.derive(element, metadata)), function(x) { return [[element].concat(x)]; });
    //return Not(this.expr.derive(element));
};

Not.prototype.delta = function() {
    if(this.expr.delta().equals(Void())) {
        return Null();
    } else {
        return Void();
    }
};

Not.prototype.toString = function() {
    return 'Not(' + this.expr.toString() + ')';
};

Not.prototype.simplify = function() {
    var One = require('./generic').One;
    
    if(this.expr instanceof Not) {
        return this.expr.expr;
    } else if(this.expr instanceof Red || this.expr instanceof Join) {
        return Not(this.expr.expr);
    // FIXME: this improves speed a lot, but it should check for Voidability (isVoidable)
    } else if(this.expr instanceof Seq && this.expr.left.isNullable() && this.expr.right.equals(Any(One()))) {
        return Void();
    } else {
        return this;
    }
};

Not.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr);
};

Not.prototype.parseNull = function() {
    if(this.expr.isNullable()) {
        return [];
    } else {
        return [[]];
    }
};

Not.prototype.isNull = function() {
    // true if this.expr is equal to Any(One())
    // FIXME: introduce isVoidable, this method should return !this.isVoidable()
    return false;
};

function Red(expr, func, metadata) {
    if(this.constructor === Red) {
        this.expr = expr;
        this.func = func;
        this.metadata = metadata;
        
        return this.simplify();
    } else {
        return new Red(expr, func, metadata);
    }
}

util.inherits(Red, Expr);

Red.prototype.derive = function(element, metadata) {
    return Red(this.expr.derive(element, metadata), this.func, metadata);
};

Red.prototype.delta = function() {
    return this.expr.delta();
};

Red.prototype.toString = function() {
    return 'Red(' + this.expr.toString() + ', [Function])';
};

Red.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.expr.equals(expr.expr)
        && this.func === expr.func;
};

Red.prototype.parseNull = function() {
    var result = [];
    
    this.expr.parseNull().forEach(function(list) {
        var tree = this.func(list, this.metadata);
        
        if(tree === undefined) {
            result.push([]);
        } else {
            result.push([tree]);
        }
    }.bind(this));
    
    return result;
};

Red.prototype.simplify = function() {
    if(this.expr.equals(Void())) {
        return Void();
    } else {
        return this;
    }
};

Red.prototype.isNull = function() {
    return this.expr.isNull();
};

function Join(expr, func) {
    if(this.constructor === Join) {
        this.expr = expr;
        this.func = func;
        
        return this.simplify();
    } else {
        return new Join(expr, func);
    }
}

util.inherits(Join, Red);

Join.prototype.derive = function(element, metadata) {
    return Join(this.expr.derive(element, metadata), this.func);
//    return Join(this.expr.derive(element, metadata), function(){
//        return this.func.apply(null, Array.prototype.slice.apply(arguments).concat([metadata]));
//    }.bind(this));
};

Join.prototype.parseNull = function() {
    var result = [];
    
    this.expr.parseNull().forEach(function(tree) {
        this.func(tree).forEach(function(tree) {
            result.push(tree);
        });
    }.bind(this));
    
    return result;
};

// * = any
// + = many
// ? = opt

function Maybe(expr)  {
    return Or(expr, Null());
}

function Many(expr) {
    return Seq(expr, Any(expr));
}

function Ignore(expr) {
    return Red(expr, function() { return undefined; });
}

function Ref(id) {
    if(this.constructor === Ref) {
        throw new Error('Cannot instantiate abstract class Ref');
    } else {
        this.id = id;
        
        this.fixed = {
            derive: undefined,
            delta: undefined,
            toString: undefined,
            parseNull: undefined
        };
    }
};

util.inherits(Ref, Expr);

Ref.prototype.resolve = function() {
    var self = this.constructor;
    
    if(self.definitions[this.id] === undefined) {
        throw new Error("Could not resolve reference to '" + this.id + "', no definition found.");
    } else {
        return self.definitions[this.id];
    }
};

Ref.prototype.derive = function(element, metadata) {
    var self = this.constructor;
    
    if(this.fixed.derive !== undefined) {
        return this.fixed.derive;
    } else {
        // We could use every existing definition as fixed points,
        // but simplify() doesn't work good enough for us to use
        // equals() to conclude that these two expressions are equal:
        // A := A | C    and    B := B | C
        
        var found = undefined;
        
        [Void(), Null()].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.derive = fixed;
                
                if(this.resolve().derive(element, metadata).equals(fixed)) {
                    found = fixed;
                }
                
                this.fixed.derive = undefined;
            }
        }.bind(this));
        
        if(found !== undefined) {
            return found;
        } else {
            var id = this.id + "_" + element.toString();
            
            this.fixed.derive = self(id);
            
            self.define(id, this.resolve().derive(element, metadata), null);
            
            this.fixed.derive = undefined;
            
            return self(id);
        }
    }
};

Ref.prototype.delta = function(char) {
    if(this.fixed.delta !== undefined) {
        return this.fixed.delta;
    } else {
        var found = undefined;
        
        [Void(), Null()].forEach(function(fixed) {
            if(found === undefined) {
                this.fixed.delta = fixed;
                
                if(this.resolve().delta().equals(fixed)) {
                    found = fixed;
                }
                
                this.fixed.delta = undefined;
            }
        }.bind(this));
        
        if(found === undefined) {
            throw new Error('Unable to find fixed point for delta on ' + this.id + '.');
        } else {
            return found;
        }
    }
};

// write out one layer of recursion for references
Ref.prototype.toString = function() {
    if(this.fixed.toString !== undefined) {
        return this.fixed.toString;
    } else {
        this.fixed.toString = 'Ref("' + this.id + '")';
        
        var result = this.resolve().toString();
        
        this.fixed.toString = undefined;
        
        return result;
    }
};

Ref.prototype.simplify = function() {
    var self = this.constructor;
    
    if(self.references[this.id] !== undefined) {
        return self.references[this.id];
    } else {
        self.references[this.id] = this;
        
        return this;
    }
};

Ref.prototype.equals = function(expr) {
    return Expr.prototype.equals.apply(this, [expr])
        && this.id === expr.id;
};

Ref.prototype.parseNull = function() {
    if(this.fixed.parseNull !== undefined) {
        return this.fixed.parseNull;
    } else {
        this.fixed.parseNull = [];
        
        function equal(a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        
        while(true) {
            var a = this.resolve().parseNull();
            var b = this.fixed.parseNull;
            
            if(equal(a, b)) {
                this.fixed.parseNull = undefined;
                
                return a;
            } else {
                this.fixed.parseNull = a;
            }
        }
    }
};

// todo: implement as Register-class instead of Def-mixin
function Def(Ref) {
    Ref.definitions = {};
    Ref.references = {};
    
    Ref.createCons = function(id) {
        throw new Error("Cannot call abstract method Ref.createCons");
    };

    Ref.createFunc = function(cons) {
        throw new Error("Cannot call abstract method Ref.createFunc");
    };

    Ref.define = function(id, expr, cons) {
        if(cons === undefined) {
            cons = Ref.createCons(id);
        }
        
        if(cons === null) {
            Ref.definitions[id] = expr;
        } else {
            Ref.definitions[id] = Red(expr, Ref.createFunc(cons));
        }
        
        return cons;
    };
}

exports.Expr   = Expr;
exports.Void   = Void;
exports.Null   = Null;
exports.Seq    = Seq;
exports.Or     = Or;
exports.And    = And;
exports.Any    = Any;
exports.Not    = Not;
exports.Red    = Red;
exports.Join   = Join;
exports.Maybe  = Maybe;
exports.Ignore = Ignore;
exports.Many   = Many;
exports.Ref    = Ref;
exports.Def    = Def;

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

Capture.prototype.delta = function() {
    return this.expr.delta();
};

Capture.prototype.parseNull = function() {
    return this.expr.parseNull();
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
