var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Seq  = require('../../src/jsderiv').Seq,
    Not  = require('../../src/jsderiv').Not,
    Red  = require('../../src/jsderiv').Red,
    One  = require('../../src/jsderiv').One;

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Not();
    });
    
    // function can also be used as a constructor 
    test.ok(Not(Char('r')) instanceof Not);
    
    test.done();
};

exports['test equals'] = function(test) {
    // ~r is equal to "another" ~r
    test.ok(Not(Char('r')).equals(Not(Char('r'))));
    
    // ~r is not equal to ~s
    test.ok(!Not(Char('r')).equals(Not(Char('s'))));
    
    // ~r is not equal to Void
    test.ok(!Not(Char('r')).equals(Void()));
    
    // ~(~r) equals r
    test.ok(Not(Not(Char('r'))).equals(Char('r')));
    
    test.done();
};

exports['test toString'] = function(test) {
    // ~r renders as "Not(Char("r"))"
    test.equals('Not(Char("r"))', Not(Char('r')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // ~r is nullable
    test.ok(Not(Char('r')).isNullable());
    
    // ~() is not nullable
    test.ok(!Not(Null()).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // ~r is voidable
    test.ok(Not(Char('r')).isVoidable());
    
    // ~[] is not voidable
    test.ok(!Not(Void()).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an attribute
    test.throws(function() {
        Not(Char('r')).delta();
    });
    
    // the delta of ~r is always Null
    test.ok(Not(Char('r')).delta('a').equals(Null()));
    
    // the delta of ~() is always Void
    test.ok(Not(Null()).delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an attribute
    test.throws(function() {
        Not(Char('r')).derive();
    });
    
    // deriving ~r yields ~(Null -> 'r') for 'r'
    test.ok(Not(Char('r')).derive('r') instanceof Not);
    test.ok(Not(Char('r')).derive('r').expr instanceof Red);
    test.deepEqual(Not(Char('r')).derive('r').expr.parseNull(), ['r']);
    
    // deriving ~s yields ~Void for 'r'
    test.ok(Not(Char('s')).derive('r').equals(Not(Void())));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with ~r yields an empty list
    test.deepEqual(Not(Char('r')).parseNull(), [[]]);
    
    // parsing Null with ~() yields an empty set
    test.deepEqual(Not(Null()).parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an attribute
    test.throws(function() {
        Not(Char('r')).parse();
    });
    
    // parsing "r" with ~r yields an empty set
    test.deepEqual(Not(Char('r')).parse("r"), []);
    
    // parsing "rrr" with ~r yields "rrr"
    test.deepEqual(Not(Char('r')).parse("rrr"), [[]]);
    
    // parsing "" with ~r yields an empty list
    test.deepEqual(Not(Char('r')).parse(""), [[]]);
    
    // parsing "abc" with ~r yields "abc"
    test.deepEqual(Not(Char('r')).parse("abc"), [[]]);
    
    test.done();
};

