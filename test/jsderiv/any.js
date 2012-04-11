var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Seq  = require('../../src/jsderiv').Seq,
    Any  = require('../../src/jsderiv').Any,
    Red  = require('../../src/jsderiv').Red,
    One  = require('../../src/jsderiv').One;

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Any();
    }, ArgumentError);
    
    // constructor expects an expression
    test.throws(function() {
        new Any(Array());
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Any(Char('r')) instanceof Any);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r* is equal to "another" r*
    test.ok(Any(Char('r')).equals(Any(Char('r'))));
    
    // r* is not equal to s*
    test.ok(!Any(Char('r')).equals(Any(Char('s'))));
    
    // r* is not equal to Void
    test.ok(!Any(Char('r')).equals(Void()));
    
    // (r*)* equals r*
    test.ok(Any(Any(Char('r'))).equals(Any(Char('r'))));
    
    // ()* equals ()
    test.ok(Any(Null()).equals(Null()));
    
    // []* equals ()
    test.ok(Any(Void()).equals(Null()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r* renders as "Any(Char("r"))"
    test.equals('Any(Char("r"))', Any(Char('r')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r* is nullable
    test.ok(Any(Char('r')).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // r* is voidable
    test.ok(Any(Char('r')).isVoidable());
    
    // .* is not voidable
    test.ok(!Any(One()).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Any(Char('r')).delta();
    }, ArgumentError);
    
    // the delta of r* is always Null
    test.ok(Any(Char('r')).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Any(Char('r')).derive();
    }, ArgumentError);
    
    // deriving r* yields (Null -> 'r') . r* for 'r'
    test.ok(Any(Char('r')).derive('r') instanceof Seq);
    test.ok(Any(Char('r')).derive('r').left instanceof Red);
    test.deepEqual(Any(Char('r')).derive('r').left.parseNull(), ['r']);
    test.ok(Any(Char('r')).derive('r').right.equals(Any(Char('r'))));
    
    // deriving s* yields Void for 'r'
    test.ok(Any(Char('s')).derive('r').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r* yields an empty list
    test.deepEqual(Any(Char('r')).parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Any(Char('r')).parse();
    });
    
    // parsing "r" with r* yields "r"
    test.deepEqual(Any(Char('r')).parse("r"), ["r"]);
    
    // parsing "rrr" with r* yields "rrr"
    test.deepEqual(Any(Char('r')).parse("rrr"), ["rrr"]);
    
    // parsing "abc" with r* yields an empty set
    test.deepEqual(Any(Char('r')).parse("abc"), []);
    
    test.done();
};

