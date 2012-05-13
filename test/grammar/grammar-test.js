var $ = require('../jsderiv');

// import {Lexer, KEYWORD, LITERAL, SYMBOL, ID, QID} from ...src."grammar"."grammar";
var Lexer   = require("./../../src/grammar/grammar").Lexer,
    KEYWORD = require("./../../src/grammar/grammar").KEYWORD,
    LITERAL = require("./../../src/grammar/grammar").LITERAL,
    SYMBOL  = require("./../../src/grammar/grammar").SYMBOL,
    ID      = require("./../../src/grammar/grammar").ID,
    QID     = require("./../../src/grammar/grammar").QID;

// export test "KEYWORD" {
//     start Lexer.KEYWORD;
//     
//     assert "test" -> (KEYWORD("test"));
//     assert "assert" -> (KEYWORD("assert"));
// }
exports["test \"KEYWORD\""] = function(test) {
    var start = new Lexer().KEYWORD();
    
    test.deepEqual(start.parse("test"), [[KEYWORD("test")]]);
    test.deepEqual(start.parse("assert"), [[KEYWORD("assert")]]);
    test.done();
};

// export test "Lexer" {
//     start Lexer.start;
//     
//     assert "test" -> (KEYWORD("test"));
//     assert "tester" -> (ID("tester"));
// }
exports["test \"Lexer\""] = function(test) {
    var start = new Lexer().start();
    
    test.deepEqual(start.parse("test"), [[KEYWORD("test")]]);
    test.deepEqual(start.parse("tester"), [[ID("tester")]]);
    test.done();
};

// import {Parser, Export} from ...src."grammar"."grammar";
var Parser = require("./../../src/grammar/grammar").Parser,
    Export = require("./../../src/grammar/grammar").Export;

// import {Test, StartDeclaration, Assertion} from ...src."grammar"."grammar-test";
var Test             = require("./../../src/grammar/grammar-test").Test,
    StartDeclaration = require("./../../src/grammar/grammar-test").StartDeclaration,
    Assertion        = require("./../../src/grammar/grammar-test").Assertion;

// import {List, Set, Node, Term} from ...src."grammar"."grammar-test";
var List = require("./../../src/grammar/grammar-test").List,
    Set  = require("./../../src/grammar/grammar-test").Set,
    Node = require("./../../src/grammar/grammar-test").Node,
    Term = require("./../../src/grammar/grammar-test").Term;

// export test "Definition" {
//     start Parser.Definition;
//     
//     assert (KEYWORD("test"), LITERAL("\"Example\""), SYMBOL("{"), KEYWORD("start"), QID("Example.NEWLINE"), SYMBOL(";"), KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";"), SYMBOL("}")) -> (Test("\"Example\"", StartDeclaration("Example.NEWLINE"), (Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\"")))))))));
// }
exports["test \"Definition\""] = function(test) {
    var start = new Parser().Definition();
    
    test.deepEqual(start.parse([KEYWORD("test"), LITERAL("\"Example\""), SYMBOL("{"), KEYWORD("start"), QID("Example.NEWLINE"), SYMBOL(";"), KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";"), SYMBOL("}")]), [[Test("\"Example\"", StartDeclaration("Example.NEWLINE"), [Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\""))))))])]]);
    test.done();
};

// export test "StartDeclaration" {
//     start Parser.StartDeclaration;
//     
//     assert (KEYWORD("start"), QID("Example.Definition"), SYMBOL(";")) -> (StartDeclaration("Example.Definition"));
// }
exports["test \"StartDeclaration\""] = function(test) {
    var start = new Parser().StartDeclaration();
    
    test.deepEqual(start.parse([KEYWORD("start"), QID("Example.Definition"), SYMBOL(";")]), [[StartDeclaration("Example.Definition")]]);
    test.done();
};

// export test "Assertion" {
//     start Parser.Assertion;
//     
//     assert (KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";")) -> (Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\"")))))));
// }
exports["test \"Assertion\""] = function(test) {
    var start = new Parser().Assertion();
    
    test.deepEqual(start.parse([KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";")]), [[Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\""))))))]]);
    test.done();
};

// export test "NodeList" {
//     start Parser.NodeList;
//     
//     assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\"")))));
//     assert (LITERAL("\"\\r\\n\"")) -> (Term("\"\\r\\n\""));
// }
exports["test \"NodeList\""] = function(test) {
    var start = new Parser().NodeList();
    
    test.deepEqual(start.parse([SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")]), [[List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\""))))]]);
    test.deepEqual(start.parse([LITERAL("\"\\r\\n\"")]), [[Term("\"\\r\\n\"")]]);
    test.done();
};

// export test "NodeSet" {
//     start Parser.NodeSet;
//     
//     assert (SYMBOL("{"), SYMBOL("}")) -> (Set());
//     assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (Set(List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\""))))));
//     assert (LITERAL("\"\\r\\n\"")) -> (Set(Term("\"\\r\\n\"")));
// }
exports["test \"NodeSet\""] = function(test) {
    var start = new Parser().NodeSet();
    
    test.deepEqual(start.parse([SYMBOL("{"), SYMBOL("}")]), [[Set()]]);
    test.deepEqual(start.parse([SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")]), [[Set(List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\"")))))]]);
    test.deepEqual(start.parse([LITERAL("\"\\r\\n\"")]), [[Set(Term("\"\\r\\n\""))]]);
    test.done();
};

// export test "List" {
//     start Parser.List;
//     
//     assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\"")))));
// }
exports["test \"List\""] = function(test) {
    var start = new Parser().List();
    
    test.deepEqual(start.parse([SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")]), [[List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\""))))]]);
    test.done();
};

// export test "Term" {
//     start Parser.Term;
//     
//     assert (LITERAL("\"\\r\\n\"")) -> (Term("\"\\r\\n\""));
// }
exports["test \"Term\""] = function(test) {
    var start = new Parser().Term();
    
    test.deepEqual(start.parse([LITERAL("\"\\r\\n\"")]), [[Term("\"\\r\\n\"")]]);
    test.done();
};

// export test "Node" {
//     start Parser.Node;
//     
//     assert (ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")")) -> (Node("NEWLINE", List(Term("\"\\r\\n\""))));
//     assert (LITERAL("\"\\n\"")) -> (Term("\"\\n\""));
//     assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\"")))));
//     assert (ID("NEWLINE"), LITERAL("\"\\r\\n\"")) -> {};
//     assert (SYMBOL("("), ID("NEWLINE"), LITERAL("\"\\n\""), SYMBOL(")")) -> {};
// }
exports["test \"Node\""] = function(test) {
    var start = new Parser().Node();
    
    test.deepEqual(start.parse([ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")")]), [[Node("NEWLINE", List(Term("\"\\r\\n\"")))]]);
    test.deepEqual(start.parse([LITERAL("\"\\n\"")]), [[Term("\"\\n\"")]]);
    test.deepEqual(start.parse([SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")")]), [[List(Node("NEWLINE", List(Term("\"\\n\""))))]]);
    test.deepEqual(start.parse([ID("NEWLINE"), LITERAL("\"\\r\\n\"")]), []);
    test.deepEqual(start.parse([SYMBOL("("), ID("NEWLINE"), LITERAL("\"\\n\""), SYMBOL(")")]), []);
    test.done();
};
