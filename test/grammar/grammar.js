var $ = require('../jsderiv');

// import {Lexer} from ...src."grammar"."grammar";
var Lexer = require("./../../src/grammar/grammar").Lexer;

// import {ID, QID, LITERAL, CHAR, CATEGORY, SYMBOL, CLASS, KEYWORD} from ...src."grammar"."grammar";
var ID       = require("./../../src/grammar/grammar").ID,
    QID      = require("./../../src/grammar/grammar").QID,
    LITERAL  = require("./../../src/grammar/grammar").LITERAL,
    CHAR     = require("./../../src/grammar/grammar").CHAR,
    CATEGORY = require("./../../src/grammar/grammar").CATEGORY,
    SYMBOL   = require("./../../src/grammar/grammar").SYMBOL,
    CLASS    = require("./../../src/grammar/grammar").CLASS,
    KEYWORD  = require("./../../src/grammar/grammar").KEYWORD;

// export test "SPACE" {
//     start Lexer.SPACE;
//     
//     assert " " -> ();
// }
exports["test \"SPACE\""] = function(test) {
    var start = new Lexer().SPACE();
    
    test.deepEqual(start.parse(" "), [[]]);
    test.done();
};

// export test "ID" {
//     start Lexer.ID;
//     
//     assert "id" -> (ID("id"));
//     assert "start" -> {};
//     assert "id2" -> (ID("id2"));
//     assert "ID_2" -> (ID("ID_2"));
//     assert "common-lib" -> (ID("common-lib"));
// }
exports["test \"ID\""] = function(test) {
    var start = new Lexer().ID();
    
    test.deepEqual(start.parse("id"), [[ID("id")]]);
    test.deepEqual(start.parse("start"), []);
    test.deepEqual(start.parse("id2"), [[ID("id2")]]);
    test.deepEqual(start.parse("ID_2"), [[ID("ID_2")]]);
    test.deepEqual(start.parse("common-lib"), [[ID("common-lib")]]);
    test.done();
};

// export test "QID" {
//     start Lexer.QID;
//     
//     assert "." -> {};
//     assert "id" -> {};
//     assert "Example.NEWLINE" -> (QID("Example.NEWLINE"));
//     assert ".common-lib" -> (QID(".common-lib"));
//     assert "...lib.common" -> (QID("...lib.common"));
// }
exports["test \"QID\""] = function(test) {
    var start = new Lexer().QID();
    
    test.deepEqual(start.parse("."), []);
    test.deepEqual(start.parse("id"), []);
    test.deepEqual(start.parse("Example.NEWLINE"), [[QID("Example.NEWLINE")]]);
    test.deepEqual(start.parse(".common-lib"), [[QID(".common-lib")]]);
    test.deepEqual(start.parse("...lib.common"), [[QID("...lib.common")]]);
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
    
    test.deepEqual(start.parse("/* comment */"), [[]]);
    test.deepEqual(start.parse("// comment"), [[]]);
    test.done();
};

// export test "CHAR" {
//     start Lexer.CHAR;
//     
//     assert "'a'" -> (CHAR("'a'"));
//     assert "'\\t'" -> (CHAR("'\\t'"));
//     assert "'\\u0020'" -> (CHAR("'\\u0020'"));
//     assert "'\\w'" -> {};
// }
exports["test \"CHAR\""] = function(test) {
    var start = new Lexer().CHAR();
    
    test.deepEqual(start.parse("'a'"), [[CHAR("'a'")]]);
    test.deepEqual(start.parse("'\\t'"), [[CHAR("'\\t'")]]);
    test.deepEqual(start.parse("'\\u0020'"), [[CHAR("'\\u0020'")]]);
    test.deepEqual(start.parse("'\\w'"), []);
    test.done();
};

// export test "CATEGORY" {
//     start Lexer.CATEGORY;
//     
//     assert "'\\w'" -> (CATEGORY("'\\w'"));
//     assert "'a'" -> {};
//     assert "'\\t'" -> {};
// }
exports["test \"CATEGORY\""] = function(test) {
    var start = new Lexer().CATEGORY();
    
    test.deepEqual(start.parse("'\\w'"), [[CATEGORY("'\\w'")]]);
    test.deepEqual(start.parse("'a'"), []);
    test.deepEqual(start.parse("'\\t'"), []);
    test.done();
};

