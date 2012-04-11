var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null;

exports['test constructor'] = function(test) {
    // function can also be used as a constructor 
    test.ok(Null() instanceof Null);
    
    // Null is a singleton
    test.strictEqual(Null(), Null());
    test.strictEqual(Null(), new Null());
    
    test.done();
};

exports['test equals'] = function(test) {
    // Null is equal to "another" Null
    test.ok(Null().equals(Null()));
    
    // Null is not equal to Void
    test.ok(!Null().equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // Null renders as "Null()"
    test.equals('Null()', Null().toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // Null is nullable
    test.ok(Null().isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // Null is voidable
    test.ok(Null().isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Null().delta();
    }, ArgumentError);
    
    // the delta of Null is always Null
    test.ok(Null().delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Null().derive();
    }, ArgumentError);
    
    // deriving Null always yields Void
    test.ok(Null().derive('a').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with Null always yields an empty list
    test.deepEqual(Null().parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Null().parse();
    });
    
    // parsing Null with Null yields an empty list
    test.deepEqual(Null().parse(""), [[]]);
    
    // parsing anything else with Null always yields an empty set
    test.deepEqual(Null().parse("abc"), []);
    
    test.done();
};

