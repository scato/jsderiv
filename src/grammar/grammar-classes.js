var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

require('./legacy');

var List = g.List,
    Text = g.Text;

// export constructor Class, Char, Control, Unicode, Range, Category, Not;
var Class    = exports.Class    = g.Cons("Class");
var Char     = exports.Char     = g.Cons("Char");
var Control  = exports.Control  = g.Cons("Control");
var Unicode  = exports.Unicode  = g.Cons("Unicode");
var Range    = exports.Range    = g.Cons("Range");
var Category = exports.Category = g.Cons("Category");
var Not      = exports.Not      = g.Cons("Not");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// start Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.Class();
        }.bind(this), 'start'));
    };
})();

// CONTROL: ("\\t" | "\\r" | "\\n" | "\\v" | "\\f") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CONTROL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(g.Literal("\\t"), g.Literal("\\r")), g.Literal("\\n")), g.Literal("\\v")), g.Literal("\\f")), Text);
        }.bind(this), 'CONTROL'));
    };
})();

// UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.UNICODE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("\\u"), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), Text);
        }.bind(this), 'UNICODE'));
    };
})();

// CHAR: ([^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CHAR = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(c.Or(c.Or(g.Char("^"), g.Char("-")), g.Char("\\")), g.Char("]")))), g.Literal("\\^")), g.Literal("\\-")), g.Literal("\\\\")), g.Literal("\\]")), Text);
        }.bind(this), 'CHAR'));
    };
})();

// CATEGORY: ("\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CATEGORY = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\\d"), g.Literal("\\D")), g.Literal("\\s")), g.Literal("\\S")), g.Literal("\\w")), g.Literal("\\W")), c.Seq(c.Seq(g.Literal("\\p{"), c.Any(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}"))), c.Seq(c.Seq(g.Literal("\\P{"), c.Many(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}"))), Text);
        }.bind(this), 'CATEGORY'));
    };
})();

// Range: (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Range = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Or(this.CHAR(), this.UNICODE()), c.Ignore(g.Literal("-"))), c.Or(this.CHAR(), this.UNICODE())), Range);
        }.bind(this), 'Range'));
    };
})();

// Category: CATEGORY -> Category;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Category = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(this.CATEGORY(), Category);
        }.bind(this), 'Category'));
    };
})();

// Char: Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Char = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.Category(), c.Red(this.CHAR(), Char)), c.Red(this.CONTROL(), Control)), c.Red(this.UNICODE(), Unicode));
        }.bind(this), 'Char'));
    };
})();

// Class: "["! ((Range | Char)* -> List) ("^"! (Range | Char)+ -> Not)? "]"! -> Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Class = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("[")), c.Red(c.Any(c.Or(this.Range(), this.Char())), List)), c.Maybe(c.Red(c.Seq(c.Ignore(g.Literal("^")), c.Many(c.Or(this.Range(), this.Char()))), Not))), c.Ignore(g.Literal("]"))), Class);
        }.bind(this), 'Class'));
    };
})();