// export test "LITERAL" {
//     start Lexer.LITERAL;
//     
//     assert "\"literal\"" -> (LITERAL("\"literal\""));
//     assert "'literal'" -> {};
// }
exports["test \"LITERAL\""] = function(test) {
    var start = new Lexer().LITERAL();
    
    test.deepEqual(start.parse("\"literal\""), [[LITERAL("\"literal\"")]]);
    test.deepEqual(start.parse("'literal'"), []);
    test.done();
};

// export test "SYMBOL" {
//     start Lexer.SYMBOL;
//     
//     assert "|" -> (SYMBOL("|"));
//     assert "<" -> (SYMBOL("<"));
//     assert ">" -> (SYMBOL(">"));
// }
exports["test \"SYMBOL\""] = function(test) {
    var start = new Lexer().SYMBOL();
    
    test.deepEqual(start.parse("|"), [[SYMBOL("|")]]);
    test.deepEqual(start.parse("<"), [[SYMBOL("<")]]);
    test.deepEqual(start.parse(">"), [[SYMBOL(">")]]);
    test.done();
};

// export test "CLASS" {
//     start Lexer.CLASS;
//     
//     assert "[0-9]" -> (CLASS("[0-9]"));
//     assert "[123]" -> (CLASS("[123]"));
//     assert "[^0-9]" -> (CLASS("[^0-9]"));
//     assert "[^123]" -> (CLASS("[^123]"));
//     assert "[0-9^123]" -> {};
//     assert "[0-]" -> {};
//     assert "[^]" -> {};
// }
exports["test \"CLASS\""] = function(test) {
    var start = new Lexer().CLASS();
    
    test.deepEqual(start.parse("[0-9]"), [[CLASS("[0-9]")]]);
    test.deepEqual(start.parse("[123]"), [[CLASS("[123]")]]);
    test.deepEqual(start.parse("[^0-9]"), [[CLASS("[^0-9]")]]);
    test.deepEqual(start.parse("[^123]"), [[CLASS("[^123]")]]);
    test.deepEqual(start.parse("[0-9^123]"), []);
    test.deepEqual(start.parse("[0-]"), []);
    test.deepEqual(start.parse("[^]"), []);
    test.done();
};

// export test "KEYWORD" {
//     start Lexer.KEYWORD;
//     
//     assert "grammar" -> (KEYWORD("grammar"));
//     assert "start" -> (KEYWORD("start"));
//     assert "import" -> (KEYWORD("import"));
//     assert "from" -> (KEYWORD("from"));
//     assert "export" -> (KEYWORD("export"));
//     assert "constructor" -> (KEYWORD("constructor"));
//     assert "augment" -> (KEYWORD("augment"));
//     assert "default" -> (KEYWORD("default"));
//     assert "extends" -> (KEYWORD("extends"));
//     assert "super" -> (KEYWORD("super"));
// }
exports["test \"KEYWORD\""] = function(test) {
    var start = new Lexer().KEYWORD();
    
    test.deepEqual(start.parse("grammar"), [[KEYWORD("grammar")]]);
    test.deepEqual(start.parse("start"), [[KEYWORD("start")]]);
    test.deepEqual(start.parse("import"), [[KEYWORD("import")]]);
    test.deepEqual(start.parse("from"), [[KEYWORD("from")]]);
    test.deepEqual(start.parse("export"), [[KEYWORD("export")]]);
    test.deepEqual(start.parse("constructor"), [[KEYWORD("constructor")]]);
    test.deepEqual(start.parse("augment"), [[KEYWORD("augment")]]);
    test.deepEqual(start.parse("default"), [[KEYWORD("default")]]);
    test.deepEqual(start.parse("extends"), [[KEYWORD("extends")]]);
    test.deepEqual(start.parse("super"), [[KEYWORD("super")]]);
    test.done();
};

