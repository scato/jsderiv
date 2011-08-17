var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Literal = lexer.Literal,
    Stream  = lexer.Stream,
    Grammar = lexer.Grammar,
    parse   = lexer.parse;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

var LAYOUT = Def("LAYOUT", Literal(" "));
var INT    = Def("INT",    Literal("1"));
var OP     = Def("OP",     Literal("+"));

exports['parse "1 + 1"'] = function(test) {
    var input = '1 + 1';
    
    var output = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" "),
        INT("1")
    );
    
    var result = parse(input, grammar);

console.log(result.tokens);
    
    test.ok(result instanceof Stream, 'test if result is a Stream');
    test.equals(result.length, 5);
    test.ok(result.equals(output), 'test if ' + result.toString() + ' equals ' + output.toString());
    test.done();
};

