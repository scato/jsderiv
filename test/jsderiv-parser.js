var c = require('../lib/common');
var g = require('../lib/generic');
var l = require('../lib/lookahead');

//import {Grammar: Lexer} from ..src.jsderiv.lexer;
var Lexer = require('../src/jsderiv/lexer').Grammar;

//import Grammar from ..src.jsderiv.parser;
var Grammar = require('../src/jsderiv/parser').Grammar;

//import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from ..src.jsderiv.lexer;
var ID      = require('../src/jsderiv/lexer').ID,
    LITERAL = require('../src/jsderiv/lexer').LITERAL,
    SYMBOL  = require('../src/jsderiv/lexer').SYMBOL,
    CLASS   = require('../src/jsderiv/lexer').CLASS,
    KEYWORD = require('../src/jsderiv/lexer').KEYWORD;

//import {Module, Grammar, Start, Rule} from ..src.jsderiv.parser;
var Module  = require('../src/jsderiv/parser').Module,
    Grammar = require('../src/jsderiv/parser').Grammar,
    Start   = require('../src/jsderiv/parser').Start,
    Rule    = require('../src/jsderiv/parser').Rule;

//import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Token, Ref, Class, Literal} from ..src.jsderiv.parser;
var Or      = require('../src/jsderiv/parser').Or,
    Red     = require('../src/jsderiv/parser').Red,
    And     = require('../src/jsderiv/parser').And,
    Seq     = require('../src/jsderiv/parser').Seq,
    Any     = require('../src/jsderiv/parser').Any,
    Many    = require('../src/jsderiv/parser').Many,
    Maybe   = require('../src/jsderiv/parser').Maybe,
    Ignore  = require('../src/jsderiv/parser').Ignore,
    Not     = require('../src/jsderiv/parser').Not,
    Token   = require('../src/jsderiv/parser').Token,
    Ref     = require('../src/jsderiv/parser').Ref,
    Class   = require('../src/jsderiv/parser').Class,
    Literal = require('../src/jsderiv/parser').Literal;

//export test "Terminal" {
//    start Grammar.Terminal;
//    
//    assert (ID "id") -> (Ref("id"));
//    assert (CLASS "[a-z]") -> (Class("[a-z]"));
//    assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
//    assert (SYMBOL "|") -> {};
//    assert (KEYWORD "start") -> {};
//}
exports['test "Terminal"'] = function(test) {
    var start = new Grammar().Terminal();
    
    test.deepEqual(g.parse(start, [ID("id")]), [[Ref(["id"])]]);
    test.deepEqual(g.parse(start, [CLASS("[a-z]")]), [[Class(["[a-z]"])]]);
    test.deepEqual(g.parse(start, [LITERAL("\"literal\"")]), [[Literal(["\"literal\""])]]);
    test.deepEqual(g.parse(start, [SYMBOL("|")]), []);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    test.done();
};

//export test "Rule" {
//    start Grammar.Rule;
//    
//    assert (KEYWORD "start", ID "NEWLINE", SYMBOL ";") -> (Start(Ref("NEWLINE")));
//    assert (ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";") -> (Rule("NEWLINE", Literal("\"\\n\"")));
//    assert (KEYWORD "start") -> {};
//    assert (ID "NEWLINE") -> {};
//}
exports['test "Rule"'] = function(test) {
    var start = new Grammar().Rule();
    
    test.deepEqual(g.parse(start, [KEYWORD("start"), ID("NEWLINE"), SYMBOL(";")]), [[Start([Ref(["NEWLINE"])])]]);
    test.deepEqual(g.parse(start, [ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";")]), [[Rule(["NEWLINE", Literal(["\"\\n\""])])]]);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    test.deepEqual(g.parse(start, [ID("NEWLINE")]), []);
    test.done();
};
