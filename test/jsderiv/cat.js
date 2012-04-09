var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Cat  = require('../../src/jsderiv').Cat,
    Red  = require('../../src/jsderiv').Red;

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Cat();
    });
    
    // function can also be used as a constructor 
    test.ok(Cat('w') instanceof Cat);
    
    test.done();
};

exports['test equals'] = function(test) {
    // Cat('w') is equal to "another" Cat('w')
    test.ok(Cat('w').equals(Cat('w')));
    
    // Cat('w') is not equal to Cat('d')
    test.ok(!Cat('w').equals(Cat('d')));
    
    // Cat('w') is not equal to Void
    test.ok(!Cat('w').equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // Cat('w') renders as "Cat("w")"
    test.equals('Cat("w")', Cat('w').toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // Cat('w') is not nullable
    test.ok(!Cat('w').isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // Cat('w') is voidable
    test.ok(Cat('w').isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an attribute
    test.throws(function() {
        Cat('w').delta();
    });
    
    // the delta of Cat('w') is always Void
    test.ok(Cat('w').delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an attribute
    test.throws(function() {
        Cat('w').derive();
    });
    
    // deriving Cat('w') yields Null -> 'a' for 'a'
    test.ok(Cat('w').derive('a') instanceof Red);
    test.deepEqual(Cat('w').derive('a').parseNull(), ['a']);
    
    // deriving Cat('d') yields Void for 'a'
    test.ok(Cat('d').derive('a').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with Cat('w') always yields an empty set
    test.deepEqual(Cat('w').parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an attribute
    test.throws(function() {
        Cat('w').parse();
    });
    
    // parsing "a" with Cat('w') yields "a"
    test.deepEqual(Cat('w').parse("a"), ["a"]);
    
    // parsing "abc" with Cat('w') yields an empty set
    test.deepEqual(Cat('w').parse("abc"), []);
    
    test.done();
};

