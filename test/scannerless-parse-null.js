var common      = require('../lib/common'),
    scannerless = require('../lib/scannerless');

var Null    = common.Null,
    Empty   = common.Empty,
    Char    = scannerless.Char,
    Literal = scannerless.Literal;

function derive(expr, input) {
    var output = expr;
    
    for(var i = 0; i < input.length; i++) {
        output = output.derive(input[i]);
    }
    
    return output;
}

exports['test Char'] = function(test) {
    var output;
    
    test.deepEqual(Char("1").parseNull(), []);
    
    output = derive(Char("1"), "1");
    test.deepEqual(output.parseNull(), [['1']]);
    
    test.done();
};

exports['test Literal'] = function(test) {
    var output;
    
    test.deepEqual(Literal("aaa").parseNull(), []);
    
    output = derive(Literal("aaa"), "aaa");
    test.deepEqual(output.parseNull(), [['a', 'a', 'a']]);
    //test.deepEqual(output.parseNull(), [['aaa']]);
    
    test.done();
};

