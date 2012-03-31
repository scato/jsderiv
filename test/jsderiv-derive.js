var Void       = require('../src/jsderiv').Void,
    Null       = require('../src/jsderiv').Null,
    Seq        = require('../src/jsderiv').Seq,
    Any        = require('../src/jsderiv').Any,
    Or         = require('../src/jsderiv').Or,
    And        = require('../src/jsderiv').And,
    Not        = require('../src/jsderiv').Not,
    Red        = require('../src/jsderiv').Red,
    Many       = require('../src/jsderiv').Many,
    Maybe      = require('../src/jsderiv').Maybe,
    Look       = require('../src/jsderiv').Look;
    Char       = require('../src/jsderiv').Char,
    One        = require('../src/jsderiv').One,
    Literal    = require('../src/jsderiv').Literal,
    InstanceOf = require('../src/jsderiv').InstanceOf,
    Range      = require('../src/jsderiv').Range,
    Category   = require('../src/jsderiv').Category,
    Node       = require('../src/jsderiv').Node,
    Ref        = require('../src/jsderiv').Ref,
    Cons       = require('../src/jsderiv').Cons;

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

// []
exports['test Void'] = function(test) {
    var output;
    
    output = derive(Void(), "1");
    testVoid(output, test);
    
    test.done();
};

// ()
exports['test Null'] = function(test) {
    var output;
    
    output = derive(Null(), "1");
    testVoid(output, test);
    
    test.done();
};

// r s
exports['test Seq'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Char("b")), "a");
    testNotNullable(output, test);
    testNotVoid(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "ab");
    testNullable(output, test);
    testNotVoid(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "b");
    testVoid(output, test);
    
    test.done();
};

// r*
exports['test Any'] = function(test) {
    var output;
    
    output = derive(Any(Char("a")), "");
    testNullable(output, test);
    
    output = derive(Any(Char("a")), "a");
    testNullable(output, test);
    
    output = derive(Any(Char("a")), "aa");
    testNullable(output, test);
    
    output = derive(Any(Char("a")), "b");
    testVoid(output, test);
    
    output = derive(Any(Char("a")), "ab");
    testVoid(output, test);
    
    test.done();
};

// r | s
exports['test Or'] = function(test) {
    var output;
    
    output = derive(Or(Char("a"), Char("b")), "a");
    testNullable(output, test);
    
    output = derive(Or(Char("a"), Char("b")), "b");
    testNullable(output, test);
    
    output = derive(Or(Char("a"), Char("b")), "c");
    testVoid(output, test);
    
    test.done();
};

// r & s
exports['test And'] = function(test) {
    var output;
    
    output = derive(And(Char("a"), Char("a")), "a");
    testNullable(output, test);
    
    output = derive(And(Char("a"), Char("b")), "a");
    testVoid(output, test);
    
    test.done();
};

// ~r
exports['test Not'] = function(test) {
    var output;
    
    output = Not(Void());
    testNullable(output, test);
    
    output = derive(Not(Char("a")), "a");
    testNotNullable(output, test);  // not nullable because "a" does not match ~a
    testNotVoid(output, test);      // not equal to Void(), because "aa" does match ~a
    
    output = derive(Not(Char("a")), "aa");
    testNullable(output, test);
    
    output = derive(Not(Char("a")), "b");
    testNullable(output, test);
    
    test.done();
};

// r+
exports['test Many'] = function(test) {
    var output;
    
    output = derive(Many(Char("a")), "");
    testNotNullable(output, test);
    
    output = derive(Many(Char("a")), "a");
    testNullable(output, test);
    
    output = derive(Many(Char("a")), "aa");
    testNullable(output, test);
    
    output = derive(Many(Char("a")), "b");
    testVoid(output, test);
    
    output = derive(Many(Char("a")), "ab");
    testVoid(output, test);
    
    test.done();
};

// r?
exports['test Maybe'] = function(test) {
    var output;
    
    output = derive(Maybe(Char("a")), "");
    testNullable(output, test);
    
    output = derive(Maybe(Char("a")), "a");
    testNullable(output, test);
    
    output = derive(Maybe(Char("a")), "b");
    testVoid(output, test);
    
    test.done();
};

// r ?= s
exports['test Look'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Look(Char("b"))), "a");
    testNotNullable(output, test);
    
    output = derive(Seq(Char("a"), Look(Char("b"))), "ab");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ac");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ab");
    testNullable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Char("b"))), Char("b")), Char("b")), "ab");
    testNotNullable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Char("b"))), Char("b")), Char("b")), "abb");
    testNullable(output, test);
    
    test.done();
};

// r ?= ~s
exports['test Look/Not'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Look(Not(Char("b")))), "a");
    testNullable(output, test);
    
    output = derive(Seq(Char("a"), Look(Not(Char("b")))), "ac");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Not(Char("b")))), Or(Char("b"), Char("c"))), "ab");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Not(Char("b")))), Or(Char("b"), Char("c"))), "ac");
    testNullable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Not(Char("b")))), Char("c")), Char("c")), "ac");
    testNotNullable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Not(Char("b")))), Char("c")), Char("c")), "acc");
    testNullable(output, test);
    
    test.done();
};

// 'a'
exports['test Char'] = function(test) {
    var output;
    
    output = derive(Char("1"), "1");
    testNullable(output, test);
    
    output = derive(Char("1"), "+");
    testNotNullable(output, test);
    
    test.done();
};

// .
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
        }, 'CHAR');
    
    output = derive(CHAR, "^");
    testNotNullable(output, test);
    
    test.done();
};

// "abc"
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

// @ID
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

// 'a' - 'c'
exports['test Range'] = function(test) {
    var output;
    
    output = derive(Range("a", "f"), "c");
    testNullable(output, test);
    
    output = derive(Range("a", "f"), "i");
    testVoid(output, test);
    
    test.done();
};

// '\w'
exports['test Category'] = function(test) {
    var output;
    
    output = derive(Category("\w"), "a");
    testNullable(output, test);
    
    output = derive(Category("\w"), " ");
    testVoid(output, test);
    
    test.done();
};

// r
exports['test Ref'] = function(test) {
    var ref = Ref(function() {
        return Char("1");
    }, 'TEST');
    
    var output;
    
    output = derive(ref, "1");
    testNullable(output, test);
    
    output = derive(ref, "+");
    testNotNullable(output, test);
    
    test.done();
};
