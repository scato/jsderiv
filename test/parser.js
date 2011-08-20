var common = require('../lib/common'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');

var Token   = parser.Token,
    Stream  = lexer.Stream,
    Grammar = parser.Grammar,
    Set     = parser.Set,
    Term    = parser.Term;

var test = require('../src/grammars/test');

var parse = test.parse;

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP,
    Expr   = test.Expr;

exports['parse "1 + 1"'] = function(test) {
    var input = new Stream(
        INT("1"),
        OP("+"),
        INT("1")
    );
    
    var output = new Set(
        Expr(Expr(INT("1")), OP("+"), INT("1"))
    );
    
    var result = parse(input);

    test.ok(result instanceof Set, 'test if result is a Set');
    test.ok(result.equals(output), 'test if ' + result.toString() + ' equals ' + output.toString());
    test.done();
};

exports['test Def/Ref'] = function(test) {
    var grammar = new Grammar();
    var expr = new Token(INT);
    var ref = grammar.Ref("Test");
    
    test.throws(function() {
        ref.resolve();
    });
    
    grammar.Def("Test", expr);
    
    var result = ref.resolve();
    
    test.ok(result instanceof common.Expr);
    test.done();
};

exports['test Term'] = function(test) {
    var term = Expr(INT("1"));
    
    test.ok(term instanceof Term);
    test.equal(term.tokens.length, 1);
    test.ok(term.tokens[0].equals(INT("1")));
    test.equal(term.toString(), "Expr(INT(\"1\"))");
    test.done();
};

exports['test equal'] = function(test) {
    var first = new Set(
        Expr(Expr(INT("1")), OP("+"), INT("1"))
    );
    
    var second = new Set(
        Expr(Expr(INT("1")), OP("+"), INT("1"))
    );
    
    test.ok(first.equals(second));
    test.done();
};

exports['test not equal'] = function(test) {
    var first = new Set(
        Expr(Expr(INT("1")), OP("+"), INT("1"))
    );
    
    var second = new Set(
        Expr(INT("1"))
    );
    
    test.ok(!first.equals(second));
    test.done();
};

