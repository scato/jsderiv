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
    exports.Scannerless.prototype.start = function() {
        return this._start_3e2b958 || (this._start_3e2b958 = $.Ref(function() {
            return this.Class();
        }.bind(this), 'start'));
    };
})();

// CONTROL: <"\\t" | "\\r" | "\\n" | "\\v" | "\\f">;
(function() {
    exports.Scannerless.prototype.CONTROL = function() {
        return this._CONTROL_72e689a || (this._CONTROL_72e689a = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.Literal("\\t"), $.Literal("\\r")), $.Literal("\\n")), $.Literal("\\v")), $.Literal("\\f")));
        }.bind(this), 'CONTROL'));
    };
})();

// UNICODE: <"\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]>;
(function() {
    exports.Scannerless.prototype.UNICODE = function() {
        return this._UNICODE_1b1f947b || (this._UNICODE_1b1f947b = $.Ref(function() {
            return $.Capture($.Seq($.Seq($.Seq($.Seq($.Literal("\\u"), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))));
        }.bind(this), 'UNICODE'));
    };
})();

// CHAR: <[^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]">;
(function() {
    exports.Scannerless.prototype.CHAR = function() {
        return this._CHAR_b34444a || (this._CHAR_b34444a = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Or($.Or($.Char("^"), $.Char("-")), $.Char("\\")), $.Char("]")))), $.Literal("\\^")), $.Literal("\\-")), $.Literal("\\\\")), $.Literal("\\]")));
        }.bind(this), 'CHAR'));
    };
})();

// CATEGORY: <"\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}">;
(function() {
    exports.Scannerless.prototype.CATEGORY = function() {
        return this._CATEGORY_7d6d674d || (this._CATEGORY_7d6d674d = $.Ref(function() {
            return $.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("\\d"), $.Literal("\\D")), $.Literal("\\s")), $.Literal("\\S")), $.Literal("\\w")), $.Literal("\\W")), $.Seq($.Seq($.Literal("\\p{"), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Literal("}"))), $.Seq($.Seq($.Literal("\\P{"), $.Many($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Literal("}"))));
        }.bind(this), 'CATEGORY'));
    };
})();

// Range: (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
(function() {
    exports.Scannerless.prototype.Range = function() {
        return this._Range_4461d2cc || (this._Range_4461d2cc = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Or(this.CHAR(), this.UNICODE()), $.Ignore($.Literal("-"))), $.Or(this.CHAR(), this.UNICODE())), Range);
        }.bind(this), 'Range'));
    };
})();

// Category: CATEGORY -> Category;
(function() {
    exports.Scannerless.prototype.Category = function() {
        return this._Category_7fa39e8b || (this._Category_7fa39e8b = $.Ref(function() {
            return $.Red(this.CATEGORY(), Category);
        }.bind(this), 'Category'));
    };
})();

// Char: Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
(function() {
    exports.Scannerless.prototype.Char = function() {
        return this._Char_2cf357ff || (this._Char_2cf357ff = $.Ref(function() {
            return $.Or($.Or($.Or(this.Category(), $.Red(this.CHAR(), Char)), $.Red(this.CONTROL(), Control)), $.Red(this.UNICODE(), Unicode));
        }.bind(this), 'Char'));
    };
})();

// Class: "["! ((Range | Char)+ | "^"! (Range | Char)+ -> Not) "]"! -> Class;
(function() {
    exports.Scannerless.prototype.Class = function() {
        return this._Class_7b4cf5b3 || (this._Class_7b4cf5b3 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Literal("[")), $.Or($.Many($.Or(this.Range(), this.Char())), $.Red($.Seq($.Ignore($.Literal("^")), $.Many($.Or(this.Range(), this.Char()))), Not))), $.Ignore($.Literal("]"))), Class);
        }.bind(this), 'Class'));
    };
})();
