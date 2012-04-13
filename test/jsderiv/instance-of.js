var ArgumentError = require('../../src/jsderiv').ArgumentError,
    Node          = require('../../src/jsderiv').Node;

var Void       = require('../../src/jsderiv').Void,
    Null       = require('../../src/jsderiv').Null,
    InstanceOf = require('../../src/jsderiv').InstanceOf,
    Red        = require('../../src/jsderiv').Red;

var ID = Node.define('ID');
var SYMBOL = Node.define('SYMBOL');

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new InstanceOf();
    }, ArgumentError);
    
    // constructor expects a constructor that inherits from Node
    test.throws(function() {
        new InstanceOf(Array());
    }, ArgumentError);
    
    // constructor expects a constructor that inherits from Node
    test.throws(function() {
        new InstanceOf(function() {});
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(InstanceOf(ID) instanceof InstanceOf);
    
    test.done();
};

exports['test equals'] = function(test) {
    // @ID is equal to "another" @ID
    test.ok(InstanceOf(ID).equals(InstanceOf(ID)));
    
    // @ID is not equal to @SYMBOL
    test.ok(!InstanceOf(ID).equals(InstanceOf(SYMBOL)));
    
    // @ID is not equal to Void
    test.ok(!InstanceOf(ID).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // @ID renders as "InstanceOf([Function])"
    test.equals('InstanceOf([Function])', InstanceOf(ID).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // @ID is not nullable
    test.ok(!InstanceOf(ID).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // @ID is voidable
    test.ok(InstanceOf(ID).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        InstanceOf(ID).delta();
    }, ArgumentError);
    
    // the delta of @ID is always Void
    test.ok(InstanceOf(ID).delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        InstanceOf(ID).derive();
    }, ArgumentError);
    
    // deriving @ID yields Null -> ("foo") for ID("foo")
    test.ok(InstanceOf(ID).derive(ID("foo")) instanceof Red);
    test.deepEqual(InstanceOf(ID).derive(ID("foo")).parseNull(), [["foo"]]);
    
    // deriving @SYMBOL yields Void for ID("foo")
    test.ok(InstanceOf(SYMBOL).derive(ID("foo")).equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with @ID always yields an empty set
    test.deepEqual(InstanceOf(ID).parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        InstanceOf(ID).parse();
    });
    
    // parsing [ID("foo")] with @ID yields ["foo"]
    test.deepEqual(InstanceOf(ID).parse([ID("foo")]), [["foo"]]);
    
    // parsing "abc" with InstanceOf(ID) yields an empty set
    test.deepEqual(InstanceOf(ID).parse("abc"), []);
    
    test.done();
};
