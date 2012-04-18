var ArgumentError = require('../../src/jsderiv').ArgumentError,
    Node          = require('../../src/jsderiv').Node;

var Void  = require('../../src/jsderiv').Void,
    Null  = require('../../src/jsderiv').Null,
    Value = require('../../src/jsderiv').Value,
    Map   = require('../../src/jsderiv').Map;

var ID = Node.define('ID');

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Value();
    }, ArgumentError);
    
    // constructor expects a string
    test.throws(function() {
        new Value(false);
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Value("foo") instanceof Value);
    
    test.done();
};

exports['test equals'] = function(test) {
    // @"foo" is equal to "another" @"foo"
    test.ok(Value("foo").equals(Value("foo")));
    
    // @"foo" is not equal to @"bar"
    test.ok(!Value("foo").equals(Value("bar")));
    
    // @"foo" is not equal to Void
    test.ok(!Value("foo").equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // @"foo" renders as "Value("foo")"
    test.equals('Value("foo")', Value("foo").toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // @"foo" is not nullable
    test.ok(!Value("foo").isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // @"foo" is voidable
    test.ok(Value("foo").isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Value("foo").delta();
    }, ArgumentError);
    
    // the delta of @"foo" is always Void
    test.ok(Value("foo").delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Value("foo").derive();
    }, ArgumentError);
    
    // deriving @"foo" yields Null -> ("foo") for ID("foo")
    test.ok(Value("foo").derive(ID("foo")) instanceof Map);
    test.deepEqual(Value("foo").derive(ID("foo")).parseNull(), [["foo"]]);
    
    // deriving @"bar" yields Void for ID("foo")
    test.ok(Value("bar").derive(ID("foo")).equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with @"foo" always yields an empty set
    test.deepEqual(Value("foo").parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Value("foo").parse();
    });
    
    // parsing [ID("foo")] with @"foo" yields ["foo"]
    test.deepEqual(Value("foo").parse([ID("foo")]), [["foo"]]);
    
    // parsing [ID("bar")] with @"foo" yields an empty set
    test.deepEqual(Value("foo").parse([ID("bar")]), []);
    
    // parsing ["foo"] with @"foo" yields an empty set
    test.deepEqual(Value("foo").parse(["foo"]), []);
    
    // parsing "abc" with @"foo" yields an empty set
    test.deepEqual(Value("foo").parse("abc"), []);
    
    test.done();
};
