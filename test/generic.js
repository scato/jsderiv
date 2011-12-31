var common = require('../lib/common'),
    generic = require('../lib/generic');

var Void    = common.Void,
    Null    = common.Null,
    Many    = common.Many,
    Char    = generic.Char,
    One     = generic.One,
    Literal = generic.Literal,
    Range   = generic.Range,
    Node    = generic.Node,
    Ref     = generic.Ref,
    parse   = generic.parse;

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

exports['test Node with String'] = function(test) {
    var id = 'ID';
    var value = "id";
    var value2 = "foo";
    var metadata = {};
    var metadata2 = {"foo": "bar"};
    
    var node = new Node(id, value, metadata);
    var node2 = new Node(id, value, metadata);
    var node3 = new Node(id, value2, metadata);
    var node4 = new Node(id, value, metadata2);
    
    test.equals(node.value, value);
    test.deepEqual(node.metadata, metadata);
    test.ok(node.equals(node2));
    test.ok(!node.equals(node3));
    test.ok(node.equals(node4));
    test.done();
};

exports['test Ref'] = function(test) {
    var ref = Ref(function() {
        return Char("1");
    });
    
    var output;
    
    output = derive(ref, "1");
    testNullable(output, test);
    
    output = derive(ref, "+");
    testNotNullable(output, test);
    
    test.done();
};

exports['test parse'] = function(test) {
    var expr = Many(Range("a", "z"));
    
    test.deepEqual(parse(expr, ""), []);
    test.deepEqual(parse(expr, "abc"), [["a", "b", "c"]]);
    test.deepEqual(parse(expr, "123"), []);
    
    test.done();
};
