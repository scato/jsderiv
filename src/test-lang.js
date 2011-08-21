var common = require('../lib/common'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');


(function() {


var Literal = lexer.Literal,
    Grammar = lexer.Grammar;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

var LAYOUT = Def("LAYOUT", Literal(" "));
var INT    = Def("INT",    Literal("1"));
var OP     = Def("OP",     Literal("+"));

function tokenize(string) {
    return lexer.tokenize(string, grammar);
}

exports.LAYOUT = LAYOUT;
exports.INT    = INT;
exports.OP     = OP;

exports.tokenize = tokenize;


})();

(function() {


var INT = exports.INT,
    OP  = exports.OP;

var Seq     = common.Seq,
    Or      = common.Or;

var Token   = parser.Token,
    Grammar = parser.Grammar;

var grammar = new Grammar("Expr");

var Def = grammar.Def,
    Ref = grammar.Ref;

var Expr = Def("Expr", Or(
    Seq(Seq(Ref("Expr"), Token(OP)), Token(INT)),
    Token(INT)
));

function parse(stream) {
    return parser.parse(stream, grammar);
}

exports.Expr = Expr;

exports.parse = parse;


})();

