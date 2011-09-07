var common      = require('../lib/common'),
    scannerless = require('../lib/scannerless');

var Or      = common.Or,
    Char    = scannerless.Char,
    Literal = scannerless.Literal,
    Grammar = scannerless.Grammar,
    Seq     = common.Seq,
    Ignore  = scannerless.Ignore,
    Any     = common.Any;

var grammar = new Grammar("Expr");

var Def = grammar.Def,
    Ref = grammar.Ref;

var LAYOUT = Def("LAYOUT", Or(Char(" "), Char("\n")));
var INT    = Def("INT",    Literal("1"));
var OP     = Def("OP",     Or(Literal("+"), Literal("==")));
var S      = Ignore(Any(Ref("LAYOUT")));
var Expr   = Def("Expr",   Seq(Seq(S, Or(
    Seq(Seq(Seq(Ref("Expr"), Ref("OP")), S), Ref("INT")),
    Ref("INT")
)), S));

function parse(input) {
    return scannerless.parse(input, grammar);
}

exports.LAYOUT = LAYOUT;
exports.INT    = INT;
exports.OP     = OP;
exports.Expr   = Expr;

exports.parse = parse;

exports.grammar = grammar;

