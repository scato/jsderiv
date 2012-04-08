var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Char = require('../../src/jsderiv').Char,
    Seq  = require('../../src/jsderiv').Seq,
    Red  = require('../../src/jsderiv').Red,
    Not  = require('../../src/jsderiv').Not,
    One  = require('../../src/jsderiv').One;

function lower(string) {
    return [string.toLowerCase()];
}

function upper(string) {
    return [string.toUpperCase()];
}

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Red();
    });
    
    // constructor expects two arguments
    test.throws(function() {
        new Red(Char('r'));
    });
    
    // function can also be used as a constructor 
    test.ok(Red(Char('r'), upper) instanceof Red);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r -> upper is equal to "another" r -> upper
    test.ok(Red(Char('r'), upper).equals(Red(Char('r'), upper)));
    
    // r -> upper is not equal to s -> upper
    test.ok(!Red(Char('r'), upper).equals(Red(Char('s'), upper)));
    
    // r -> upper is not equal to r -> lower
    test.ok(!Red(Char('r'), upper).equals(Red(Char('r'), lower)));
    
    // r -> upper is not equal to Void
    test.ok(!Red(Char('r'), upper).equals(Void()));
    
    // [] -> upper equals []
    test.ok(Red(Void(), upper).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r -> upper renders as "Red(Char("r"))"
    test.equals('Red(Char("r"), [Function])', Red(Char('r'), upper).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r -> upper is not nullable
    test.ok(!Red(Char('r'), upper).isNullable());
    
    // () -> upper is nullable
    test.ok(Red(Null(), upper).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // r -> upper is voidable
    test.ok(Red(Char('r'), upper).isVoidable());
    
    // ~[] -> upper is not voidable
    test.ok(!Red(Not(Void()), upper).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an attribute
    test.throws(function() {
        Red(Char('r'), upper).delta();
    });
    
    // the delta of r -> upper is always Void
    test.ok(Red(Char('r'), upper).delta('a').equals(Void()));
    
    // the delta of () -> upper is always Null
    test.ok(Red(Null(), upper).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an attribute
    test.throws(function() {
        Red(Char('r'), upper).derive();
    });
    
    // deriving r -> upper yields ~(Null -> 'r' -> upper) for 'r'
    test.ok(Red(Char('r'), upper).derive('r') instanceof Red);
    test.ok(Red(Char('r'), upper).derive('r').expr instanceof Red);
    test.deepEqual(Red(Char('r'), upper).derive('r').expr.parseNull(), ['r']);
    test.ok(Red(Char('r'), upper).derive('r').lambda === upper);
    
    // deriving s -> upper yields Void for 'r'
    test.ok(Red(Char('s'), upper).derive('r').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r -> upper yields an empty set
    test.deepEqual(Red(Char('r'), upper).parseNull(), []);
    
    // parsing Null with () -> 'r' -> upper yields "R"
    test.deepEqual(Red(Red(Null(), function() {
        return ['r'];
    }), upper).parseNull(), ["R"]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an attribute
    test.throws(function() {
        Red(Char('r'), upper).parse();
    });
    
    // parsing "r" with r -> upper yields "R"
    test.deepEqual(Red(Char('r'), upper).parse("r"), ["R"]);
    
    // parsing "rrr" with r -> upper yields an empty set
    test.deepEqual(Red(Char('r'), upper).parse("rrr"), []);
    
    // parsing "abc" with r -> upper yields an empty set
    test.deepEqual(Red(Char('r'), upper).parse("abc"), []);
    
    test.done();
};

