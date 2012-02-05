var c = require('../lib/common');
var g = require('../lib/generic');
var l = require('../lib/lookahead');

//import Parser from ..src.jsderiv.parser;
var Parser = require('../src/jsderiv/parser').Parser;

//import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from ..src.jsderiv.lexer;
var ID      = require('../src/jsderiv/lexer').ID,
    LITERAL = require('../src/jsderiv/lexer').LITERAL,
    SYMBOL  = require('../src/jsderiv/lexer').SYMBOL,
    CLASS   = require('../src/jsderiv/lexer').CLASS,
    KEYWORD = require('../src/jsderiv/lexer').KEYWORD;

//import {Module, Import, Export, Constructor, Grammar, Start, Rule} from ..src.jsderiv.parser;
var Module      = require('../src/jsderiv/parser').Module,
    Import      = require('../src/jsderiv/parser').Import,
    Export      = require('../src/jsderiv/parser').Export,
    Constructor = require('../src/jsderiv/parser').Constructor,
    Grammar     = require('../src/jsderiv/parser').Grammar,
    Start       = require('../src/jsderiv/parser').Start,
    Rule        = require('../src/jsderiv/parser').Rule;

//import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Token, Ref, Class, Literal, InstanceOf} from ..src.jsderiv.parser;
var Or         = require('../src/jsderiv/parser').Or,
    Red        = require('../src/jsderiv/parser').Red,
    And        = require('../src/jsderiv/parser').And,
    Seq        = require('../src/jsderiv/parser').Seq,
    Any        = require('../src/jsderiv/parser').Any,
    Many       = require('../src/jsderiv/parser').Many,
    Maybe      = require('../src/jsderiv/parser').Maybe,
    Ignore     = require('../src/jsderiv/parser').Ignore,
    Not        = require('../src/jsderiv/parser').Not,
    Token      = require('../src/jsderiv/parser').Token,
    Ref        = require('../src/jsderiv/parser').Ref,
    Class      = require('../src/jsderiv/parser').Class,
    Literal    = require('../src/jsderiv/parser').Literal,
    InstanceOf = require('../src/jsderiv/parser').InstanceOf;

//export test "start" {
//    start Parser.start;
//    
//    assert (
//        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common", SYMBOL ";",
//        KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";",
//        KEYWORD "export", KEYWORD "grammar", ID "Example", SYMBOL "{",
//            KEYWORD "start", ID "NEWLINE", SYMBOL ";",
//            ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";",
//        SYMBOL "}"
//    ) -> (
//        Module(
//            Import(("INT", "STRING"), ".common"),
//            Export(Constructor("Statement", "Expression")),
//            Export(Grammar("Example", (
//                Start(Ref("NEWLINE")),
//                Rule("NEWLINE", Literal("\"\\n\""))
//            )))
//        )
//    );
//}
exports['test "start"'] = function(test) {
    var start = new Parser().start();
    
    test.deepEqual(g.parse(start, [
        KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), SYMBOL("."), ID("common"), SYMBOL(";"),
        KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";"),
        KEYWORD("export"), KEYWORD("grammar"), ID("Example"), SYMBOL("{"),
            KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"),
            ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"),
        SYMBOL("}")
    ]), [[
        Module([
            Import([["INT", "STRING"], ".common"]),
            Export([Constructor(["Statement", "Expression"])]),
            Export([Grammar(["Example", [
                Start([Ref(["NEWLINE"])]),
                Rule(["NEWLINE", Literal(["\"\\n\""])])
            ]])])
        ])
    ]]);
    
    test.done();
};

//export test "Import" {
//    start Parser.Import;
//    
//    assert (
//        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common", SYMBOL ";"
//    ) -> (
//        Import(("INT", "STRING"), ".common")
//    );
//}
exports['test "Import"'] = function(test) {
    var start = new Parser().Import();
    
    test.deepEqual(g.parse(start, [
        KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), SYMBOL("."), ID("common"), SYMBOL(";")
    ]), [[
        Import([["INT", "STRING"], ".common"])
    ]]);
    
    test.done();
};

