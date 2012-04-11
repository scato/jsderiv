var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Red  = require('../../src/jsderiv').Red;

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Char();
    }, ArgumentError);
    
    // constructor expects a character
    test.throws(function() {
        new Char('');
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Char('a') instanceof Char);
    
    test.done();
};

exports['test equals'] = function(test) {
    // Char('a') is equal to "another" Char('a')
    test.ok(Char('a').equals(Char('a')));
    
    // Char('a') is not equal to Char('b')
    test.ok(!Char('a').equals(Char('b')));
    
    // Char('a') is not equal to Void
    test.ok(!Char('a').equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // Char('a') renders as "Char("a")"
    test.equals('Char("a")', Char('a').toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // Char('a') is not nullable
    test.ok(!Char('a').isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // Char('a') is voidable
    test.ok(Char('a').isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Char('a').delta();
    }, ArgumentError);
    
    // the delta of Char('a') is always Void
    test.ok(Char('a').delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Char('a').derive();
    }, ArgumentError);
    
    // deriving Char('a') yields Null -> 'a' for 'a'
    test.ok(Char('a').derive('a') instanceof Red);
    test.deepEqual(Char('a').derive('a').parseNull(), ['a']);
    
    // deriving Char('b') yields Void for 'a'
    test.ok(Char('b').derive('a').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with Char('a') always yields an empty set
    test.deepEqual(Char('a').parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Char('a').parse();
    });
    
    // parsing "a" with Char('a') yields "a"
    test.deepEqual(Char('a').parse("a"), ["a"]);
    
    // parsing "abc" with Char('a') yields an empty set
    test.deepEqual(Char('a').parse("abc"), []);
    
    test.done();
};

