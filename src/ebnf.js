var common = require('../lib/common'),
    lookahead = require('../lib/lookahead'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');


(function() {


var Empty   = common.Empty,
    Or      = common.Or,
    Many    = common.Many,
    Seq     = common.Seq,
    Any     = common.Any,
    And     = common.And,
    Not     = common.Not,
    Look    = lookahead.Look,
    Eager   = lookahead.Eager,
    Char    = lexer.Char,
    One     = lexer.One,
    No      = lexer.No,
    Range   = lexer.Range,
    Class   = lexer.Class,
    Literal = lexer.Literal,
    Grammar = lexer.Grammar;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

exports.LAYOUT  = Def("LAYOUT",  Eager(Class(" ", "\n", "\r", "\t")));
exports.ID      = Def("ID",      Eager(Or(Or(Range("A", "Z"), Range("a", "z")), Char("_"))));
exports.SYMBOL  = Def("SYMBOL",  Or(Or(Or(Or(Or(Or(Or(Or(Literal(":"), Literal("::")), Literal(";")), Literal("|")), Literal("*")), Literal("?")), Literal("+")), Literal("(")), Literal(")")));
exports.LITERAL = Def("LITERAL", Seq(Seq(Char("'"), Any(Or(No("\\"), Seq(Char("\\"), Char("'"))))), Char("'")));

exports.tokenize = function(string) {
    return lexer.tokenize(string, grammar);
}


})();

(function() {


var ID      = exports.ID,
    SYMBOL  = exports.SYMBOL
    LITERAL = exports.LITERAL;

var Seq     = common.Seq,
    Or      = common.Or;

var Or      = common.Or,
    Many    = common.Many,
    Seq     = common.Seq,
    Any     = common.Any,
    Token   = parser.Token,
    Literal = parser.Literal,
    Grammar = parser.Grammar;

var grammar = new Grammar("Grammar");

var Def = grammar.Def,
    Ref = grammar.Ref;

exports.Grammar =    Def("Grammar",    Any(Or(Ref("LexerRule"), Ref("ParserRule"))));
exports.LexerRule =  Def("LexerRule",  Seq(Seq(Seq(Token(ID), Literal("::")), Ref("Expression")), Literal(";")));
exports.ParserRule = Def("ParserRule", Seq(Seq(Seq(Token(ID), Literal(":")), Ref("Expression")), Literal(";")));
exports.Expression = Def("Expression", Or(Seq(Seq(Ref("Expression"), Literal("|")), Ref("Sequence")), Ref("Sequence")));
exports.Sequence   = Def("Sequence",   Or(Seq(Ref("Sequence"), Ref("Terminal")), Ref("Terminal")));
exports.Terminal   = Def("Terminal",   Or(Token(ID), Token(LITERAL)));

exports.parse = function(stream) {
    return parser.parse(stream, grammar);
}


})();

