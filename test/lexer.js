var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Literal = lexer.Literal,
    Token   = lexer.Token,
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

    test.ok(result instanceof Stream, 'test if result is a Stream');
    test.ok(result.equals(output), 'test if ' + result.toString() + ' equals ' + output.toString());
    test.done();
};

exports['test Def/Ref'] = function(test) {
    var grammar = new Grammar();
    var expr = new Literal("test");
    var ref = grammar.Ref("TEST");
    
    test.throws(function() {
        ref.resolve();
    });
    
    grammar.Def("TEST", expr);
    
    var result = ref.resolve();
    
    test.ok(result instanceof Expr);
    test.done();
};

exports['test Token'] = function(test) {
    var token = LAYOUT(" ");
    
    test.ok(token instanceof Token);
    test.equal(token.value, " ");
    test.equal(token.toString(), "LAYOUT(\" \")");
    test.done();
};

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

