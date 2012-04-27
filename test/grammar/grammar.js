var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

g.parse = function(expr, string) { return expr.parse(string); };

var List = g.List,
    Text = g.Text;

// import {Lexer} from .lexer;
var Lexer = require('../../src/grammar/grammar').Lexer;

// import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from .lexer;
var ID      = require('../../src/grammar/grammar').ID,
    LITERAL = require('../../src/grammar/grammar').LITERAL,
    SYMBOL  = require('../../src/grammar/grammar').SYMBOL,
    CLASS   = require('../../src/grammar/grammar').CLASS,
    KEYWORD = require('../../src/grammar/grammar').KEYWORD;

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

var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

var List = g.List,
    Text = g.Text;

// import {Parser} from .parser;
var Parser = require('../../src/grammar/grammar').Parser;

// import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from .lexer;
var ID      = require('../../src/grammar/grammar').ID,
    LITERAL = require('../../src/grammar/grammar').LITERAL,
    SYMBOL  = require('../../src/grammar/grammar').SYMBOL,
    CLASS   = require('../../src/grammar/grammar').CLASS,
    KEYWORD = require('../../src/grammar/grammar').KEYWORD;

// import {Module, Import, Export, Constructor, Grammar, Start, Rule} from .parser;
var Module      = require('../../src/grammar/grammar').Module,
    Import      = require('../../src/grammar/grammar').Import,
    Export      = require('../../src/grammar/grammar').Export,
    Constructor = require('../../src/grammar/grammar').Constructor,
    Grammar     = require('../../src/grammar/grammar').Grammar,
    Start       = require('../../src/grammar/grammar').Start,
    Rule        = require('../../src/grammar/grammar').Rule;

// import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, Token, One, Ref, Class, Literal, InstanceOf, Default, Super, Capture} from .parser;
var Or         = require('../../src/grammar/grammar').Or,
    Red        = require('../../src/grammar/grammar').Red,
    And        = require('../../src/grammar/grammar').And,
    Seq        = require('../../src/grammar/grammar').Seq,
    Any        = require('../../src/grammar/grammar').Any,
    Many       = require('../../src/grammar/grammar').Many,
    Maybe      = require('../../src/grammar/grammar').Maybe,
    Ignore     = require('../../src/grammar/grammar').Ignore,
    Not        = require('../../src/grammar/grammar').Not,
    Look       = require('../../src/grammar/grammar').Look,
    Token      = require('../../src/grammar/grammar').Token,
    One        = require('../../src/grammar/grammar').One,
    Ref        = require('../../src/grammar/grammar').Ref,
    Class      = require('../../src/grammar/grammar').Class,
    Literal    = require('../../src/grammar/grammar').Literal,
    InstanceOf = require('../../src/grammar/grammar').InstanceOf,
    Default    = require('../../src/grammar/grammar').Default,
    Super      = require('../../src/grammar/grammar').Super,
    Capture    = require('../../src/grammar/grammar').Capture;

// export test "start" {
//     start Parser.start;
// 
//     assert (KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common-lib", SYMBOL ";", KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";", KEYWORD "export", KEYWORD "grammar", ID "Example", SYMBOL "{", KEYWORD "start", ID "NEWLINE", SYMBOL ";", ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";", SYMBOL "}") -> (Module(Import(("INT", "STRING"), ".common-lib"), Export(Constructor("Statement", "Expression")), Export(Grammar("Example", (Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\"")))))));
// }
exports["test \"start\""] = function(test) {
    var start = new Parser().start();

    test.deepEqual(g.parse(start, [KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), SYMBOL("."), ID("common-lib"), SYMBOL(";"), KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";"), KEYWORD("export"), KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Module([Import([["INT", "STRING"], ".common-lib"]), Export([Constructor(["Statement", "Expression"])]), Export([Grammar(["Example", [Start([Ref(["NEWLINE"])]), Rule(["NEWLINE", Literal(["\"\\n\""])])]])])])]]);
    test.done();
};

// export test "Import" {
//     start Parser.Import;
// 
//     assert (KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common-lib", SYMBOL ";") -> (Import(("INT", "STRING"), ".common-lib"));
// }
exports["test \"Import\""] = function(test) {
    var start = new Parser().Import();

    test.deepEqual(g.parse(start, [KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), SYMBOL("."), ID("common-lib"), SYMBOL(";")]), [[Import([["INT", "STRING"], ".common-lib"])]]);
    test.done();
};