//export test "Export" {
//    start Parser.Export;
//    
//    assert (
//        KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";"
//    ) -> (
//        Export(Constructor("Statement", "Expression"))
//    );
//}
exports['test "Export"'] = function(test) {
    var start = new Parser().Export();
    
    test.deepEqual(g.parse(start, [
        KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")
    ]), [[
        Export([Constructor(["Statement", "Expression"])])
    ]]);
    
    test.done();
};

//export test "Constructor" {
//    start Parser.Constructor;
//    
//    assert (
//        KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";",
//    ) -> (
//        Constructor("Statement", "Expression")
//    );
//}
exports['test "Constructor"'] = function(test) {
    var start = new Parser().Constructor();
    
    test.deepEqual(g.parse(start, [
        KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")
    ]), [[
        Constructor(["Statement", "Expression"])
    ]]);
    
    test.done();
};

//export test "Grammar" {
//    start Parser.Grammar;
//    
//    assert (
//        KEYWORD "grammar", ID "Example", SYMBOL "{",
//            KEYWORD "start", ID "NEWLINE", SYMBOL ";",
//            ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";",
//        SYMBOL "}"
//    ) -> (
//        Grammar("Example", (
//            Start(Ref("NEWLINE")),
//            Rule("NEWLINE", Literal("\"\\n\""))
//        ))
//    );
//}
exports['test "Grammar"'] = function(test) {
    var start = new Parser().Grammar();
    
    test.deepEqual(g.parse(start, [
        KEYWORD("grammar"), ID("Example"), SYMBOL("{"),
            KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"),
            ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"),
        SYMBOL("}")
    ]), [[
        Grammar(["Example", [
            Start([Ref(["NEWLINE"])]),
            Rule(["NEWLINE", Literal(["\"\\n\""])])
        ]])
    ]]);
    
    test.done();
}

//export test "Rule" {
//    start Parser.Rule;
//    
//    assert (KEYWORD "start", ID "NEWLINE", SYMBOL ";") -> (Start(Ref("NEWLINE")));
//    assert (KEYWORD "start") -> {};
//    
//    assert (ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";") -> (Rule("NEWLINE", Literal("\"\\n\"")));
//    assert (ID "NEWLINE") -> {};
//}
exports['test "Rule"'] = function(test) {
    var start = new Parser().Rule();
    
    test.deepEqual(g.parse(start, [KEYWORD("start"), ID("NEWLINE"), SYMBOL(";")]), [[Start([Ref(["NEWLINE"])])]]);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    
    test.deepEqual(g.parse(start, [ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";")]), [[Rule(["NEWLINE", Literal(["\"\\n\""])])]]);
    test.deepEqual(g.parse(start, [ID("NEWLINE")]), []);
    
    test.done();
};

//export test "IdentifierList" {
//    start Parser.IdentifierList;
//    
//    assert (SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}") -> (("INT", "STRING"));
//}
exports['test "IdentifierList"'] = function(test) {
    var start = new Parser().IdentifierList();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}")
    ]), [[
        ["INT", "STRING"]
    ]]);
    
    test.done();
};

//export test "ModuleIdentifier" {
//    start Parser.ModuleIdentifier;
//    
//    assert (SYMBOL ".", ID "common") -> (".common");
//}
exports['test "ModuleIdentifier"'] = function(test) {
    var start = new Parser().ModuleIdentifier();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("."), ID("common")
    ]), [[
        ".common"
    ]]);
    
    test.done();
};

