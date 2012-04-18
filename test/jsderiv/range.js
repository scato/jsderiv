var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void  = require('../../src/jsderiv').Void,
    Null  = require('../../src/jsderiv').Null,
    Range = require('../../src/jsderiv').Range,
    Map   = require('../../src/jsderiv').Map;

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Range();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new Range('a');
    }, ArgumentError);
    
    // constructor expects two characters
    test.throws(function() {
        new Range('', 'c');
    }, ArgumentError);
    
    // constructor expects two characters
    test.throws(function() {
        new Range('a', '');
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Range('a', 'c') instanceof Range);
    
    test.done();
};

exports['test equals'] = function(test) {
    // 'a' - 'c' is equal to "another" 'a' - 'c'
    test.ok(Range('a', 'c').equals(Range('a', 'c')));
    
    // 'a' - 'c' is not equal to 'a' - 'z'
    test.ok(!Range('a', 'c').equals(Range('a', 'z')));
    
    // 'a' - 'c' is not equal to Void
    test.ok(!Range('a', 'c').equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // 'a' - 'c' renders as "Range("a", "c")"
    test.equals('Range("a", "c")', Range('a', 'c').toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // 'a' - 'c' is not nullable
    test.ok(!Range('a', 'c').isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // 'a' - 'c' is voidable
    test.ok(Range('a', 'c').isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Range('a', 'c').delta();
    }, ArgumentError);
    
    // the delta of 'a' - 'c' is always Void
    test.ok(Range('a', 'c').delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Range('a', 'c').derive();
    }, ArgumentError);
    
    // deriving 'a' - 'c' yields Null -> 'a' for 'a'
    test.ok(Range('a', 'c').derive('a') instanceof Map);
    test.deepEqual(Range('a', 'c').derive('a').parseNull(), ['a']);
    
    // deriving 'a' - 'c' yields Void for 'd'
    test.ok(Range('a', 'c').derive('d').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with 'a' - 'c' always yields an empty set
    test.deepEqual(Range('a', 'c').parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Range('a', 'c').parse();
    });
    
    // parsing "a" with 'a' - 'c' yields "a"
    test.deepEqual(Range('a', 'c').parse("a"), ["a"]);
    
    // parsing "abc" with 'a' - 'c' yields an empty set
    test.deepEqual(Range('a', 'c').parse("abc"), []);
    
    test.done();
};