// export test "Export" {
//     start Parser.Export;
// 
//     assert (KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";") -> (Export(Constructor("Statement", "Expression")));
// }
exports["test \"Export\""] = function(test) {
    var start = new Parser().Export();

    test.deepEqual(g.parse(start, [KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")]), [[Export([Constructor(["Statement", "Expression"])])]]);
    test.done();
};

// export test "Constructor" {
//     start Parser.Constructor;
// 
//     assert (KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";") -> (Constructor("Statement", "Expression"));
// }
exports["test \"Constructor\""] = function(test) {
    var start = new Parser().Constructor();

    test.deepEqual(g.parse(start, [KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")]), [[Constructor(["Statement", "Expression"])]]);
    test.done();
};

// export test "Grammar" {
//     start Parser.Grammar;
// 
//     assert (KEYWORD "grammar", ID "Example", SYMBOL "{", KEYWORD "start", ID "NEWLINE", SYMBOL ";", ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";", SYMBOL "}") -> (Grammar("Example", (Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\"")))));
//     assert (KEYWORD "grammar", ID "Example2", KEYWORD "extends", ID "Example", SYMBOL "{", ID "NEWLINE", SYMBOL ":", KEYWORD "super", SYMBOL "|", LITERAL "\"\\r\\n\"", SYMBOL ";", SYMBOL "}") -> (Grammar("Example2", "Example", (Rule("NEWLINE", Or(Super(), Literal("\"\\r\\n\""))))));
// }
exports["test \"Grammar\""] = function(test) {
    var start = new Parser().Grammar();

    test.deepEqual(g.parse(start, [KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Grammar(["Example", [Start([Ref(["NEWLINE"])]), Rule(["NEWLINE", Literal(["\"\\n\""])])]])]]);
    test.deepEqual(g.parse(start, [KEYWORD("grammar"), ID("Example2"), KEYWORD("extends"), ID("Example"), SYMBOL("{"), ID("NEWLINE"), SYMBOL(":"), KEYWORD("super"), SYMBOL("|"), LITERAL("\"\\r\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Grammar(["Example2", "Example", [Rule(["NEWLINE", Or([Super([]), Literal(["\"\\r\\n\""])])])]])]]);
    test.done();
};

// export test "Rule" {
//     start Parser.Rule;
// 
//     assert (KEYWORD "start", ID "NEWLINE", SYMBOL ";") -> (Start(Ref("NEWLINE")));
//     assert (KEYWORD "start") -> {};
//     assert (ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";") -> (Rule("NEWLINE", Literal("\"\\n\"")));
//     assert (ID "NEWLINE") -> {};
// }
exports["test \"Rule\""] = function(test) {
    var start = new Parser().Rule();

    test.deepEqual(g.parse(start, [KEYWORD("start"), ID("NEWLINE"), SYMBOL(";")]), [[Start([Ref(["NEWLINE"])])]]);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    test.deepEqual(g.parse(start, [ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";")]), [[Rule(["NEWLINE", Literal(["\"\\n\""])])]]);
    test.deepEqual(g.parse(start, [ID("NEWLINE")]), []);
    test.done();
};

