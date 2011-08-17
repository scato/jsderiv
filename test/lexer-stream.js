var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Literal = lexer.Literal,
    Grammar = lexer.Grammar,
    Stream  = lexer.Stream;

var grammar = new Grammar();

var Def = grammar.Def,
    Ref = grammar.Ref;

var LAYOUT = Def("LAYOUT", Literal(" "));
var INT    = Def("INT",    Literal("1"));
var OP     = Def("OP",     Literal("+"));

exports['test equal'] = function(test) {
    var first = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" "),
        INT("1")
    );
    
    var second = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" "),
        INT("1")
    );
    
    test.ok(first.equals(second));
    test.done();
};

exports['test not equal'] = function(test) {
    var first = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" "),
        INT("1")
    );
    
    var second = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" ")
    );
    
    test.ok(!first.equals(second));
    test.done();
};

exports['remove LAYOUT'] = function(test) {
    var input = new Stream(
        INT("1"),
        LAYOUT(" "),
        OP("+"),
        LAYOUT(" "),
        INT("1")
    );
    
    var output = new Stream(
        INT("1"),
        OP("+"),
        INT("1")
    );
    
    var result = input.exclude(LAYOUT);
    
    test.ok(result.equals(output));
    test.done();
};

