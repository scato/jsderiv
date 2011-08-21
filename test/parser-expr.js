var common = require('../lib/common'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');

var Null    = common.Null,
    Empty   = common.Empty,
    Token   = parser.Token;

var Stream  = lexer.Stream;

var test = require('../src/test-lang');

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

function testNullable(output, test) {
    test.ok(output.isNullable(), 'test if ' + output.toString() + ' is nullable');
}

function testNotNullable(output, test) {
    test.ok(!output.isNullable(), 'test if ' + output.toString() + ' is not nullable');
}

function testNull(output, test) {
    test.ok(output.isNull(), 'test if ' + output.toString() + ' is equal to Null()');
}

function testNotNull(output, test) {
    test.ok(!output.isNull(), 'test if ' + output.toString() + ' is not equal to Null()');
}

exports['test Token'] = function(test) {
    var output;
    
    output = derive(Token(INT), new Stream(INT("1")));
    testNullable(output, test);
    
    output = derive(Token(INT), new Stream(OP("+")));
    testNotNullable(output, test);
    
    test.done();
};