// export test "Lexer" {
//     start Lexer.start;
//     
//     assert "id /* comment */ \"literal\" | [0-9] start" -> (ID("id"), LITERAL("\"literal\""), SYMBOL("|"), CLASS("[0-9]"), KEYWORD("start"));
//     assert "id /* comment */ \"literal\" | [0-9" -> {};
//     assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
//     assert "'a' '\\t' '\\w'" -> (CHAR("'a'"), CHAR("'\\t'"), CATEGORY("'\\w'"));
//     assert "id" -> (ID("id"));
//     assert "exports" -> (ID("exports"));
//     assert ".example" -> (QID(".example"));
//     assert "...example" -> (QID("...example"));
//     assert ". example" -> (SYMBOL("."), ID("example"));
//     assert "Example.NEWLINE" -> (QID("Example.NEWLINE"));
//     assert "Example.start" -> (QID("Example.start"));
// }
exports["test \"Lexer\""] = function(test) {
    var start = new Lexer().start();
    
    test.deepEqual(start.parse("id /* comment */ \"literal\" | [0-9] start"), [[ID("id"), LITERAL("\"literal\""), SYMBOL("|"), CLASS("[0-9]"), KEYWORD("start")]]);
    test.deepEqual(start.parse("id /* comment */ \"literal\" | [0-9"), []);
    test.deepEqual(start.parse("id /* comment */ \"literal\" | [0-9] start 123"), []);
    test.deepEqual(start.parse("'a' '\\t' '\\w'"), [[CHAR("'a'"), CHAR("'\\t'"), CATEGORY("'\\w'")]]);
    test.deepEqual(start.parse("id"), [[ID("id")]]);
    test.deepEqual(start.parse("exports"), [[ID("exports")]]);
    test.deepEqual(start.parse(".example"), [[QID(".example")]]);
    test.deepEqual(start.parse("...example"), [[QID("...example")]]);
    test.deepEqual(start.parse(". example"), [[SYMBOL("."), ID("example")]]);
    test.deepEqual(start.parse("Example.NEWLINE"), [[QID("Example.NEWLINE")]]);
    test.deepEqual(start.parse("Example.start"), [[QID("Example.start")]]);
    test.done();
};

// import {Parser} from ...src."grammar"."grammar";
var Parser = require("./../../src/grammar/grammar").Parser;

// import {Module, Import, Export, Constructor, Grammar, Start, Rule} from ...src."grammar"."grammar";
var Module      = require("./../../src/grammar/grammar").Module,
    Import      = require("./../../src/grammar/grammar").Import,
    Export      = require("./../../src/grammar/grammar").Export,
    Constructor = require("./../../src/grammar/grammar").Constructor,
    Grammar     = require("./../../src/grammar/grammar").Grammar,
    Start       = require("./../../src/grammar/grammar").Start,
    Rule        = require("./../../src/grammar/grammar").Rule;

// import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, One, Ref, Class, Literal, Char, Category, Type, Value, Default, Super, Capture, Part, Defer} from ...src."grammar"."grammar";
var Or       = require("./../../src/grammar/grammar").Or,
    Red      = require("./../../src/grammar/grammar").Red,
    And      = require("./../../src/grammar/grammar").And,
    Seq      = require("./../../src/grammar/grammar").Seq,
    Any      = require("./../../src/grammar/grammar").Any,
    Many     = require("./../../src/grammar/grammar").Many,
    Maybe    = require("./../../src/grammar/grammar").Maybe,
    Ignore   = require("./../../src/grammar/grammar").Ignore,
    Not      = require("./../../src/grammar/grammar").Not,
    Look     = require("./../../src/grammar/grammar").Look,
    One      = require("./../../src/grammar/grammar").One,
    Ref      = require("./../../src/grammar/grammar").Ref,
    Class    = require("./../../src/grammar/grammar").Class,
    Literal  = require("./../../src/grammar/grammar").Literal,
    Char     = require("./../../src/grammar/grammar").Char,
    Category = require("./../../src/grammar/grammar").Category,
    Type     = require("./../../src/grammar/grammar").Type,
    Value    = require("./../../src/grammar/grammar").Value,
    Default  = require("./../../src/grammar/grammar").Default,
    Super    = require("./../../src/grammar/grammar").Super,
    Capture  = require("./../../src/grammar/grammar").Capture,
    Part     = require("./../../src/grammar/grammar").Part,
    Defer    = require("./../../src/grammar/grammar").Defer;

// export test "Parser" {
//     start Parser.start;
//     
//     assert (KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), QID(".common-lib"), SYMBOL(";"), KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";"), KEYWORD("export"), KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")) -> (Module(Import(("INT", "STRING"), ".common-lib"), Export(Constructor("Statement", "Expression")), Export(Grammar("Example", (Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\"")))))));
// }
exports["test \"Parser\""] = function(test) {
    var start = new Parser().start();
    
    test.deepEqual(start.parse([KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), QID(".common-lib"), SYMBOL(";"), KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";"), KEYWORD("export"), KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Module(Import(["INT", "STRING"], ".common-lib"), Export(Constructor("Statement", "Expression")), Export(Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))])))]]);
    test.done();
};

