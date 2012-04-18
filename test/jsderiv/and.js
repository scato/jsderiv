var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    One  = require('../../src/jsderiv').One,
    Any  = require('../../src/jsderiv').Any,
    Or   = require('../../src/jsderiv').Or,
    Map  = require('../../src/jsderiv').Map,
    And  = require('../../src/jsderiv').And,
    Not  = require('../../src/jsderiv').Not;

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new And();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new And(Char('a'));
    }, ArgumentError);
    
    // constructor expects two expressions
    test.throws(function() {
        new And(Array(), Char('b'));
    }, ArgumentError);
    
    // constructor expects two expressions
    test.throws(function() {
        new And(Char('a'), Array());
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(And(Char('a'), Char('b')) instanceof And);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r & s equals r & s
    test.ok(And(Char('r'), Char('s')).equals(And(Char('r'), Char('s'))));
    
    // (r & s) & t equals r & (s & t)
    test.ok(And(And(Char('r'), Char('s')), Char('t')).equals(And(Char('r'), And(Char('s'), Char('t')))));
    
    // r & s equals s & r
    test.ok(And(Char('r'), Char('s')).equals(And(Char('s'), Char('r'))));
    
    // r & s does not equal s & t
    test.ok(!And(Char('r'), Char('s')).equals(And(Char('s'), Char('t'))));
    
    // r & r equals r
    test.ok(And(Char('r'), Char('r')).equals(Char('r')));
    
    // [] & r equals []
    test.ok(And(Void(), Char('r')).equals(Void()));
    
    // ~[] & r equals r
    test.ok(And(Not(Void()), Char('r')).equals(Char('r')));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r & s renders as And(Char("r"), Char("s"))
    test.equals('And(Char("r"), Char("s"))', And(Char('r'), Char('s')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r & s is not nullable
    test.ok(!And(Char('r'), Char('s')).isNullable());
    
    // r & (s | ()) is not nullable
    test.ok(!And(Char('r'), Or(Char('s'), Null())).isNullable());
    
    // (r | ()) & (s | ()) is nullable
    test.ok(And(Or(Char('r'), Null()), Or(Char('s'), Null())).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // .* & ~[] is not voidable
    test.ok(!And(Any(One()), Not(Void())).isVoidable());
    
    // r & ~[] is voidable
    test.ok(And(Char('r'), Not(Void())).isVoidable());
    
    // r & s is voidable
    test.ok(And(Char('r'), Char('s')).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        And(Char('r'), Char('s')).delta();
    }, ArgumentError);
    
    // the delta of r & s is always Void
    test.ok(And(Char('r'), Char('s')).delta('a').equals(Void()));
    
    // the delta of r & (s | ()) is always Void
    test.ok(And(Char('r'), Or(Char('s'), Null())).delta('a').equals(Void()));
    
    // the delta of (r | ()) & (s | ()) is always Null
    test.ok(And(Or(Char('r'), Null()), Or(Char('s'), Null())).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        And(Char('r'), Char('s')).derive();
    }, ArgumentError);
    
    // deriving r & . yields (Null -> 'r') & (Null -> 'r') for 'r'
    test.ok(And(Char('r'), One()).derive('r') instanceof And);
    test.ok(And(Char('r'), One()).derive('r').left instanceof Map);
    test.deepEqual(And(Char('r'), One()).derive('r').left.parseNull(), ['r']);
    test.ok(And(Char('r'), One()).derive('r').right instanceof Map);
    test.deepEqual(And(Char('r'), One()).derive('r').right.parseNull(), ['r']);
    
    // deriving r & . yields Void for 's'
    test.ok(And(Char('r'), One()).derive('s').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r & s yields an empty set
    test.deepEqual(And(Char('r'), Char('s')).parseNull(), []);
    
    // parsing Null with r & (s | ()) yields an empty set
    test.deepEqual(And(Char('r'), Or(Char('s'), Null())).parseNull(), []);
    
    // parsing Null with (r | ()) & (s | ()) yields an empty list
    test.deepEqual(And(Or(Char('r'), Null()), Or(Char('s'), Null())).parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        And(Char('r'), Char('s')).parse();
    });
    
    // parsing "r" with r & . yields "r"
    test.deepEqual(And(Char('r'), One()).parse("r"), ["r"]);
    
    // parsing "s" with r & . yields an empty set
    test.deepEqual(And(Char('r'), One()).parse("s"), []);
    
    // parsing "s" with . & ~s yields an empty set
    test.deepEqual(And(One(), Not(Char('s'))).parse("s"), []);
    
    // parsing "rrr" with r & . yields an empty set
    test.deepEqual(And(Char('r'), One()).parse("rrr"), []);
    
    test.done();
};

