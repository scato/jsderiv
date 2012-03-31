var Cons = require('../src/jsderiv').Cons;

var INT = Cons("INT");

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


exports['test InstanceOf'] = function(test) {
    var output;
    
    test.deepEqual(InstanceOf(INT).parseNull(), []);
    
    output = InstanceOf(INT).derive(INT("1"));
    test.deepEqual(output.parseNull(), [[INT("1")]]);
    
    test.done();
};

