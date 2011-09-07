var common      = require('../lib/common'),
    scannerless = require('../lib/lexer');

var Null    = common.Null,
    Empty   = common.Empty,
    Char    = scannerless.Char,
    One     = scannerless.One,
    No      = scannerless.No,
    Literal = scannerless.Literal,
    Range   = scannerless.Range;

function derive(expr, input) {
    var output = expr;
    
    for(var i = 0; i < input.length; i++) {
        output = output.derive(input[i]);
    }
    
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

exports['test Char'] = function(test) {
    var output;
    
    output = derive(Char("1"), "1");
    testNullable(output, test);
    
    output = derive(Char("1"), "+");
    testNotNullable(output, test);
    
    test.done();
};

exports['test One'] = function(test) {
    var output;
    
    output = derive(One(), "1");
    testNullable(output, test);
    
    output = derive(One(), "+");
    testNullable(output, test);
    
    test.done();
};

exports['test No'] = function(test) {
    var output;
    
    output = derive(No("1"), "1");
    testNotNullable(output, test);
    
    output = derive(No("1"), "+");
    testNullable(output, test);
    
    test.done();
};

exports['test Literal'] = function(test) {
    var output;
    
    output = derive(Literal("test"), "test");
    testNullable(output, test);
    
    output = derive(Literal("test"), "tes");
    testNotNullable(output, test);
    testNotNull(output, test);
    
    output = derive(Literal("test"), "tst");
    testNull(output, test);
    
    test.done();
};

exports['test Range'] = function(test) {
    var output;
    
    output = derive(Range("a", "f"), "c");
    testNullable(output, test);
    
    output = derive(Range("a", "f"), "i");
    testNull(output, test);
    
    test.done();
};

