var common = require('../lib/common'),
    generic = require('../lib/generic');

var Void       = common.Void,
    Null       = common.Null,
    Or         = common.Or,
    Seq        = common.Seq,
    Many       = common.Many,
    Char       = generic.Char,
    One        = generic.One,
    Literal    = generic.Literal,
    InstanceOf = generic.InstanceOf,
    Range      = generic.Range,
    Node       = generic.Node,
    Ref        = generic.Ref,
    Cons       = generic.Cons,
    parse      = generic.parse;

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
    
    var CHAR = common.And(One(), common.Not(common.Or(common.Or(Literal("^"), Literal("-")), Literal("\\"))));
    
    output = derive(CHAR, "^");
    testNotNullable(output, test);
    
    CHAR = Ref(function() {
            return common.Or(common.Or(common.Or(
                common.And(One(), common.Not(common.Or(common.Or(Literal("^"), Literal("-")), Literal("\\")))),
                Literal("\\^")),
                Literal("\\-")),
                Literal("\\\\")
            );
        });
    
    output = derive(CHAR, "^");
    testNotNullable(output, test);
    
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
    
    var ID = Cons("ID");
    
    output = Literal("id").derive(ID("id"));
    testNullable(output, test);
    
    test.deepEqual(output.parseNull(), [['i', 'd']]);
    
    output = Literal("literal").derive(ID("id"));
    testVoid(output, test);
    
    test.done();
};

exports['test InstanceOf'] = function(test) {
    var output;
    
    var ID = Cons("ID");
    var LITERAL = Cons("LITERAL");
    
    output = InstanceOf(ID).derive(ID("id"));
    testNullable(output, test);
    
    test.deepEqual(output.parseNull(), [['id']]);
    
    output = InstanceOf(ID).derive(LITERAL("\"literal\""));
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
    var valueArray = ['i', 'd'];
    var value2 = "foo";
    var metadata = {};
    var metadata2 = {"foo": "bar"};
    
    var node = new Node(id, value, metadata);
    var node2 = new Node(id, value, metadata);
    var node3 = new Node(id, value2, metadata);
    var node4 = new Node(id, value, metadata2);
    
    test.deepEqual(node.value, valueArray);
    test.deepEqual(node.metadata, metadata);
    test.ok(node.equals(node2));
    test.ok(!node.equals(node3));
    test.ok(node.equals(node4));
    test.done();
};

exports['test Node with Array<Char>'] = function(test) {
    var id = 'ID';
    var value = ['i', 'd'];
    var value2 = "id";
    var value3 = "foo";
    var metadata = {};
    
    var node = new Node(id, value, metadata);
    var node2 = new Node(id, value2, metadata);
    var node3 = new Node(id, value3, metadata);
    
    test.ok(node.equals(node2));
    test.ok(!node.equals(node3));
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
    
    var ref2 = Ref(function() {
        return Char("2");
    });
    
    var ref3 = Ref(function() {
        return Char("1");
    });
    
    test.ok(!ref.equals(ref2));
    test.ok(!ref.equals(ref3));
    
    test.done();
};

exports['test derive on recursive Ref'] = function(test) {
    var cache;
    
    function EXPR() {
        return cache = cache || Ref(function() {
            return Or(Char("1"), Seq(Seq(EXPR(), Char("+")), EXPR()));
        });
    }
    
    var ref = EXPR();
    
    var output;
    
    output = derive(ref, "1+1");
    testNullable(output, test);
    
    output = derive(ref, "1+");
    testNotNullable(output, test);
    
    test.done();
};

exports['test delta on recursive Ref'] = function(test) {
    var cache;
    
    function EXPR() {
        return cache = cache || Ref(function() {//require('sys').puts(cache.expr);
            return Or(Char("1"), Seq(Seq(EXPR(), Char("+")), EXPR()));
        });
    }
    
    var ref = EXPR();
    
    var output;
    
    test.ok(ref.delta().equals(Void()));
    test.ok(ref.derive("1").delta().equals(Null()));
    
    test.done();
};

exports['test isNullable on recursive Ref'] = function(test) {
    var cache;
    
    function EXPR() {
        return cache = cache || Ref(function() {
            return Or(Char("1"), Seq(Seq(EXPR(), Char("+")), EXPR()));
        });
    }
    
    var ref = EXPR();
    
    test.ok(!ref.isNullable());
    test.ok(ref.derive("1").isNullable());
    
    test.done();
};

exports['test parseNull on recursive Ref'] = function(test) {
    var cache;
    
    function EXPR() {
        return cache = cache || Ref(function() {
            return Or(Char("1"), Seq(Seq(EXPR(), Char("+")), EXPR()));
        });
    }
    
    var ref = EXPR();
    
    test.deepEqual(derive(ref, "1+1").parseNull(), [["1", "+", "1"]]);
    test.deepEqual(derive(ref, "1+").parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    var expr = Many(Range("a", "z"));
    
    test.deepEqual(parse(expr, ""), []);
    test.deepEqual(parse(expr, "abc"), [["a", "b", "c"]]);
    test.deepEqual(parse(expr, "123"), []);
    
    expr = common.Not(Char("1"));
    
    test.deepEqual(parse(expr, "1"), []);
    
    test.done();
};
