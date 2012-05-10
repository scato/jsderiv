require("../../src/grammar/grammar-classes-to-javascript");

var Class    = require("../../src/grammar/grammar-classes").Class,
    Char     = require("../../src/grammar/grammar-classes").Char,
    Control  = require("../../src/grammar/grammar-classes").Control,
    Unicode  = require("../../src/grammar/grammar-classes").Unicode,
    Range    = require("../../src/grammar/grammar-classes").Range,
    Category = require("../../src/grammar/grammar-classes").Category,
    Not      = require("../../src/grammar/grammar-classes").Not;

exports['test Range'] = function(test) {
    test.equals("g.Range(\"a\", \"z\")", Range("a", "z").toJavascript());
    
    test.done();
};

exports['test Category'] = function(test) {
    test.equals("g.Cat(\"\\\\w\")", Category("\\w").toJavascript());
    
    test.done();
};

exports['test Char'] = function(test) {
    test.equals("g.Char(\"a\")", Char("a").toJavascript());
    test.equals("g.Char(\"-\")", Char("\\-").toJavascript());
    
    test.done();
};

exports['test Control'] = function(test) {
    test.equals("g.Char(\"\\t\")", Control("\\t").toJavascript());
    
    test.done();
};

exports['test Unicode'] = function(test) {
    test.equals("g.Char(\"\\u0020\")", Unicode("\\u0020").toJavascript());
    
    test.done();
};

exports['test Not'] = function(test) {
    test.equals(
        "c.Not(c.Or(c.Or(c.Or(c.Or(g.Char(\"\\t\"), g.Char(\"\\u0020\")), g.Char(\"-\")), g.Cat(\"\\\\w\")), g.Range(\"0\", \"9\")))",
        Not(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9")).toJavascript()
    );
    
    test.done();
};

exports['test Class'] = function(test) {
    test.equals(
        "c.Or(c.Or(c.Or(c.Or(g.Char(\"\\t\"), g.Char(\"\\u0020\")), g.Char(\"-\")), g.Cat(\"\\\\w\")), g.Range(\"0\", \"9\"))",
        Class(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9")).toJavascript()
    );
    test.equals(
        "c.Not(c.Or(c.Or(c.Or(c.Or(g.Char(\"\\t\"), g.Char(\"\\u0020\")), g.Char(\"-\")), g.Cat(\"\\\\w\")), g.Range(\"0\", \"9\")))",
        Class(Not(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9"))).toJavascript()
    );
    
    test.done();
};

