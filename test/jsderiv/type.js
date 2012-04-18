var ArgumentError = require('../../src/jsderiv').ArgumentError,
    Node          = require('../../src/jsderiv').Node;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Type = require('../../src/jsderiv').Type,
    Map  = require('../../src/jsderiv').Map;

var ID = Node.define('ID');
var SYMBOL = Node.define('SYMBOL');

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Type();
    }, ArgumentError);
    
    // constructor expects a constructor that inherits from Node
    test.throws(function() {
        new Type(Array());
    }, ArgumentError);
    
    // constructor expects a constructor that inherits from Node
    test.throws(function() {
        new Type(function() {});
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Type(ID) instanceof Type);
    
    test.done();
};

exports['test equals'] = function(test) {
    // @ID is equal to "another" @ID
    test.ok(Type(ID).equals(Type(ID)));
    
    // @ID is not equal to @SYMBOL
    test.ok(!Type(ID).equals(Type(SYMBOL)));
    
    // @ID is not equal to Void
    test.ok(!Type(ID).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // @ID renders as "Type([Function])"
    test.equals('Type([Function])', Type(ID).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // @ID is not nullable
    test.ok(!Type(ID).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // @ID is voidable
    test.ok(Type(ID).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Type(ID).delta();
    }, ArgumentError);
    
    // the delta of @ID is always Void
    test.ok(Type(ID).delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Type(ID).derive();
    }, ArgumentError);
    
    // deriving @ID yields Null -> ("foo") for ID("foo")
    test.ok(Type(ID).derive(ID("foo")) instanceof Map);
    test.deepEqual(Type(ID).derive(ID("foo")).parseNull(), [["foo"]]);
    
    // deriving @SYMBOL yields Void for ID("foo")
    test.ok(Type(SYMBOL).derive(ID("foo")).equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with @ID always yields an empty set
    test.deepEqual(Type(ID).parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Type(ID).parse();
    });
    
    // parsing [ID("foo")] with @ID yields ["foo"]
    test.deepEqual(Type(ID).parse([ID("foo")]), [["foo"]]);
    
    // parsing "abc" with Type(ID) yields an empty set
    test.deepEqual(Type(ID).parse("abc"), []);
    
    test.done();
};