// export test "Import" {
//     start Parser.Import;
//     
//     assert (KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), QID(".common-lib"), SYMBOL(";")) -> (Import(("INT", "STRING"), ".common-lib"));
// }
exports["test \"Import\""] = function(test) {
    var start = new Parser().Import();
    
    test.deepEqual(start.parse([KEYWORD("import"), SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}"), KEYWORD("from"), QID(".common-lib"), SYMBOL(";")]), [[Import(["INT", "STRING"], ".common-lib")]]);
    test.done();
};

// export test "Export" {
//     start Parser.Export;
//     
//     assert (KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")) -> (Export(Constructor("Statement", "Expression")));
// }
exports["test \"Export\""] = function(test) {
    var start = new Parser().Export();
    
    test.deepEqual(start.parse([KEYWORD("export"), KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")]), [[Export(Constructor("Statement", "Expression"))]]);
    test.done();
};

// export test "Constructor" {
//     start Parser.Constructor;
//     
//     assert (KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")) -> (Constructor("Statement", "Expression"));
// }
exports["test \"Constructor\""] = function(test) {
    var start = new Parser().Constructor();
    
    test.deepEqual(start.parse([KEYWORD("constructor"), ID("Statement"), SYMBOL(","), ID("Expression"), SYMBOL(";")]), [[Constructor("Statement", "Expression")]]);
    test.done();
};

// export test "Grammar" {
//     start Parser.Grammar;
//     
//     assert (KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")) -> (Grammar("Example", (Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\"")))));
//     assert (KEYWORD("grammar"), ID("Example2"), KEYWORD("extends"), ID("Example"), SYMBOL("{"), ID("NEWLINE"), SYMBOL(":"), KEYWORD("super"), SYMBOL("|"), LITERAL("\"\\r\\n\""), SYMBOL(";"), SYMBOL("}")) -> (Grammar("Example2", "Example", (Rule("NEWLINE", Or(Super(), Literal("\"\\r\\n\""))))));
// }
exports["test \"Grammar\""] = function(test) {
    var start = new Parser().Grammar();
    
    test.deepEqual(start.parse([KEYWORD("grammar"), ID("Example"), SYMBOL("{"), KEYWORD("start"), ID("NEWLINE"), SYMBOL(";"), ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))])]]);
    test.deepEqual(start.parse([KEYWORD("grammar"), ID("Example2"), KEYWORD("extends"), ID("Example"), SYMBOL("{"), ID("NEWLINE"), SYMBOL(":"), KEYWORD("super"), SYMBOL("|"), LITERAL("\"\\r\\n\""), SYMBOL(";"), SYMBOL("}")]), [[Grammar("Example2", "Example", [Rule("NEWLINE", Or(Super(), Literal("\"\\r\\n\"")))])]]);
    test.done();
};

// export test "Rule" {
//     start Parser.Rule;
//     
//     assert (KEYWORD("start"), ID("NEWLINE"), SYMBOL(";")) -> (Start(Ref("NEWLINE")));
//     assert (KEYWORD("start")) -> {};
//     assert (ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";")) -> (Rule("NEWLINE", Literal("\"\\n\"")));
//     assert (ID("NEWLINE")) -> {};
// }
exports["test \"Rule\""] = function(test) {
    var start = new Parser().Rule();
    
    test.deepEqual(start.parse([KEYWORD("start"), ID("NEWLINE"), SYMBOL(";")]), [[Start(Ref("NEWLINE"))]]);
    test.deepEqual(start.parse([KEYWORD("start")]), []);
    test.deepEqual(start.parse([ID("NEWLINE"), SYMBOL(":"), LITERAL("\"\\n\""), SYMBOL(";")]), [[Rule("NEWLINE", Literal("\"\\n\""))]]);
    test.deepEqual(start.parse([ID("NEWLINE")]), []);
    test.done();
};

// export test "IdentifierList" {
//     start Parser.IdentifierList;
//     
//     assert (SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}")) -> (("INT", "STRING"));
// }
exports["test \"IdentifierList\""] = function(test) {
    var start = new Parser().IdentifierList();
    
    test.deepEqual(start.parse([SYMBOL("{"), ID("INT"), SYMBOL(","), ID("STRING"), SYMBOL("}")]), [[["INT", "STRING"]]]);
    test.done();
};

// export test "Expression" {
//     start Parser.Expression;
//     
//     assert (LITERAL("\"var\""), SYMBOL("!"), SYMBOL("<"), ID("Identifier"), SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*"), SYMBOL(">"), LITERAL("\";\""), SYMBOL("!"), SYMBOL("->"), ID("Variable"), SYMBOL("|"), LITERAL("\"function\""), SYMBOL("!"), ID("Identifier"), SYMBOL("?"), LITERAL("\"(\""), SYMBOL("!"), ID("Param"), SYMBOL("+"), LITERAL("\")\""), SYMBOL("!"), SYMBOL("->"), ID("Call"), SYMBOL("|"), SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")) -> (Or(Or(Red(Seq(Seq(Ignore(Literal("\"var\"")), Capture(Seq(Ref("Identifier"), Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))))), Ignore(Literal("\";\""))), "Variable"), Red(Seq(Seq(Seq(Seq(Ignore(Literal("\"function\"")), Maybe(Ref("Identifier"))), Ignore(Literal("\"(\""))), Many(Ref("Param"))), Ignore(Literal("\")\""))), "Call")), Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value")));
// }
exports["test \"Expression\""] = function(test) {
    var start = new Parser().Expression();
    
    test.deepEqual(start.parse([LITERAL("\"var\""), SYMBOL("!"), SYMBOL("<"), ID("Identifier"), SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*"), SYMBOL(">"), LITERAL("\";\""), SYMBOL("!"), SYMBOL("->"), ID("Variable"), SYMBOL("|"), LITERAL("\"function\""), SYMBOL("!"), ID("Identifier"), SYMBOL("?"), LITERAL("\"(\""), SYMBOL("!"), ID("Param"), SYMBOL("+"), LITERAL("\")\""), SYMBOL("!"), SYMBOL("->"), ID("Call"), SYMBOL("|"), SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")]), [[Or(Or(Red(Seq(Seq(Ignore(Literal("\"var\"")), Capture(Seq(Ref("Identifier"), Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))))), Ignore(Literal("\";\""))), "Variable"), Red(Seq(Seq(Seq(Seq(Ignore(Literal("\"function\"")), Maybe(Ref("Identifier"))), Ignore(Literal("\"(\""))), Many(Ref("Param"))), Ignore(Literal("\")\""))), "Call")), Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value"))]]);
    test.done();
};

