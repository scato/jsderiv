var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {Lexer} from .lexer;
var Lexer = require('./lexer').Lexer;

// import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from .lexer;
var ID      = require('./lexer').ID,
    LITERAL = require('./lexer').LITERAL,
    SYMBOL  = require('./lexer').SYMBOL,
    CLASS   = require('./lexer').CLASS,
    KEYWORD = require('./lexer').KEYWORD;

// export test "SPACE" {
//     start Lexer.SPACE;
// 
//     assert " " -> ();
// }
exports["test \"SPACE\""] = function(test) {
    var start = new Lexer().SPACE();

    test.deepEqual(g.parse(start, " "), [[]]);
    test.done();
};

// export test "ID" {
//     start Lexer.ID;
// 
//     assert "id" -> (ID "id");
//     assert "start" -> {};
//     assert "id2" -> (ID "id2");
//     assert "ID_2" -> (ID "ID_2");
// }
exports["test \"ID\""] = function(test) {
    var start = new Lexer().ID();

    test.deepEqual(g.parse(start, "id"), [[ID("id")]]);
    test.deepEqual(g.parse(start, "start"), []);
    test.deepEqual(g.parse(start, "id2"), [[ID("id2")]]);
    test.deepEqual(g.parse(start, "ID_2"), [[ID("ID_2")]]);
    test.done();
};

// export test "COMMENT" {
//     start Lexer.COMMENT;
// 
//     assert "/* comment */" -> ();
//     assert "// comment" -> ();
// }
exports["test \"COMMENT\""] = function(test) {
    var start = new Lexer().COMMENT();

    test.deepEqual(g.parse(start, "/* comment */"), [[]]);
    test.deepEqual(g.parse(start, "// comment"), [[]]);
    test.done();
};

// export test "LITERAL" {
//     start Lexer.LITERAL;
// 
//     assert "\"literal\"" -> (LITERAL "\"literal\"");
// }
exports["test \"LITERAL\""] = function(test) {
    var start = new Lexer().LITERAL();

    test.deepEqual(g.parse(start, "\"literal\""), [[LITERAL("\"literal\"")]]);
    test.done();
};

// export test "SYMBOL" {
//     start Lexer.SYMBOL;
// 
//     assert "|" -> (SYMBOL "|");
//     assert "<" -> (SYMBOL "<");
//     assert ">" -> (SYMBOL ">");
// }
exports["test \"SYMBOL\""] = function(test) {
    var start = new Lexer().SYMBOL();

    test.deepEqual(g.parse(start, "|"), [[SYMBOL("|")]]);
    test.deepEqual(g.parse(start, "<"), [[SYMBOL("<")]]);
    test.deepEqual(g.parse(start, ">"), [[SYMBOL(">")]]);
    test.done();
};

// export test "CLASS" {
//     start Lexer.CLASS;
// 
//     assert "[0-9]" -> (CLASS "[0-9]");
//     assert "[123]" -> (CLASS "[123]");
//     assert "[^0-9]" -> (CLASS "[^0-9]");
//     assert "[^123]" -> (CLASS "[^123]");
//     assert "[0-9^123]" -> (CLASS "[0-9^123]");
//     assert "[0-]" -> {};
//     assert "[^]" -> {};
// }
exports["test \"CLASS\""] = function(test) {
    var start = new Lexer().CLASS();

    test.deepEqual(g.parse(start, "[0-9]"), [[CLASS("[0-9]")]]);
    test.deepEqual(g.parse(start, "[123]"), [[CLASS("[123]")]]);
    test.deepEqual(g.parse(start, "[^0-9]"), [[CLASS("[^0-9]")]]);
    test.deepEqual(g.parse(start, "[^123]"), [[CLASS("[^123]")]]);
    test.deepEqual(g.parse(start, "[0-9^123]"), [[CLASS("[0-9^123]")]]);
    test.deepEqual(g.parse(start, "[0-]"), []);
    test.deepEqual(g.parse(start, "[^]"), []);
    test.done();
};

// export test "KEYWORD" {
//     start Lexer.KEYWORD;
// 
//     assert "start" -> (KEYWORD "start");
//     assert "extends" -> (KEYWORD "extends");
//     assert "super" -> (KEYWORD "super");
// }
exports["test \"KEYWORD\""] = function(test) {
    var start = new Lexer().KEYWORD();

    test.deepEqual(g.parse(start, "start"), [[KEYWORD("start")]]);
    test.deepEqual(g.parse(start, "extends"), [[KEYWORD("extends")]]);
    test.deepEqual(g.parse(start, "super"), [[KEYWORD("super")]]);
    test.done();
};

// export test "start" {
//     start Lexer.start;
// 
//     assert "id /* comment */ \"literal\" | [0-9] start" -> (ID "id", LITERAL "\"literal\"", SYMBOL "|", CLASS "[0-9]", KEYWORD "start");
//     assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
// }
exports["test \"start\""] = function(test) {
    var start = new Lexer().start();

    test.deepEqual(g.parse(start, "id /* comment */ \"literal\" | [0-9] start"), [[ID("id"), LITERAL("\"literal\""), SYMBOL("|"), CLASS("[0-9]"), KEYWORD("start")]]);
    test.deepEqual(g.parse(start, "id /* comment */ \"literal\" | [0-9] start 123"), []);
    test.done();
};
