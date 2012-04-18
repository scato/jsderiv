var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Map  = require('../../src/jsderiv').Map,
    Or   = require('../../src/jsderiv').Or,
    Seq  = require('../../src/jsderiv').Seq,
    Not  = require('../../src/jsderiv').Not;

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Seq();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new Seq(Char('a'));
    }, ArgumentError);
    
    // constructor expects two expressions
    test.throws(function() {
        new Seq(Array(), Char('b'));
    }, ArgumentError);
    
    // constructor expects two expressions
    test.throws(function() {
        new Seq(Char('a'), Array());
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Seq(Char('a'), Char('b')) instanceof Seq);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r . s equals r . s
    test.ok(Seq(Char('r'), Char('s')).equals(Seq(Char('r'), Char('s'))));
    
    // (r . s) . t equals r . (s . t)
    test.ok(Seq(Seq(Char('r'), Char('s')), Char('t')).equals(Seq(Char('r'), Seq(Char('s'), Char('t')))));
    
    // r . s does not equal s . r
    test.ok(!Seq(Char('r'), Char('s')).equals(Seq(Char('s'), Char('r'))));
    
    // r . s does not equal s . t
    test.ok(!Seq(Char('r'), Char('s')).equals(Seq(Char('s'), Char('t'))));
    
    // r . r does not equal r
    test.ok(!Seq(Char('r'), Char('r')).equals(Char('r')));
    
    // [] . r equals []
    test.ok(Seq(Void(), Char('r')).equals(Void()));
    
    // r . [] equals []
    test.ok(Seq(Char('r'), Void()).equals(Void()));
    
    // () . r equals r
    test.ok(Seq(Null(), Char('r')).equals(Char('r')));
    
    // r . () equals r
    test.ok(Seq(Char('r'), Null()).equals(Char('r')));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r . s renders as Seq(Char("r"), Char("s"))
    test.equals('Seq(Char("r"), Char("s"))', Seq(Char('r'), Char('s')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r . s is not nullable
    test.ok(!Seq(Char('r'), Char('s')).isNullable());
    
    // r . (s | ()) is not nullable
    test.ok(!Seq(Char('r'), Or(Char('s'), Null())).isNullable());
    
    // (r | ()) . (s | ()) is nullable
    test.ok(Seq(Or(Char('r'), Null()), Or(Char('s'), Null())).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // ~[] . ~[] is not voidable
    test.ok(!Seq(Not(Void()), Not(Void())).isVoidable());
    
    // r . ~[] is voidable
    test.ok(Seq(Char('r'), Not(Void())).isVoidable());
    
    // r . s is voidable
    test.ok(Seq(Char('r'), Char('s')).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Seq(Char('r'), Char('s')).delta();
    }, ArgumentError);
    
    // the delta of r . s is always Void
    test.ok(Seq(Char('r'), Char('s')).delta('a').equals(Void()));
    
    // the delta of r . (s | ()) is always Void
    test.ok(Seq(Char('r'), Or(Char('s'), Null())).delta('a').equals(Void()));
    
    // the delta of (r | ()) . (s | ()) is always Null
    test.ok(Seq(Or(Char('r'), Null()), Or(Char('s'), Null())).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Seq(Char('r'), Char('s')).derive();
    }, ArgumentError);
    
    // deriving r . s yields Null -> 'r' . s for 'r'
    test.ok(Seq(Char('r'), Char('s')).derive('r') instanceof Seq);
    test.ok(Seq(Char('r'), Char('s')).derive('r').left instanceof Map);
    test.deepEqual(Seq(Char('r'), Char('s')).derive('r').left.parseNull(), ['r']);
    test.ok(Seq(Char('r'), Char('s')).derive('r').right.equals(Char('s')));
    
    // deriving r . s yields Void for 's'
    test.ok(Seq(Char('r'), Char('s')).derive('s').equals(Void()));
    
    // deriving r . s yields Void for 't'
    test.ok(Seq(Char('r'), Char('s')).derive('t').equals(Void()));
    
    // deriving (r | ()) . s yields Null -> 'r' . s for 'r'
    test.ok(Seq(Or(Char('r'), Null()), Char('s')).derive('r') instanceof Seq);
    test.ok(Seq(Or(Char('r'), Null()), Char('s')).derive('r').left instanceof Map);
    test.deepEqual(Seq(Or(Char('r'), Null()), Char('s')).derive('r').left.parseNull(), ['r']);
    test.ok(Seq(Or(Char('r'), Null()), Char('s')).derive('r').right.equals(Char('s')));
    
    // deriving (r | ()) . s yields Null -> 's' for 's'
    test.ok(Seq(Or(Char('r'), Null()), Char('s')).derive('s') instanceof Map);
    test.deepEqual(Seq(Or(Char('r'), Null()), Char('s')).derive('s').parseNull(), ['s']);
    
    // deriving (r | ()) . s yields Void for 't'
    test.ok(Seq(Or(Char('r'), Null()), Char('s')).derive('t').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r . s yields an empty set
    test.deepEqual(Seq(Char('r'), Char('s')).parseNull(), []);
    
    // parsing Null with r . (s | ()) yields an empty set
    test.deepEqual(Seq(Char('r'), Or(Char('s'), Null())).parseNull(), []);
    
    // parsing Null with (r | ()) . (s | ()) yields an empty list
    test.deepEqual(Seq(Or(Char('r'), Null()), Or(Char('s'), Null())).parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Seq(Char('r'), Char('s')).parse();
    }, ArgumentError);
    
    // parsing "r" with r . s yields an empty set
    test.deepEqual(Seq(Char('r'), Char('s')).parse("r"), []);
    
    // parsing "s" with r . s yields an empty set
    test.deepEqual(Seq(Char('r'), Char('s')).parse("s"), []);
    
    // parsing "rs" with r . s yields "rs"
    test.deepEqual(Seq(Char('r'), Char('s')).parse("rs"), ["rs"]);
    
    // parsing "sr" with r . s yields an empty set
    test.deepEqual(Seq(Char('r'), Char('s')).parse("sr"), []);
    
    // parsing "rst" with r . s yields an empty set
    test.deepEqual(Seq(Char('r'), Char('s')).parse("rst"), []);
    
    test.done();
};

