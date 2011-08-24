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
    Char    = lexer.Char,
    One     = lexer.One,
    No      = lexer.No,
    Range   = lexer.Range,
    Literal = lexer.Literal,
    Grammar = lexer.Grammar;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

exports.LAYOUT  = Def("LAYOUT",  Many(Or(Or(Or(Char(" "), Char("\n")), Char("\r")), Char("\t"))));
exports.IDPART  = Or(Or(Range("A", "Z"), Range("a", "z")), Char("_"));
exports.ID      = Def("ID",      Seq(Many(exports.IDPART), Look(Not(exports.IDPART))));
//exports.ID      = Def("ID",      Seq(Many(exports.IDPART), Look(And(One(), Not(exports.IDPART)))));
exports.SYMBOL  = Def("SYMBOL",  Or(Or(Or(Or(Or(Or(Or(Literal(":"), Literal("::")), Literal("|")), Literal("*")), Literal("?")), Literal("+")), Literal("(")), Literal(")")));
exports.LITERAL = Def("LITERAL", Seq(Seq(Char("'"), Any(Or(No("\\"), Seq(Char("\\"), Char("'"))))), Char("'")));

exports.tokenize = function(string) {
    return lexer.tokenize(string, grammar);
}


})();

(function() {


var ID     = exports.ID,
    SYMBOL = exports.SYMBOL;

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
exports.LexerRule =  Def("LexerRule",  Seq(Seq(Token(ID), Literal("::")), Ref("Expression")));
exports.ParserRule = Def("ParserRule", Seq(Seq(Token(ID), Literal(":")), Ref("Expression")));
exports.Expression = Def("Expression", Or(Seq(Seq(Ref("Expression"), Literal("|")), Token(ID)), Token(ID)));

exports.parse = function(stream) {
    return parser.parse(stream, grammar);
}


})();