// export test "IdentifierList" {
//     start Parser.IdentifierList;
// 
//     assert (SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}") -> (("INT", "STRING"));
// }
exports["test \"IdentifierList\""] = function(test) {
    var start = new Parser().IdentifierList();

    test.deepEqual(g.parse(start, [SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}")]), [[["INT", "STRING"]]]);
    test.done();
};

// export test "ModuleIdentifier" {
//     start Parser.ModuleIdentifier;
// 
//     assert (SYMBOL ".", ID "common") -> (".common");
//     assert (SYMBOL ".", LITERAL "'common-lib'") -> (".'common-lib'");
// }
exports["test \"ModuleIdentifier\""] = function(test) {
    var start = new Parser().ModuleIdentifier();

    test.deepEqual(g.parse(start, [SYMBOL("."), ID("common")]), [[".common"]]);
    test.deepEqual(g.parse(start, [SYMBOL("."), LITERAL("'common-lib'")]), [[".'common-lib'"]]);
    test.done();
};

// export test "Expression" {
//     start Parser.Expression;
// 
//     assert (LITERAL "\"var\"", SYMBOL "!", SYMBOL "<", ID "Identifier", SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")", SYMBOL "*", SYMBOL ">", LITERAL "\";\"", SYMBOL "!", SYMBOL "->", ID "Variable", SYMBOL "|", LITERAL "\"function\"", SYMBOL "!", ID "Identifier", SYMBOL "?", LITERAL "\"(\"", SYMBOL "!", ID "Param", SYMBOL "+", LITERAL "\")\"", SYMBOL "!", SYMBOL "->", ID "Call", SYMBOL "|", SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|", SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")", SYMBOL "->", ID "Value") -> (Or(Or(Red(Seq(Seq(Ignore(Literal("\"var\"")), Capture(Seq(Ref("Identifier"), Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))))), Ignore(Literal("\";\""))), "Variable"), Red(Seq(Seq(Seq(Seq(Ignore(Literal("\"function\"")), Maybe(Ref("Identifier"))), Ignore(Literal("\"(\""))), Many(Ref("Param"))), Ignore(Literal("\")\""))), "Call")), Red(Or(InstanceOf("INT"), And(InstanceOf("STRING"), Not(InstanceOf("INT")))), "Value")));
// }
exports["test \"Expression\""] = function(test) {
    var start = new Parser().Expression();

    test.deepEqual(g.parse(start, [LITERAL("\"var\""), SYMBOL("!"), SYMBOL("<"), ID("Identifier"), SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*"), SYMBOL(">"), LITERAL("\";\""), SYMBOL("!"), SYMBOL("->"), ID("Variable"), SYMBOL("|"), LITERAL("\"function\""), SYMBOL("!"), ID("Identifier"), SYMBOL("?"), LITERAL("\"(\""), SYMBOL("!"), ID("Param"), SYMBOL("+"), LITERAL("\")\""), SYMBOL("!"), SYMBOL("->"), ID("Call"), SYMBOL("|"), SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")]), [[Or([Or([Red([Seq([Seq([Ignore([Literal(["\"var\""])]), Capture([Seq([Ref(["Identifier"]), Any([Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])])])])]), Ignore([Literal(["\";\""])])]), "Variable"]), Red([Seq([Seq([Seq([Seq([Ignore([Literal(["\"function\""])]), Maybe([Ref(["Identifier"])])]), Ignore([Literal(["\"(\""])])]), Many([Ref(["Param"])])]), Ignore([Literal(["\")\""])])]), "Call"])]), Red([Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]), "Value"])])]]);
    test.done();
};

// export test "OrExpr" {
//     start Parser.OrExpr;
// 
//     assert (SYMBOL "@", ID "INT", SYMBOL "|", SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT") -> (Or(InstanceOf("INT"), And(InstanceOf("STRING"), Not(InstanceOf("INT")))));
// }
exports["test \"OrExpr\""] = function(test) {
    var start = new Parser().OrExpr();

    test.deepEqual(g.parse(start, [SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])])]]);
    test.done();
};

