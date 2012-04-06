var Void = require('../../src/jsderiv').Void;

exports['test constructor'] = function(test) {
    // function can also be used as a constructor 
    test.ok(Void() instanceof Void);
    
    // Void is a singleton
    test.strictEqual(Void(), Void());
    test.strictEqual(Void(), new Void());
    
    test.done();
};

exports['test equals'] = function(test) {
    // Void is equal to "another" Void
    test.ok(Void().equals(Void()));
    
    // Void is not equal to an Array
    test.ok(!Void().equals(Array()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // Void renders as "Void()"
    test.equals('Void()', Void().toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // Void is not nullable
    test.ok(!Void().isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // Void is voidable
    test.ok(Void().isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an attribute
    test.throws(function() {
        Void().delta();
    });
    
    // the delta of Void is always Void
    test.ok(Void().delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an attribute
    test.throws(function() {
        Void().derive();
    });
    
    // deriving Void always yields Void
    test.ok(Void().derive('a').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with Void always yields an empty set
    test.deepEqual(Void().parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an attribute
    test.throws(function() {
        Void().parse();
    });
    
    // parsing anything with Void always yields an empty set
    test.deepEqual(Void().parse("abc"), []);
    
    test.done();
};

