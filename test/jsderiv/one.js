var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    One  = require('../../src/jsderiv').One,
    Red  = require('../../src/jsderiv').Red;

exports['test constructor'] = function(test) {
    // function can also be used as a constructor 
    test.ok(One() instanceof One);
    
    // One is a singleton
    test.strictEqual(One(), One());
    test.strictEqual(One(), new One());
    
    test.done();
};

exports['test equals'] = function(test) {
    // One is equal to "another" One
    test.ok(One().equals(One()));
    
    // One is not equal to Void
    test.ok(!One().equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // One renders as "One()"
    test.equals('One()', One().toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // One is not nullable
    test.ok(!One().isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // One is voidable
    test.ok(One().isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        One().delta();
    }, ArgumentError);
    
    // the delta of One is always Void
    test.ok(One().delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        One().derive();
    }, ArgumentError);
    
    // deriving One() yields Null -> 'a' for 'a'
    test.ok(One().derive('a') instanceof Red);
    test.deepEqual(One().derive('a').parseNull(), ['a']);
    
    // deriving One() yields Null -> 'b' for 'b'
    test.ok(One().derive('b') instanceof Red);
    test.deepEqual(One().derive('b').parseNull(), ['b']);
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with One always yields an empty set
    test.deepEqual(One().parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        One().parse();
    });
    
    // parsing "a" with One yields "a"
    test.deepEqual(One().parse("a"), ["a"]);
    
    // parsing "b" with One yields "b"
    test.deepEqual(One().parse("b"), ["b"]);
    
    // parsing "abc" with One yields an empty set
    test.deepEqual(One().parse("abc"), []);
    
    test.done();
};

