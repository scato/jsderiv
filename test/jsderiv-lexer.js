var c = require('../lib/common');
var g = require('../lib/generic');
var l = require('../lib/lookahead');

//import Grammar from ..src.jsderiv.lexer;
var Grammar = require('../src/jsderiv/lexer').Grammar;

//import ID, LITERAL, SYMBOL, CLASS, KEYWORD from ..src.jsderiv.lexer;
var ID      = require('../src/jsderiv/lexer').ID,
    LITERAL = require('../src/jsderiv/lexer').LITERAL,
    SYMBOL  = require('../src/jsderiv/lexer').SYMBOL,
    CLASS   = require('../src/jsderiv/lexer').CLASS,
    KEYWORD = require('../src/jsderiv/lexer').KEYWORD;

//export test "SPACE" {
//    start Grammar.SPACE;
//    
//    assert " " -> ();
//}
exports["test SPACE"] = function(test) {
    var start = new Grammar().SPACE();
    
    test.deepEqual(g.parse(start, " "), [[]]);
    test.done();
};

//export test "ID" {
//    start Grammar.ID;
//    
//    assert "id" -> (ID "id");
//    assert "start" -> {};
//}
exports["test ID"] = function(test) {
    var start = new Grammar().ID();
    
    test.deepEqual(g.parse(start, "id"), [[ID("id")]]);
    test.deepEqual(g.parse(start, "start"), []);
    test.done();
};

//export test "COMMENT" {
//    start Grammar.COMMENT;
//    
//    assert "/* comment */" -> ();
//    assert "// comment" -> ();
//}
exports["test COMMENT"] = function(test) {
    var start = new Grammar().COMMENT();
    
    test.deepEqual(g.parse(start, "/* comment */"), [[]]);
    test.deepEqual(g.parse(start, "// comment"), [[]]);
    test.done();
};

//export test "LITERAL" {
//    start Grammar.LITERAL;
//    
//    assert "\"literal\"" -> (LITERAL("\"literal\""));
//}
exports["test LITERAL"] = function(test) {
    var start = new Grammar().LITERAL();
    
    test.deepEqual(g.parse(start, "\"literal\""), [[LITERAL("\"literal\"")]]);
    test.done();
};

//export test "SYMBOL" {
//    start Grammar.SYMBOL;
//    
//    assert "|" -> (SYMBOL "|");
//}
exports["test SYMBOL"] = function(test) {
    var start = new Grammar().SYMBOL();
    
    test.deepEqual(g.parse(start, "|"), [[SYMBOL("|")]]);
    test.done();
};

//export test "CLASS" {
//    start Grammar.CLASS;
//    
//    assert "[0-9]" -> (CLASS "[0-9]");
//    assert "[123]" -> (CLASS "[123]");
//    assert "[^0-9]" -> (CLASS "[^0-9]");
//    assert "[^123]" -> (CLASS "[^123]");
//    assert "[0-9^123]" -> (CLASS "[0-9^123]");
//    assert "[0-]" -> {};
//    assert "[^]" -> {};
//}
exports["test CLASS"] = function(test) {
    var start = new Grammar().CLASS();
    
    test.deepEqual(g.parse(start, "[0-9]"), [[CLASS("[0-9]")]]);
    test.deepEqual(g.parse(start, "[123]"), [[CLASS("[123]")]]);
    test.deepEqual(g.parse(start, "[^0-9]"), [[CLASS("[^0-9]")]]);
    test.deepEqual(g.parse(start, "[^123]"), [[CLASS("[^123]")]]);
    test.deepEqual(g.parse(start, "[0-9^123]"), [[CLASS("[0-9^123]")]]);
    test.deepEqual(g.parse(start, "[0-]"), []);
    test.deepEqual(g.parse(start, "[^]"), []);
    test.done();
};

//export test "KEYWORD" {
//    start Grammar.KEYWORD;
//    
//    assert "start" -> (KEYWORD "start");
//}
exports["test KEYWORD"] = function(test) {
    var start = new Grammar().KEYWORD();
    
    test.deepEqual(g.parse(start, "start"), [[KEYWORD("start")]]);
    test.done();
};

//export test "start" {
//    assert "id /* comment */ \"literal\" | [0-9] start" -> (ID "id", LITERAL "\"literal\"", SYMBOL "|", RANGE "[0-9]", KEYWORD "start");
//    assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
//}
exports["test start"] = function(test) {
    var start = new Grammar().start();
    
    test.deepEqual(g.parse(start, "id /* comment */ \"literal\" | [0-9] start"), [[ID("id"), LITERAL("\"literal\""), SYMBOL("|"), CLASS("[0-9]"), KEYWORD("start")]]);
    test.deepEqual(g.parse(start, "id /* comment */ \"literal\" | [0-9] start 123"), []);
    test.done();
};

