var common = require('../lib/common'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');

var Void    = common.Void,
    Null   = common.Null,
    Token   = parser.Token,
    Literal = parser.Literal;

var Stream  = lexer.Stream;

var test = require('../src/test-lp-lang');

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP;

function derive(expr, input) {
    var output = expr;
    
    input.forEach(function(token) {
        output = output.derive(token);
    });
    
    return output;
}

function testVoidable(output, test) {
    test.ok(output.isNullable(), 'test if ' + output.toString() + ' is nullable');
}

function testNotVoidable(output, test) {
    test.ok(!output.isNullable(), 'test if ' + output.toString() + ' is not nullable');
}

function testVoid(output, test) {
    test.ok(output.isVoid(), 'test if ' + output.toString() + ' is equal to Void()');
}

function testNotVoid(output, test) {
    test.ok(!output.isVoid(), 'test if ' + output.toString() + ' is not equal to Void()');
}

exports['test Token'] = function(test) {
    var output;
    
    output = derive(Token(INT), new Stream(INT("1")));
    testVoidable(output, test);
    
    output = derive(Token(INT), new Stream(OP("+")));
    testNotVoidable(output, test);
    
    test.done();
};

exports['test Literal'] = function(test) {
    var output;
    
    output = derive(Literal("+"), new Stream(OP("+")));
    testVoidable(output, test);
    
    output = derive(Literal("+"), new Stream(INT("1")));
    testNotVoidable(output, test);
    
    test.done();
};

