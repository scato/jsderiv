var common    = require('../lib/common'),
    lookahead = require('../lib/lookahead'),
    lexer     = require('../lib/lexer');

var Null    = common.Null,
    Empty   = common.Empty,
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

// {}
exports['test Null'] = function(test) {
    var output;
    
    output = derive(Null(), "1");
    testNull(output, test);
    
    test.done();
};

// {""}
exports['test Empty'] = function(test) {
    var output;
    
    output = derive(Empty(), "1");
    testNull(output, test);
    
    test.done();
};

// r s
exports['test Seq'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Char("b")), "a");
    testNotNullable(output, test);
    testNotNull(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "ab");
    testNullable(output, test);
    testNotNull(output, test);
    
    output = derive(Seq(Char("a"), Char("b")), "b");
    testNull(output, test);
    
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
    testNull(output, test);
    
    output = derive(Any(Char("a")), "ab");
    testNull(output, test);
    
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
    testNull(output, test);
    
    test.done();
};

// r & s
exports['test And'] = function(test) {
    var output;
    
    output = derive(And(Char("a"), Char("a")), "a");
    testNullable(output, test);
    
    output = derive(And(Char("a"), Char("b")), "a");
    testNull(output, test);
    
    test.done();
};

// ~a
exports['test Not'] = function(test) {
    var output;
    
    output = derive(Not(Char("a")), "a");
    testNotNullable(output, test);  // not nullable because "a" does not match ~a
    testNotNull(output, test);      // not equal to Null(), because "aa" does match ~a
    
    output = derive(Not(Char("a")), "aa");
    testNullable(output, test);
    
    output = derive(Not(Char("a")), "b");
    testNullable(output, test);
    
    test.done();
};

// a+
exports['test Many'] = function(test) {
    var output;
    
    output = derive(Many(Char("a")), "");
    testNotNullable(output, test);
    
    output = derive(Many(Char("a")), "a");
    testNullable(output, test);
    
    output = derive(Many(Char("a")), "aa");
    testNullable(output, test);
    
    output = derive(Many(Char("a")), "b");
    testNull(output, test);
    
    output = derive(Many(Char("a")), "ab");
    testNull(output, test);
    
    test.done();
};

// a?
exports['test Opt'] = function(test) {
    var output;
    
    output = derive(Opt(Char("a")), "");
    testNullable(output, test);
    
    output = derive(Opt(Char("a")), "a");
    testNullable(output, test);
    
    output = derive(Opt(Char("a")), "b");
    testNull(output, test);
    
    test.done();
};

// a (?= b)
exports['test Look'] = function(test) {
    var output;
    
    output = derive(Seq(Char("a"), Look(Char("b"))), "ab");
    testNull(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ac");
    testNull(output, test);
    
    output = derive(Seq(Seq(Char("a"), Look(Char("b"))), Or(Char("b"), Char("c"))), "ab");
    testNullable(output, test);
    
    test.done();
};

