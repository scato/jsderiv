
var r = Ref("r"),
    s = Ref("s"),
    t = Ref("t");

exports['test "r & r = r"'] = function(test) {
    test.ok(And(r, r).equals(r));
    test.done();
};

exports['test "r & s = s & r"'] = function(test) {
    test.ok(And(r, s).equals(And(s, r)));
    test.done();
};

exports['test "(r & s) & t = r & (s & t)"'] = function(test) {
    test.ok(And(And(r, s), t).equals(And(r, And(s, t))));
    test.done();
};

exports['test "[] & r = []"'] = function(test) {
    test.ok(And(Void(), r).equals(Void()));
    test.done();
};

exports['test "~[] & r = r"'] = function(test) {
    test.ok(And(Not(Void()), r).equals(r));
    test.done();
};

exports['test "r | r = r"'] = function(test) {
    test.ok(Or(r, r).equals(r));
    test.done();
};

exports['test "r | s = s | r"'] = function(test) {
    test.ok(Or(r, s).equals(Or(s, r)));
    test.done();
};

exports['test "(r | s) | t = r | (s | t)"'] = function(test) {
    test.ok(Or(Or(r, s), t).equals(Or(r, Or(s, t))));
    test.done();
};

exports['test "~[] | r = ~[]"'] = function(test) {
    test.ok(Or(Not(Void()), r).equals(Not(Void())));
    test.done();
};

exports['test "[] | r = r"'] = function(test) {
    test.ok(Or(Void(), r).equals(r));
    test.done();
};

exports['test "(r . s) . t = r . (s . t)"'] = function(test) {
    test.ok(Seq(Seq(r, s), t).equals(Seq(r, Seq(s, t))));
    test.done();
};

exports['test "[] . r = []"'] = function(test) {
    test.ok(Seq(Void(), r).equals(Void()));
    test.done();
};

exports['test "r . [] = []"'] = function(test) {
    test.ok(Seq(r, Void()).equals(Void()));
    test.done();
};

exports['test "() . r = r"'] = function(test) {
    test.ok(Seq(Null(), r).equals(r));
    test.done();
};

exports['test "r . () = r"'] = function(test) {
    test.ok(Seq(r, Null()).equals(r));
    test.done();
};

exports['test "(r*)* = r*"'] = function(test) {
    test.ok(Any(Any(r)).equals(Any(r)));
    test.done();
};

exports['test "()* = ()"'] = function(test) {
    test.ok(Any(Null()).equals(Null()));
    test.done();
};

exports['test "[]* = ()"'] = function(test) {
    test.ok(Any(Void()).equals(Null()));
    test.done();
};

exports['test "~(~r) = r"'] = function(test) {
    test.ok(Not(Not(r)).equals(r));
    test.done();
};

exports['test "[] -> f = []"'] = function(test) {
    test.ok(Red(Void(), function(x) { return x; }).equals(Void()));
    test.done();
};

exports['test "?= () = ()"'] = function(test) {
    test.ok(Look(Null()).equals(Null()));
    test.done();
};

exports['test "?= [] = []"'] = function(test) {
    test.ok(Look(Void()).equals(Void()));
    test.done();
};

exports['test Ref'] = function(test) {
    var ref = Ref(function() {
        return Char("1");
    }, 'TEST');
    
    var ref2 = Ref(function() {
        return Char("2");
    }, 'TEST2');
    
    var ref3 = Ref(function() {
        return Char("1");
    }, 'TEST3');
    
    test.ok(!ref.equals(ref2));
    test.ok(!ref.equals(ref3));
    
    test.done();
};