// export test "OrExpr" {
//     start Parser.OrExpr;
//     
//     assert (SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")) -> (Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))));
// }
exports["test \"OrExpr\""] = function(test) {
    var start = new Parser().OrExpr();
    
    test.deepEqual(start.parse([SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[Or(Type("INT"), And(Type("STRING"), Not(Type("INT"))))]]);
    test.done();
};

// export test "RedExpr" {
//     start Parser.RedExpr;
//     
//     assert (SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")) -> (Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value"));
// }
exports["test \"RedExpr\""] = function(test) {
    var start = new Parser().RedExpr();
    
    test.deepEqual(start.parse([SYMBOL("("), SYMBOL("@"), ID("INT"), SYMBOL("|"), SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT"), SYMBOL(")"), SYMBOL("->"), ID("Value")]), [[Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value")]]);
    test.done();
};

// export test "AndExpr" {
//     start Parser.AndExpr;
//     
//     assert (SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")) -> (And(Type("STRING"), Not(Type("INT"))));
// }
exports["test \"AndExpr\""] = function(test) {
    var start = new Parser().AndExpr();
    
    test.deepEqual(start.parse([SYMBOL("@"), ID("STRING"), SYMBOL("&"), SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[And(Type("STRING"), Not(Type("INT")))]]);
    test.done();
};

// export test "SeqExpr" {
//     start Parser.SeqExpr;
//     
//     assert (LITERAL("\",\""), SYMBOL("!"), ID("Identifier")) -> (Seq(Ignore(Literal("\",\"")), Ref("Identifier")));
// }
exports["test \"SeqExpr\""] = function(test) {
    var start = new Parser().SeqExpr();
    
    test.deepEqual(start.parse([LITERAL("\",\""), SYMBOL("!"), ID("Identifier")]), [[Seq(Ignore(Literal("\",\"")), Ref("Identifier"))]]);
    test.done();
};

// export test "RightExpr" {
//     start Parser.RightExpr;
//     
//     assert (SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*")) -> (Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier"))));
//     assert (ID("Param"), SYMBOL("+")) -> (Many(Ref("Param")));
//     assert (ID("Identifier"), SYMBOL("?")) -> (Maybe(Ref("Identifier")));
//     assert (LITERAL("\"(\""), SYMBOL("!")) -> (Ignore(Literal("\"(\"")));
// }
exports["test \"RightExpr\""] = function(test) {
    var start = new Parser().RightExpr();
    
    test.deepEqual(start.parse([SYMBOL("("), LITERAL("\",\""), SYMBOL("!"), ID("Identifier"), SYMBOL(")"), SYMBOL("*")]), [[Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))]]);
    test.deepEqual(start.parse([ID("Param"), SYMBOL("+")]), [[Many(Ref("Param"))]]);
    test.deepEqual(start.parse([ID("Identifier"), SYMBOL("?")]), [[Maybe(Ref("Identifier"))]]);
    test.deepEqual(start.parse([LITERAL("\"(\""), SYMBOL("!")]), [[Ignore(Literal("\"(\""))]]);
    test.done();
};

