var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Void    = common.Void,
    Null   = common.Null,
    Char    = lexer.Char,
    One     = lexer.One,
    No      = lexer.No,
    Literal = lexer.Literal,
    Range   = lexer.Range,
    RegExp  = lexer.RegExp;

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

function testVoid(output, test) {
    test.ok(output.isVoid(), 'test if ' + output.toString() + ' is equal to Void()');
}

function testNotVoid(output, test) {
    test.ok(!output.isVoid(), 'test if ' + output.toString() + ' is not equal to Void()');
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
    testNotVoid(output, test);
    
    output = derive(Literal("test"), "tst");
    testVoid(output, test);
    
    test.done();
};

exports['test Range'] = function(test) {
    var output;
    
    output = derive(Range("a", "f"), "c");
    testNullable(output, test);
    
    output = derive(Range("a", "f"), "i");
    testVoid(output, test);
    
    test.done();
};

/*
exports['test RegExp'] = function(test) {
    var output;
    
    output = derive(RegExp(/a(bb)+c/), "abbc");
    testNullable(output, test);
    
    output = derive(RegExp(/a(bb)+c/), "abbb");
    testNotNullable(output, test);
    testNotVoid(output, test);

    output = derive(RegExp(/a(bb)+c/), "abbbc");
    testVoid(output, test);

    output = derive(RegExp(/a(bb)+c/), "cabbc");
    testVoid(output, test);

    output = derive(RegExp(/a(bb)+c/), "c");
    testVoid(output, test);

    test.done();
};
*/