//export test "Expression" {
//    start Parser.Expression;
//    
//    assert (
//        LITERAL "\"var\"", SYMBOL "!", ID "Identifier",
//            SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")",
//            SYMBOL "*", LITERAL "\";\"", SYMBOL "!", SYMBOL "->", ID "Variable",
//        SYMBOL "|", LITERAL "\"function\"", SYMBOL "!", ID "Identifier", SYMBOL "?",
//            LITERAL "\"(\"", SYMBOL "!", ID "Param", SYMBOL "+", LITERAL "\")\"", SYMBOL "!",
//            SYMBOL "->", ID "Call",
//        SYMBOL "|", SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|",
//            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")",
//            SYMBOL "->", ID "Value"
//    ) -> (
//        Or(Or(
//            Red(Seq(Seq(Seq(
//                Ignore(Literal("\"var\"")),
//                Ref("Identifier")),
//                Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))),
//                Ignore(Literal("\";\""))
//            ), "Variable"),
//            Red(Seq(Seq(Seq(Seq(
//                Ignore(Literal("\"function\"")),
//                Maybe(Ref("Identifier"))),
//                Ignore(Literal("\"(\""))),
//                Many(Ref("Param"))),
//                Ignore(Literal("\")\""))
//            ), "Call")),
//            Red(Or(
//                InstanceOf("INT"),
//                And(InstanceOf("STRING"), Not(InstanceOf("INT")))
//            ), "Value")
//        )
//    );
//}
exports['test "Expression"'] = function(test) {
    var start = new Parser().Expression();
    
    test.deepEqual(g.parse(start, [
        LITERAL("\"var\""), SYMBOL("!"), ID("Identifier"),
            SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"),
            SYMBOL("*"), LITERAL("\";\""), SYMBOL("!"), SYMBOL("->"), ID("Variable"),
        SYMBOL("|"), LITERAL("\"function\""), SYMBOL("!"), ID("Identifier"), SYMBOL("?"),
            LITERAL("\"(\""), SYMBOL("!"), ID("Param"), SYMBOL("+"), LITERAL("\")\""), SYMBOL("!"),
            SYMBOL("->"), ID("Call"),
        SYMBOL("|"), SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"),
            SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"),
            SYMBOL("->"), ID("Value")
    ]), [[
        Or([Or([
            Red([Seq([Seq([Seq([
                Ignore([Literal(["\"var\""])]),
                Ref(["Identifier"])]),
                Any([Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])])]),
                Ignore([Literal(["\";\""])])
            ]), "Variable"]),
            Red([Seq([Seq([Seq([Seq([
                Ignore([Literal(["\"function\""])]),
                Maybe([Ref(["Identifier"])])]),
                Ignore([Literal(["\"(\""])])]),
                Many([Ref(["Param"])])]),
                Ignore([Literal(["\")\""])])
            ]), "Call"])]),
            Red([Or([
                InstanceOf(["INT"]),
                And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])
            ]), "Value"])
        ])
    ]]);
    
    test.done();
};

//export test "OrExpr" {
//    start Parser.OrExpr;
//    
//    assert (
//        SYMBOL "@", ID "INT", SYMBOL "|",
//            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT"
//    ) -> (
//        Or(
//            InstanceOf("INT"),
//            And(InstanceOf("STRING"), Not(InstanceOf("INT")))
//        )
//    );
//}
exports['test "OrExpr"'] = function(test) {
    var start = new Parser().OrExpr();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("@"), ID("INT"), SYMBOL("|"),
            SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")
    ]), [[
        Or([
            InstanceOf(["INT"]),
            And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])
        ])
    ]]);
    
    test.done();
};

//export test "RedExpr" {
//    start Parser.RedExpr;
//    
//    assert (
//        SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|",
//            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")",
//            SYMBOL "->", ID "Value"
//    ) -> (
//        Red(Or(
//            InstanceOf("INT"),
//            And(InstanceOf("STRING"), Not(InstanceOf("INT")))
//        ), "Value")
//    );
//}
exports['test "RedExpr"'] = function(test) {
    var start = new Parser().RedExpr();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"),
            SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"),
            SYMBOL("->"), ID("Value")
    ]), [[
        Red([Or([
            InstanceOf(["INT"]),
            And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])
        ]), "Value"])
    ]]);
    
    test.done();
};

