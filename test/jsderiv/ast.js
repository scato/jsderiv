var Node    = require('../../src/jsderiv').Node,
    Capture = require('../../src/jsderiv').Capture,
    Red     = require('../../src/jsderiv').Red,
    Many    = require('../../src/jsderiv').Many,
    Cat     = require('../../src/jsderiv').Cat,
    Seq     = require('../../src/jsderiv').Seq,
    Value   = require('../../src/jsderiv').Value,
    Type    = require('../../src/jsderiv').Type,
    Maybe   = require('../../src/jsderiv').Maybe,
    Ignore  = require('../../src/jsderiv').Ignore,
    Literal = require('../../src/jsderiv').Literal,
    Or      = require('../../src/jsderiv').Or,
    And     = require('../../src/jsderiv').And,
    Not     = require('../../src/jsderiv').Not,
    ButNot  = require('../../src/jsderiv').ButNot,
    Part    = require('../../src/jsderiv').Part;

exports['test if tokenizer creates tokens same way as JavaScript'] = function(test) {
    // constructor ID;
    var ID = Node.define('ID');
    
    // start <'\w'+> -> ID;
    var start = Red(Capture(Many(Cat('w'))), ID);
    
    // assert "foo" -> [ID("foo")];
    test.deepEqual(start.parse("foo"), [[ID("foo")]]);
    
    test.done();
};

exports['test if token-parser passes two strings to constructor separately'] = function(test) {
    // constructor ID, KEYWORD, SYMBOL, Def;
    var ID      = Node.define('ID'),
        KEYWORD = Node.define('KEYWORD'),
        SYMBOL  = Node.define('SYMBOL'),
        Def     = Node.define('Def');
    
    // start @"static"? @"var"! @ID @";"! -> Def;
    var start = Red(Seq(Seq(Seq(Maybe(Value("static")), Ignore(Value("var"))), Type(ID)), Ignore(Value(";"))), Def);
    
    // assert [KEYWORD("static"), KEYWORD("var"), ID("foo"), SYMBOL(";")] -> [Def("static", "foo")];
    test.deepEqual(start.parse([KEYWORD("static"), KEYWORD("var"), ID("foo"), SYMBOL(";")]), [[Def("static", "foo")]]);
    
    test.done();
};

exports['test if string-parser passes two strings to constructor separately'] = function(test) {
    // Def;
    var Def = Node.define('Def');
    
    // KEYWORD: "static" | "var";
    var KEYWORD = Or(Literal("static"), Literal("var"));
    
    // ID: '\w'+ ^ KEYWORD;
    var ID = ButNot(Many(Cat('w')), KEYWORD);
    
    // SYMBOL: ";";
    var SYMBOL = Literal(";");
    
    // start <"static"$>? "var"$! <ID$> ";"$! -> Def;
    var start = Red(Seq(Seq(Seq(Maybe(Capture(Part(Literal("static")))), Ignore(Part(Literal("var")))), Capture(Part(ID))), Ignore(Part(Literal(";")))), Def);
    
    // assert ["static", "var", "foo", ";"] -> [Def("static", "foo")];
    test.deepEqual(start.parse(["static", "var", "foo", ";"]), [[Def("static", "foo")]]);
    
    test.done();
};
