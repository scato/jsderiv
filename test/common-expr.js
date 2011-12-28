var common    = require('../lib/common'),
    lookahead = require('../lib/lookahead'),
    lexer     = require('../lib/lexer');

var Void    = common.Void,
    Null   = common.Null,
    Char    = lexer.Char,
    Seq     = common.Seq,
    Any     = common.Any,
    Or      = common.Or,
    And     = common.And,
    Not     = common.Not,
    Red     = common.Red,
    Many    = common.Many,
    Opt     = common.Opt,
    Look    = lookahead.Look;

function derive(expr, input) {
    var output = expr;
    
    for(var i = 0; i < input.length; i++) {
        output = output.derive(input[i]);
    }
    
    return output;
}

function testVoidable(output, test) {
    test.ok(output.isNullable(), 'test if ' + output.toString() + ' is nullable');
}

function testNotVoidable(output, test) {
    test.ok(!output.isNullable(), 'test if ' + output.toString() + ' is not nullable');
}

function testVoid(output, test) {
    test.ok(output.isVoid(), 'test if ' + output.toString() + ' is equal to Void()');
}

function testNotVoid(output, test) {
    test.ok(!output.isVoid(), 'test if ' + output.toString() + ' is not equal to Void()');
}

// {}
exports['test Void'] = function(test) {
    var output;
    
    output = derive(Void(), "1");
    testVoid(output, test);
    
    test.done();
};

// {""}
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
    testNotVoidable(output, test);
    testNotVoid(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "ab");
    testVoidable(output, test);
    testNotVoid(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "b");
    testVoid(output, test);
    
    test.done();
};

// r*
exports['test Any'] = function(test) {
    var output;
    
    output = derive(Any(Char("a")), "");
    testVoidable(output, test);
    
    output = derive(Any(Char("a")), "a");
    testVoidable(output, test);
    
    output = derive(Any(Char("a")), "aa");
    testVoidable(output, test);
    
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
    testVoidable(output, test);
    
    output = derive(Or(Char("a"), Char("b")), "b");
    testVoidable(output, test);
    
    output = derive(Or(Char("a"), Char("b")), "c");
    testVoid(output, test);
    
    test.done();
};

// r & s
exports['test And'] = function(test) {
    var output;
    
    output = derive(And(Char("a"), Char("a")), "a");
    testVoidable(output, test);
    
    output = derive(And(Char("a"), Char("b")), "a");
    testVoid(output, test);
    
    test.done();
};

// ~a
exports['test Not'] = function(test) {
    var output;
    
    output = Not(Void());
    testVoidable(output, test);
    
    output = derive(Not(Char("a")), "a");
    testNotVoidable(output, test);  // not nullable because "a" does not match ~a
    testNotVoid(output, test);      // not equal to Void(), because "aa" does match ~a
    
    output = derive(Not(Char("a")), "aa");
    testVoidable(output, test);
    
    output = derive(Not(Char("a")), "b");
    testVoidable(output, test);
    
    test.done();
};

// a+
exports['test Many'] = function(test) {
    var output;
    
    output = derive(Many(Char("a")), "");
    testNotVoidable(output, test);
    
    output = derive(Many(Char("a")), "a");
    testVoidable(output, test);
    
    output = derive(Many(Char("a")), "aa");
    testVoidable(output, test);
    
    output = derive(Many(Char("a")), "b");
    testVoid(output, test);
    
    output = derive(Many(Char("a")), "ab");
    testVoid(output, test);
    
    test.done();
};

// a?
exports['test Opt'] = function(test) {
    var output;
    
    output = derive(Opt(Char("a")), "");
    testVoidable(output, test);
    
    output = derive(Opt(Char("a")), "a");
    testVoidable(output, test);
    
    output = derive(Opt(Char("a")), "b");
    testVoid(output, test);
    
    test.done();
};

// a (?= b)
exports['test Look'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Look(Char("b"))), "a");
    testNotVoidable(output, test);
    
    output = derive(Seq(Char("a"), Look(Char("b"))), "ab");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ac");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ab");
    testVoidable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Char("b"))), Char("b")), Char("b")), "ab");
    testNotVoidable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Char("b"))), Char("b")), Char("b")), "abb");
    testVoidable(output, test);
    
    test.done();
};

// a (?! b)
exports['test Look/Not'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Look(Not(Char("b")))), "a");
    testVoidable(output, test);
    
    output = derive(Seq(Char("a"), Look(Not(Char("b")))), "ac");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Not(Char("b")))), Or(Char("b"), Char("c"))), "ab");
    testVoid(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Not(Char("b")))), Or(Char("b"), Char("c"))), "ac");
    testVoidable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Not(Char("b")))), Char("c")), Char("c")), "ac");
    testNotVoidable(output, test);
    
    output = derive(Seq(Seq(Seq(Char("a"), Look(Not(Char("b")))), Char("c")), Char("c")), "acc");
    testVoidable(output, test);
    
    test.done();
};

