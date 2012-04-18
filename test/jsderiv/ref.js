var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void  = require('../../src/jsderiv').Void,
    Null  = require('../../src/jsderiv').Null,
    Char  = require('../../src/jsderiv').Char,
    Cat   = require('../../src/jsderiv').Cat,
    Many  = require('../../src/jsderiv').Many,
    OneOf = require('../../src/jsderiv').OneOf,
    Ref   = require('../../src/jsderiv').Ref;

// ID: '\w'+;
var ID = function() {
    return Many(Cat('w'));
};

// SYMBOL: [+-*/];
var SYMBOL = function() {
    return OneOf(Char('+'), Char('-'), Char('*'), Char('/'));
};

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Ref();
    }, ArgumentError);
    
    // constructor expects a function
    test.throws(function() {
        new Ref(false);
    }, ArgumentError);
    
    // constructor expects a function that returns an expression
    test.throws(function() {
        var ref = new Ref(function() {
            return false;
        });
        
        ref.resolve();
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Ref(ID) instanceof Ref);
    
    test.done();
};

exports['test resolve'] = function(test) {
    var ref = new Ref(ID);
    var expr = ref.resolve();
    
    // ID resolves to the expression returned by the function
    test.ok(expr.equals(ID()));
    
    // resolving is lazy
    test.strictEqual(expr, ref.resolve());
    
    test.done();
};

exports['test equals'] = function(test) {
    var ref = Ref(ID);
    
    // ID is not equal to "another" ID
    test.ok(!ref.equals(Ref(ID)));
    
    // ID is equal to "the same" ID
    test.ok(ref.equals(ref));
    
    // @ID is not equal to Void
    test.ok(!Ref(ID).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // ID renders as "Ref([Function])"
    test.equals('Ref([Function])', Ref(ID).toString());
    
    test.done();
};

