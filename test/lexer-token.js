var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Literal = lexer.Literal,
    Grammar = lexer.Grammar,
    Token   = lexer.Token,
    Stream  = lexer.Stream;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

var LAYOUT = Def("LAYOUT", Literal(" ")),
    INT    = Def("INT",    Literal("1")),
    OP     = Def("OP",     Literal("+"));

exports['test Def/Ref'] = function(test) {
    var grammar = new Grammar();
    var expr = new Literal("test");
    var ref = grammar.Ref("TEST");
    
    test.throws(function() {
        ref.resolve();
    });
    
    grammar.Def("TEST", expr);
    
    var result = ref.resolve();
    
    test.equals(result, expr);
    test.done();
};

exports['test Token.toString()'] = function(test) {
    var string = " ";
    var token = LAYOUT(string);
    
    test.ok(token instanceof Token);
    test.equal(token.toString(), string);
    test.done();
};

