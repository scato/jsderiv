var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void    = require('../../src/jsderiv').Void,
    Null    = require('../../src/jsderiv').Null,
    Char    = require('../../src/jsderiv').Char,
    Seq     = require('../../src/jsderiv').Seq,
    Join    = require('../../src/jsderiv').Join,
    Not     = require('../../src/jsderiv').Not,
    One     = require('../../src/jsderiv').One,
    Capture = require('../../src/jsderiv').Capture;

function lower(string) {
    return [string.toLowerCase()];
}

function upper(string) {
    return [string.toUpperCase()];
}

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Join();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new Join(Char('r'));
    }, ArgumentError);
    
    // constructor expects an expression and a function
    test.throws(function() {
        new Join(Char('r'), Array());
    }, ArgumentError);
    
    // constructor expects an expression and a function
    test.throws(function() {
        new Join(Array(), upper);
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Join(Char('r'), upper) instanceof Join);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r |> upper is equal to "another" r |> upper
    test.ok(Join(Char('r'), upper).equals(Join(Char('r'), upper)));
    
    // r |> upper is not equal to s |> upper
    test.ok(!Join(Char('r'), upper).equals(Join(Char('s'), upper)));
    
    // r |> upper is not equal to r |> lower
    test.ok(!Join(Char('r'), upper).equals(Join(Char('r'), lower)));
    
    // r |> upper is not equal to Void
    test.ok(!Join(Char('r'), upper).equals(Void()));
    
    // [] |> upper equals []
    test.ok(Join(Void(), upper).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r |> upper renders as "Join(Char("r"))"
    test.equals('Join(Char("r"), [Function])', Join(Char('r'), upper).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r |> upper is not nullable
    test.ok(!Join(Char('r'), upper).isNullable());
    
    // () |> upper is nullable
    test.ok(Join(Null(), upper).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // r |> upper is voidable
    test.ok(Join(Char('r'), upper).isVoidable());
    
    // ~[] |> upper is not voidable
    test.ok(!Join(Not(Void()), upper).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Join(Char('r'), upper).delta();
    }, ArgumentError);
    
    // the delta of r |> upper is always Void
    test.ok(Join(Char('r'), upper).delta('a').equals(Void()));
    
    // the delta of () |> upper is always Null
    test.ok(Join(Null(), upper).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Join(Char('r'), upper).derive();
    }, ArgumentError);
    
    // deriving r |> upper yields ~(Null |> 'r' |> upper) for 'r'
    test.ok(Join(Char('r'), upper).derive('r') instanceof Join);
    test.ok(Join(Char('r'), upper).derive('r').expr instanceof Join);
    test.deepEqual(Join(Char('r'), upper).derive('r').expr.parseNull(), ['r']);
    test.ok(Join(Char('r'), upper).derive('r').lambda === upper);
    
    // deriving s |> upper yields Void for 'r'
    test.ok(Join(Char('s'), upper).derive('r').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with <r> |> upper yields an empty set
    test.deepEqual(Join(Capture(Char('r')), upper).parseNull(), []);
    
    // parsing Null with () |> 'r' |> upper throws an error
    test.throws(function() {
        Join(Join(Null(), function() {
            return ['r'];
        }), upper).parseNull();
    }, ArgumentError);
    
    // parsing Null with <() |> 'r'> |> upper yields "R"
    test.deepEqual(Join(Capture(Join(Null(), function() {
        return ['r'];
    })), upper).parseNull(), ["R"]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Join(Capture(Char('r')), upper).parse();
    }, ArgumentError);
    
    // parsing "r" with <r> |> upper yields "R"
    test.deepEqual(Join(Capture(Char('r')), upper).parse("r"), ["R"]);
    
    // parsing "rrr" with <r> |> upper yields an empty set
    test.deepEqual(Join(Capture(Char('r')), upper).parse("rrr"), []);
    
    // parsing "abc" with <r> |> upper yields an empty set
    test.deepEqual(Join(Capture(Char('r')), upper).parse("abc"), []);
    
    test.done();
};

