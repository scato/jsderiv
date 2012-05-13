var $ = require('../jsderiv');

// import {Scannerless} from ...src."grammar"."grammar-classes";
var Scannerless = require("./../../src/grammar/grammar-classes").Scannerless;

// import {Class, Char, Control, Unicode, Range, Category, Not} from ...src."grammar"."grammar-classes";
var Class    = require("./../../src/grammar/grammar-classes").Class,
    Char     = require("./../../src/grammar/grammar-classes").Char,
    Control  = require("./../../src/grammar/grammar-classes").Control,
    Unicode  = require("./../../src/grammar/grammar-classes").Unicode,
    Range    = require("./../../src/grammar/grammar-classes").Range,
    Category = require("./../../src/grammar/grammar-classes").Category,
    Not      = require("./../../src/grammar/grammar-classes").Not;

// export test "CONTROL" {
//     start Scannerless.CONTROL;
//     
//     assert "\\t" -> ("\\t");
//     assert "\\r" -> ("\\r");
//     assert "\\n" -> ("\\n");
//     assert "\\v" -> ("\\v");
//     assert "\\f" -> ("\\f");
//     assert "\\w" -> {};
// }
exports["test \"CONTROL\""] = function(test) {
    var start = new Scannerless().CONTROL();
    
    test.deepEqual(start.parse("\\t"), [["\\t"]]);
    test.deepEqual(start.parse("\\r"), [["\\r"]]);
    test.deepEqual(start.parse("\\n"), [["\\n"]]);
    test.deepEqual(start.parse("\\v"), [["\\v"]]);
    test.deepEqual(start.parse("\\f"), [["\\f"]]);
    test.deepEqual(start.parse("\\w"), []);
    test.done();
};

// export test "UNICODE" {
//     start Scannerless.UNICODE;
//     
//     assert "\\u0020" -> ("\\u0020");
//     assert "\\u20" -> {};
// }
exports["test \"UNICODE\""] = function(test) {
    var start = new Scannerless().UNICODE();
    
    test.deepEqual(start.parse("\\u0020"), [["\\u0020"]]);
    test.deepEqual(start.parse("\\u20"), []);
    test.done();
};

// export test "CHAR" {
//     start Scannerless.CHAR;
//     
//     assert "\\^" -> ("\\^");
//     assert "\\-" -> ("\\-");
//     assert "\\\\" -> ("\\\\");
//     assert "\\]" -> ("\\]");
//     assert "a" -> ("a");
//     assert "\\" -> {};
//     assert "^" -> {};
// }
exports["test \"CHAR\""] = function(test) {
    var start = new Scannerless().CHAR();
    
    test.deepEqual(start.parse("\\^"), [["\\^"]]);
    test.deepEqual(start.parse("\\-"), [["\\-"]]);
    test.deepEqual(start.parse("\\\\"), [["\\\\"]]);
    test.deepEqual(start.parse("\\]"), [["\\]"]]);
    test.deepEqual(start.parse("a"), [["a"]]);
    test.deepEqual(start.parse("\\"), []);
    test.deepEqual(start.parse("^"), []);
    test.done();
};

// export test "CATEGORY" {
//     start Scannerless.CATEGORY;
//     
//     assert "\\d" -> ("\\d");
//     assert "\\D" -> ("\\D");
//     assert "\\s" -> ("\\s");
//     assert "\\S" -> ("\\S");
//     assert "\\w" -> ("\\w");
//     assert "\\W" -> ("\\W");
//     assert "\\p{L}" -> ("\\p{L}");
//     assert "\\P{L}" -> ("\\P{L}");
//     assert "\\t" -> {};
//     assert "\\p" -> {};
// }
exports["test \"CATEGORY\""] = function(test) {
    var start = new Scannerless().CATEGORY();
    
    test.deepEqual(start.parse("\\d"), [["\\d"]]);
    test.deepEqual(start.parse("\\D"), [["\\D"]]);
    test.deepEqual(start.parse("\\s"), [["\\s"]]);
    test.deepEqual(start.parse("\\S"), [["\\S"]]);
    test.deepEqual(start.parse("\\w"), [["\\w"]]);
    test.deepEqual(start.parse("\\W"), [["\\W"]]);
    test.deepEqual(start.parse("\\p{L}"), [["\\p{L}"]]);
    test.deepEqual(start.parse("\\P{L}"), [["\\P{L}"]]);
    test.deepEqual(start.parse("\\t"), []);
    test.deepEqual(start.parse("\\p"), []);
    test.done();
};

// export test "Range" {
//     start Scannerless.Range;
//     
//     assert "a-z" -> (Range("a", "z"));
//     assert "\\u0020-\\u007e" -> (Range("\\u0020", "\\u007e"));
//     assert "a" -> {};
//     assert "a-" -> {};
// }
exports["test \"Range\""] = function(test) {
    var start = new Scannerless().Range();
    
    test.deepEqual(start.parse("a-z"), [[Range("a", "z")]]);
    test.deepEqual(start.parse("\\u0020-\\u007e"), [[Range("\\u0020", "\\u007e")]]);
    test.deepEqual(start.parse("a"), []);
    test.deepEqual(start.parse("a-"), []);
    test.done();
};

// export test "Category" {
//     start Scannerless.Category;
//     
//     assert "\\w" -> (Category("\\w"));
// }
exports["test \"Category\""] = function(test) {
    var start = new Scannerless().Category();
    
    test.deepEqual(start.parse("\\w"), [[Category("\\w")]]);
    test.done();
};

// export test "Char" {
//     start Scannerless.Char;
//     
//     assert "\\w" -> (Category("\\w"));
//     assert "a" -> (Char("a"));
//     assert "\\-" -> (Char("\\-"));
//     assert "\\t" -> (Control("\\t"));
//     assert "\\u0020" -> (Unicode("\\u0020"));
//     assert "-" -> {};
// }
exports["test \"Char\""] = function(test) {
    var start = new Scannerless().Char();
    
    test.deepEqual(start.parse("\\w"), [[Category("\\w")]]);
    test.deepEqual(start.parse("a"), [[Char("a")]]);
    test.deepEqual(start.parse("\\-"), [[Char("\\-")]]);
    test.deepEqual(start.parse("\\t"), [[Control("\\t")]]);
    test.deepEqual(start.parse("\\u0020"), [[Unicode("\\u0020")]]);
    test.deepEqual(start.parse("-"), []);
    test.done();
};

// export test "Class" {
//     start Scannerless.Class;
//     
//     assert "[\\t\\u0020\\-\\w0-9]" -> (Class(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9")));
//     assert "[^\\t\\u0020\\-\\w0-9]" -> (Class(Not(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9"))));
//     assert "[a-z^cqxy]" -> {};
// }
exports["test \"Class\""] = function(test) {
    var start = new Scannerless().Class();
    
    test.deepEqual(start.parse("[\\t\\u0020\\-\\w0-9]"), [[Class(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9"))]]);
    test.deepEqual(start.parse("[^\\t\\u0020\\-\\w0-9]"), [[Class(Not(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9")))]]);
    test.deepEqual(start.parse("[a-z^cqxy]"), []);
    test.done();
};
