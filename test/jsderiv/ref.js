var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void  = require('../../src/jsderiv').Void,
    Null  = require('../../src/jsderiv').Null,
    Char  = require('../../src/jsderiv').Char,
    Cat   = require('../../src/jsderiv').Cat,
    Not   = require('../../src/jsderiv').Not,
    Seq   = require('../../src/jsderiv').Seq,
    Or    = require('../../src/jsderiv').Or,
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

var NOTHING = function() {
    return Void();
};

var ANYTHING = function() {
    return Not(Void());
};

var _cache, L = function() {
    return _cache = _cache || Or(Seq(Ref(L), Char('1')), Null());
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

exports['test isNullable'] = function(test) {
    // NOTHING is not nullable
    test.ok(!Ref(NOTHING).isNullable());
    
    // ANYTHING is nullable
    test.ok(Ref(ANYTHING).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // NOTHING is voidable
    test.ok(Ref(NOTHING).isVoidable());
    
    // ANYTHING is not voidable
    test.ok(!Ref(ANYTHING).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Ref(ID).delta();
    }, ArgumentError);
    
    // the delta of NOTHING is always Void
    test.ok(Ref(NOTHING).delta('a').equals(Void()));
    
    // the delta of ANYTHING is always Null
    test.ok(Ref(ANYTHING).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Ref(ID).derive();
    }, ArgumentError);
    
    // deriving ID yields Void for '-'
    test.ok(Ref(ID).derive('-').equals(Void()));
    
    // deriving ID yields another Ref (ID') for 'a'
    test.ok(Ref(ID).derive('a') instanceof Ref);
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with NOTHING yields an empty set
    test.deepEqual(Ref(NOTHING).parseNull(), []);
    
    // parsing Null with ANYTHING yields an empty list
    test.deepEqual(Ref(ANYTHING).parseNull(), [[]]);
    
    // parsing Null with ID' yields "a"
    test.deepEqual(Ref(ID).derive('a').parseNull(), ["a"]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parsing "foo" with ID yields "foo"
    test.deepEqual(Ref(ID).parse("foo"), ["foo"]);
    
    // parsing "-" with SYMBOL yields "-"
    test.deepEqual(Ref(SYMBOL).parse("-"), ["-"]);
    
    // parsing "foo" with SYMBOL yields an empty set
    test.deepEqual(Ref(SYMBOL).parse("foo"), []);
    
    // parsing "111" with L yields "111"
    test.deepEqual(Ref(L).parse("111"), ["111"]);
    
    test.done();
};

