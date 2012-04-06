var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Red  = require('../../src/jsderiv').Red,
    Or   = require('../../src/jsderiv').Or,
    Not  = require('../../src/jsderiv').Not;

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Or();
    });
    
    // constructor expects two arguments
    test.throws(function() {
        new Or(Char('a'));
    });
    
    // function can also be used as a constructor 
    test.ok(Or(Char('a'), Char('b')) instanceof Or);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r | s equals r | s
    test.ok(Or(Char('r'), Char('s')).equals(Or(Char('r'), Char('s'))));
    
    // (r | s) | t equals r | (s | t)
    test.ok(Or(Or(Char('r'), Char('s')), Char('t')).equals(Or(Char('r'), Or(Char('s'), Char('t')))));
    
    // r | s equals s | r
    test.ok(Or(Char('r'), Char('s')).equals(Or(Char('s'), Char('r'))));
    
    // r | s does not equal s | t
    test.ok(!Or(Char('r'), Char('s')).equals(Or(Char('s'), Char('t'))));
    
    // r | r equals r
    test.ok(Or(Char('r'), Char('r')).equals(Char('r')));
    
    // ~[] | r equals ~[]
    test.ok(Or(Not(Void()), Char('r')).equals(Not(Void())));
    
    // [] | r equals r
    test.ok(Or(Void(), Char('r')).equals(Char('r')));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r | s renders as Or(Char("r"), Char("s"))
    test.equals('Or(Char("r"), Char("s"))', Or(Char('r'), Char('s')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r | s is not nullable
    test.ok(!Or(Char('r'), Char('s')).isNullable());
    
    // r | () is nullable
    test.ok(Or(Char('r'), Null()).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // r | ~[] is not voidable
    test.ok(!Or(Char('r'), Not(Void())).isVoidable());
    
    // r | s is voidable
    test.ok(Or(Char('r'), Char('s')).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an attribute
    test.throws(function() {
        Or(Char('r'), Char('s')).delta();
    });
    
    // the delta of r | s is always Void
    test.ok(Or(Char('r'), Char('s')).delta('a').equals(Void()));
    
    // the delta of r | (s | ()) is always Null
    test.ok(Or(Char('r'), Or(Char('s'), Null())).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an attribute
    test.throws(function() {
        Or(Char('r'), Char('s')).derive();
    });
    
    // deriving r | s yields Null -> 'r' for 'r'
    test.ok(Or(Char('r'), Char('s')).derive('r') instanceof Red);
    test.deepEqual(Or(Char('r'), Char('s')).derive('r').parseNull(), ['r']);
    
    // deriving r | s yields Null -> 's' for 's'
    test.ok(Or(Char('r'), Char('s')).derive('s') instanceof Red);
    test.deepEqual(Or(Char('r'), Char('s')).derive('s').parseNull(), ['s']);
    
    // deriving r | s yields Void for 't'
    test.ok(Or(Char('r'), Char('s')).derive('t').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r | s yields an empty set
    test.deepEqual(Or(Char('r'), Char('s')).parseNull(), []);
    
    // parsing Null with r | () yields an empty list
    test.deepEqual(Or(Char('r'), Null()).parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an attribute
    test.throws(function() {
        Or(Char('r'), Char('s')).parse();
    });
    
    // parsing "r" with r | s yields "r"
    test.deepEqual(Or(Char('r'), Char('s')).parse("r"), ["r"]);
    
    // parsing "s" with r | s yields "s"
    test.deepEqual(Or(Char('r'), Char('s')).parse("s"), ["s"]);
    
    // parsing "rst" with r | s yields an empty set
    test.deepEqual(Or(Char('r'), Char('s')).parse("rst"), []);
    
    test.done();
};

