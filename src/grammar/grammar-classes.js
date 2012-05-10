var $ = require('../jsderiv');

// export constructor Class, Char, Control, Unicode, Range, Category, Not;
var Class    = exports.Class    = $.Node.define("Class");
var Char     = exports.Char     = $.Node.define("Char");
var Control  = exports.Control  = $.Node.define("Control");
var Unicode  = exports.Unicode  = $.Node.define("Unicode");
var Range    = exports.Range    = $.Node.define("Range");
var Category = exports.Category = $.Node.define("Category");
var Not      = exports.Not      = $.Node.define("Not");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// start Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.start = function() {
        return $cache || ($cache = $.Ref(function() {
            return this.Class();
        }.bind(this), 'start'));
    };
})();

// CONTROL: <"\\t" | "\\r" | "\\n" | "\\v" | "\\f">;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CONTROL = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.Or($.Literal("\\t"), $.Value("\\t")), $.Or($.Literal("\\r"), $.Value("\\r"))), $.Or($.Literal("\\n"), $.Value("\\n"))), $.Or($.Literal("\\v"), $.Value("\\v"))), $.Or($.Literal("\\f"), $.Value("\\f"))));
        }.bind(this), 'CONTROL'));
    };
})();

// UNICODE: <"\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]>;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.UNICODE = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Capture($.Seq($.Seq($.Seq($.Seq($.Or($.Literal("\\u"), $.Value("\\u")), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))));
        }.bind(this), 'UNICODE'));
    };
})();

// CHAR: <[^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]">;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CHAR = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Or($.Or($.Char("^"), $.Char("-")), $.Char("\\")), $.Char("]")))), $.Or($.Literal("\\^"), $.Value("\\^"))), $.Or($.Literal("\\-"), $.Value("\\-"))), $.Or($.Literal("\\\\"), $.Value("\\\\"))), $.Or($.Literal("\\]"), $.Value("\\]"))));
        }.bind(this), 'CHAR'));
    };
})();

// CATEGORY: <"\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}">;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CATEGORY = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("\\d"), $.Value("\\d")), $.Or($.Literal("\\D"), $.Value("\\D"))), $.Or($.Literal("\\s"), $.Value("\\s"))), $.Or($.Literal("\\S"), $.Value("\\S"))), $.Or($.Literal("\\w"), $.Value("\\w"))), $.Or($.Literal("\\W"), $.Value("\\W"))), $.Seq($.Seq($.Or($.Literal("\\p{"), $.Value("\\p{")), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Or($.Literal("}"), $.Value("}")))), $.Seq($.Seq($.Or($.Literal("\\P{"), $.Value("\\P{")), $.Many($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Or($.Literal("}"), $.Value("}")))));
        }.bind(this), 'CATEGORY'));
    };
})();

// Range: (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Range = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Or(this.CHAR(), this.UNICODE()), $.Ignore($.Or($.Literal("-"), $.Value("-")))), $.Or(this.CHAR(), this.UNICODE())), Range);
        }.bind(this), 'Range'));
    };
})();

// Category: CATEGORY -> Category;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Category = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red(this.CATEGORY(), Category);
        }.bind(this), 'Category'));
    };
})();

// Char: Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Char = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or(this.Category(), $.Red(this.CHAR(), Char)), $.Red(this.CONTROL(), Control)), $.Red(this.UNICODE(), Unicode));
        }.bind(this), 'Char'));
    };
})();

// Class: "["! ((Range | Char)+ | "^"! (Range | Char)+ -> Not) "]"! -> Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Class = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Or($.Literal("["), $.Value("["))), $.Or($.Many($.Or(this.Range(), this.Char())), $.Red($.Seq($.Ignore($.Or($.Literal("^"), $.Value("^"))), $.Many($.Or(this.Range(), this.Char()))), Not))), $.Ignore($.Or($.Literal("]"), $.Value("]")))), Class);
        }.bind(this), 'Class'));
    };
})();