// export test "RedExpr" {
//     start Parser.RedExpr;
// 
//     assert (SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|", SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")", SYMBOL "->", ID "Value") -> (Red(Or(InstanceOf("INT"), And(InstanceOf("STRING"), Not(InstanceOf("INT")))), "Value"));
// }
exports["test \"RedExpr\""] = function(test) {
    var start = new Parser().RedExpr();

    test.deepEqual(g.parse(start, [SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")]), [[Red([Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]), "Value"])]]);
    test.done();
};

// export test "AndExpr" {
//     start Parser.AndExpr;
// 
//     assert (SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT") -> (And(InstanceOf("STRING"), Not(InstanceOf("INT"))));
// }
exports["test \"AndExpr\""] = function(test) {
    var start = new Parser().AndExpr();

    test.deepEqual(g.parse(start, [SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]]);
    test.done();
};

// export test "SeqExpr" {
//     start Parser.SeqExpr;
// 
//     assert (LITERAL "\",\"", SYMBOL "!", ID "Identifier") -> (Seq(Ignore(Literal("\",\"")), Ref("Identifier")));
// }
exports["test \"SeqExpr\""] = function(test) {
    var start = new Parser().SeqExpr();

    test.deepEqual(g.parse(start, [LITERAL("\",\""), SYMBOL("!"), ID("Identifier")]), [[Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])]]);
    test.done();
};

// export test "RightExpr" {
//     start Parser.RightExpr;
// 
//     assert (SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")", SYMBOL "*") -> (Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier"))));
//     assert (ID "Param", SYMBOL "+") -> (Many(Ref("Param")));
//     assert (ID "Identifier", SYMBOL "?") -> (Maybe(Ref("Identifier")));
//     assert (LITERAL "\"(\"", SYMBOL "!") -> (Ignore(Literal("\"(\"")));
// }
exports["test \"RightExpr\""] = function(test) {
    var start = new Parser().RightExpr();

    test.deepEqual(g.parse(start, [SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*")]), [[Any([Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])])]]);
    test.deepEqual(g.parse(start, [ID("Param"), SYMBOL("+")]), [[Many([Ref(["Param"])])]]);
    test.deepEqual(g.parse(start, [ID("Identifier"), SYMBOL("?")]), [[Maybe([Ref(["Identifier"])])]]);
    test.deepEqual(g.parse(start, [LITERAL("\"(\""), SYMBOL("!")]), [[Ignore([Literal(["\"(\""])])]]);
    test.done();
};

// export test "LeftExpr" {
//     start Parser.LeftExpr;
// 
//     assert (SYMBOL "~", SYMBOL "@", ID "INT") -> (Not(InstanceOf("INT")));
//     assert (SYMBOL "?=", SYMBOL "@", ID "INT") -> (Look(InstanceOf("INT")));
// }
exports["test \"LeftExpr\""] = function(test) {
    var start = new Parser().LeftExpr();

    test.deepEqual(g.parse(start, [SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[Not([InstanceOf(["INT"])])]]);
    test.deepEqual(g.parse(start, [SYMBOL("?="), SYMBOL("@"), ID("INT")]), [[Look([InstanceOf(["INT"])])]]);
    test.done();
};

// export test "Terminal" {
//     start Parser.Terminal;
// 
//     assert (SYMBOL "(", ID "id", SYMBOL ")") -> (Ref("id"));
//     assert (SYMBOL "<", ID "id", SYMBOL ">") -> (Capture(Ref("id")));
//     assert (SYMBOL "@", ID "STRING") -> (InstanceOf("STRING"));
//     assert (SYMBOL ".") -> (One());
//     assert (ID "id") -> (Ref("id"));
//     assert (CLASS "[a-z]") -> (Class("[a-z]"));
//     assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
//     assert (KEYWORD "default") -> (Default());
//     assert (KEYWORD "super") -> (Super());
//     assert (SYMBOL "|") -> {};
//     assert (KEYWORD "start") -> {};
// }
exports["test \"Terminal\""] = function(test) {
    var start = new Parser().Terminal();

    test.deepEqual(g.parse(start, [SYMBOL("("), ID("id"), SYMBOL(")")]), [[Ref(["id"])]]);
    test.deepEqual(g.parse(start, [SYMBOL("<"), ID("id"), SYMBOL(">")]), [[Capture([Ref(["id"])])]]);
    test.deepEqual(g.parse(start, [SYMBOL("@"), ID("STRING")]), [[InstanceOf(["STRING"])]]);
    test.deepEqual(g.parse(start, [SYMBOL(".")]), [[One([])]]);
    test.deepEqual(g.parse(start, [ID("id")]), [[Ref(["id"])]]);
    test.deepEqual(g.parse(start, [CLASS("[a-z]")]), [[Class(["[a-z]"])]]);
    test.deepEqual(g.parse(start, [LITERAL("\"literal\"")]), [[Literal(["\"literal\""])]]);
    test.deepEqual(g.parse(start, [KEYWORD("default")]), [[Default([])]]);
    test.deepEqual(g.parse(start, [KEYWORD("super")]), [[Super([])]]);
    test.deepEqual(g.parse(start, [SYMBOL("|")]), []);
    test.deepEqual(g.parse(start, [KEYWORD("start")]), []);
    test.done();
};
