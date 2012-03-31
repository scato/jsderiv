
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

exports['test derive on recursive Ref'] = function(test) {
    var cache;
    
    function EXPR() {
        return cache = cache || Ref(function() {
            return Or(Char("1"), Seq(Seq(EXPR(), Char("+")), EXPR()));
        }, 'EXPR');
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
        }, 'EXPR');
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
        }, 'EXPR');
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
        }, 'EXPR');
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

var a = Char("a");
var f = function(x) { return {f: x}; };
var g = function(x) { return {g: x}; };

exports['test "a* -> f"'] = function(test) {
    var expr = Red(Any(a), f);
    
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"])]]);
    
    test.done();
};

exports['test "a* -> f . a* -> g"'] = function(test) {
    var expr = Or(Red(Any(a), f), Red(Any(a), g));
    
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"])], [g(["a"])]]);
    
    test.done();
};

exports['test "(a* . ?= ~a) -> f . a* -> g"'] = function(test) {
    var r = Look(Not(a));
    var s = Red(Seq(Any(a), r), f);
    var t = Red(Any(a), g);
    
    var expr = Seq(s, t);
    
    // "a* -> g" will not match
    test.ok(!r.isNullable("a"));
    test.ok(!s.isNullable("a"));
    
    // "(a* . ?!a) -> f" will match
    test.deepEqual(s.derive("a").parseNull(), [[f(["a"])]]);
    
    // "a* -> g" resolves to g("")
    test.deepEqual(t.parseNull(), [[g([])]]);
    
    // "?!a" resolves to ""
    test.deepEqual(r.parseNull(), [[]]);
    
    // "(a* . ?!a) -> f" resolves to f("a")
    test.deepEqual(s.derive("a").parseNull(), [[f(["a"])]]);
    
    // "(a* . ?!a) -> f . a* -> g" resolves to f("a") x g("")
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"]), g([])]]);
    
    test.done();
};