// export test "LeftExpr" {
//     start Parser.LeftExpr;
//     
//     assert (SYMBOL("~"), SYMBOL("@"), ID("INT")) -> (Not(Type("INT")));
//     assert (SYMBOL("?="), SYMBOL("@"), ID("INT")) -> (Look(Type("INT")));
// }
exports["test \"LeftExpr\""] = function(test) {
    var start = new Parser().LeftExpr();
    
    test.deepEqual(start.parse([SYMBOL("~"), SYMBOL("@"), ID("INT")]), [[Not(Type("INT"))]]);
    test.deepEqual(start.parse([SYMBOL("?="), SYMBOL("@"), ID("INT")]), [[Look(Type("INT"))]]);
    test.done();
};

// export test "Terminal" {
//     start Parser.Terminal;
//     
//     assert (SYMBOL("("), ID("id"), SYMBOL(")")) -> (Ref("id"));
//     assert (SYMBOL("<"), ID("id"), SYMBOL(">")) -> (Capture(Ref("id")));
//     assert (SYMBOL("@"), ID("STRING")) -> (Type("STRING"));
//     assert (SYMBOL("@"), LITERAL("\"literal\"")) -> (Value("\"literal\""));
//     assert (SYMBOL(".")) -> (One());
//     assert (ID("id")) -> (Ref("id"));
//     assert (CLASS("[a-z]")) -> (Class("[a-z]"));
//     assert (LITERAL("\"literal\"")) -> (Literal("\"literal\""));
//     assert (CHAR("'a'")) -> (Char("'a'"));
//     assert (CATEGORY("'\\w'")) -> (Category("'\\w'"));
//     assert (KEYWORD("default")) -> (Default());
//     assert (KEYWORD("super")) -> (Super());
//     assert (SYMBOL("|")) -> {};
//     assert (KEYWORD("start")) -> {};
// }
exports["test \"Terminal\""] = function(test) {
    var start = new Parser().Terminal();
    
    test.deepEqual(start.parse([SYMBOL("("), ID("id"), SYMBOL(")")]), [[Ref("id")]]);
    test.deepEqual(start.parse([SYMBOL("<"), ID("id"), SYMBOL(">")]), [[Capture(Ref("id"))]]);
    test.deepEqual(start.parse([SYMBOL("@"), ID("STRING")]), [[Type("STRING")]]);
    test.deepEqual(start.parse([SYMBOL("@"), LITERAL("\"literal\"")]), [[Value("\"literal\"")]]);
    test.deepEqual(start.parse([SYMBOL(".")]), [[One()]]);
    test.deepEqual(start.parse([ID("id")]), [[Ref("id")]]);
    test.deepEqual(start.parse([CLASS("[a-z]")]), [[Class("[a-z]")]]);
    test.deepEqual(start.parse([LITERAL("\"literal\"")]), [[Literal("\"literal\"")]]);
    test.deepEqual(start.parse([CHAR("'a'")]), [[Char("'a'")]]);
    test.deepEqual(start.parse([CATEGORY("'\\w'")]), [[Category("'\\w'")]]);
    test.deepEqual(start.parse([KEYWORD("default")]), [[Default()]]);
    test.deepEqual(start.parse([KEYWORD("super")]), [[Super()]]);
    test.deepEqual(start.parse([SYMBOL("|")]), []);
    test.deepEqual(start.parse([KEYWORD("start")]), []);
    test.done();
};