//export test "AndExpr" {
//    start Parser.AndExpr;
//    
//    assert (
//        SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT"
//    ) -> (
//        And(InstanceOf("STRING"), Not(InstanceOf("INT")))
//    );
//}
exports['test "AndExpr"'] = function(test) {
    var start = new Parser().AndExpr();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")
    ]), [[
        And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])
    ]]);
    
    test.done();
};

//export test "SeqExpr" {
//    start Parser.SeqExpr;
//    
//    assert (
//        LITERAL "\",\"", SYMBOL "!", ID "Identifier"
//    ) -> (
//        Seq(Ignore(Literal("\",\"")), Ref("Identifier"))
//    );
//}
exports['test "SeqExpr"'] = function(test) {
    var start = new Parser().SeqExpr();
    
    test.deepEqual(g.parse(start, [
        LITERAL("\",\""), SYMBOL("!"), ID("Identifier")
    ]), [[
        Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])
    ]]);
    
    test.done();
};

//export test "RightExpr" {
//    start Parser.RightExpr;
//    
//    assert (
//        SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")", SYMBOL "*"
//    ) -> (
//        Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))
//    );
//    
//    assert (
//        ID "Param", SYMBOL "+"
//    ) -> (
//        Many(Ref("Param"))
//    );
//    
//    assert (
//        ID "Identifier", SYMBOL "?"
//    ) -> (
//        Maybe(Ref("Identifier"))
//    );
//    
//    assert (
//        LITERAL "\"(\"", SYMBOL "!"
//    ) -> (
//        Ignore(Literal("\"(\""))
//    );
//}

exports['test "RightExpr"'] = function(test) {
    var start = new Parser().RightExpr();
    
    test.deepEqual(g.parse(start, [
        ID("Param"), SYMBOL("+")
    ]), [[
        Many([Ref(["Param"])])
    ]]);
    
    test.deepEqual(g.parse(start, [
        ID("Identifier"), SYMBOL("?")
    ]), [[
        Maybe([Ref(["Identifier"])])
    ]]);
    
    test.deepEqual(g.parse(start, [
        LITERAL("\"(\""), SYMBOL("!")
    ]), [[
        Ignore([Literal(["\"(\""])])
    ]]);
    
    test.done();
};

//export test "LeftExpr" {
//    start Parser.LeftExpr;
//    
//    assert (
//        SYMBOL "@", ID "STRING"
//    ) -> (
//        InstanceOf("STRING")
//    );
//    
//    assert (
//        SYMBOL "~", SYMBOL "@", ID "INT"
//    ) -> (
//        Not(InstanceOf("INT"))
//    );
//}
exports['test "LeftExpr"'] = function(test) {
    var start = new Parser().LeftExpr();
    
    test.deepEqual(g.parse(start, [
        SYMBOL("~"), SYMBOL("@"), ID("INT")
    ]), [[
        Not([InstanceOf(["INT"])])
    ]]);
    
    test.done();
};

//export test "Terminal" {
//    start Parser.Terminal;
//    
//    assert (SYMBOL "(", ID "id", SYMBOL ")") -> (Ref("id"));
//    assert (ID "id") -> (Ref("id"));
//    assert (CLASS "[a-z]") -> (Class("[a-z]"));
//    assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
//    assert (SYMBOL "|") -> {};
//    assert (KEYWORD "start") -> {};
//}
exports['test "Terminal"'] = function(test) {
    var start = new Parser().Terminal();
    
    test.deepEqual(g.parse(start, [SYMBOL("("), ID("id"), SYMBOL(")")]), [[Ref(["id"])]]);
    test.deepEqual(g.parse(start, [SYMBOL("@"), ID("STRING")]), [[InstanceOf(["STRING"])]]);
    test.deepEqual(g.parse(start, [ID("id")]), [[Ref(["id"])]]);
    test.deepEqual(g.parse(start, [CLASS("[a-z]")]), [[Class(["[a-z]"])]]);
    test.deepEqual(g.parse(start, [LITERAL("\"literal\"")]), [[Literal(["\"literal\""])]]);
    test.deepEqual(g.parse(start, [SYMBOL("|")]), []);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    test.done();
};
