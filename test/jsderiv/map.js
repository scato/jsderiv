var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void    = require('../../src/jsderiv').Void,
    Null    = require('../../src/jsderiv').Null,
    Char    = require('../../src/jsderiv').Char,
    Seq     = require('../../src/jsderiv').Seq,
    Map     = require('../../src/jsderiv').Map,
    Not     = require('../../src/jsderiv').Not,
    One     = require('../../src/jsderiv').One;

function lower(string) {
    return [string.toLowerCase()];
}

function upper(string) {
    return [string.toUpperCase()];
}

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Map();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new Map(Char('r'));
    }, ArgumentError);
    
    // constructor expects an expression and a function
    test.throws(function() {
        new Map(Char('r'), Array());
    }, ArgumentError);
    
    // constructor expects an expression and a function
    test.throws(function() {
        new Map(Array(), upper);
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Map(Char('r'), upper) instanceof Map);
    
    test.done();
};

exports['test equals'] = function(test) {
    // r |> upper is equal to "another" r |> upper
    test.ok(Map(Char('r'), upper).equals(Map(Char('r'), upper)));
    
    // r |> upper is not equal to s |> upper
    test.ok(!Map(Char('r'), upper).equals(Map(Char('s'), upper)));
    
    // r |> upper is not equal to r |> lower
    test.ok(!Map(Char('r'), upper).equals(Map(Char('r'), lower)));
    
    // r |> upper is not equal to Void
    test.ok(!Map(Char('r'), upper).equals(Void()));
    
    // [] |> upper equals []
    test.ok(Map(Void(), upper).equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // r |> upper renders as "Map(Char("r"))"
    test.equals('Map(Char("r"), [Function])', Map(Char('r'), upper).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // r |> upper is not nullable
    test.ok(!Map(Char('r'), upper).isNullable());
    
    // () |> upper is nullable
    test.ok(Map(Null(), upper).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // r |> upper is voidable
    test.ok(Map(Char('r'), upper).isVoidable());
    
    // ~[] |> upper is not voidable
    test.ok(!Map(Not(Void()), upper).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Map(Char('r'), upper).delta();
    }, ArgumentError);
    
    // the delta of r |> upper is always Void
    test.ok(Map(Char('r'), upper).delta('a').equals(Void()));
    
    // the delta of () |> upper is always Null
    test.ok(Map(Null(), upper).delta('a').equals(Null()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Map(Char('r'), upper).derive();
    }, ArgumentError);
    
    // deriving r |> upper yields ~(Null |> 'r' |> upper) for 'r'
    test.ok(Map(Char('r'), upper).derive('r') instanceof Map);
    test.ok(Map(Char('r'), upper).derive('r').expr instanceof Map);
    test.deepEqual(Map(Char('r'), upper).derive('r').expr.parseNull(), ['r']);
    test.ok(Map(Char('r'), upper).derive('r').lambda === upper);
    
    // deriving s |> upper yields Void for 'r'
    test.ok(Map(Char('s'), upper).derive('r').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with r |> upper yields an empty set
    test.deepEqual(Map(Char('r'), upper).parseNull(), []);
    
    // parsing Null with () |> 'r' |> upper yields "R"
    test.deepEqual(Map(Map(Null(), function() {
        return ['r'];
    }), upper).parseNull(), ["R"]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Map(Char('r'), upper).parse();
    }, ArgumentError);
    
    // parsing "r" with r |> upper yields "R"
    test.deepEqual(Map(Char('r'), upper).parse("r"), ["R"]);
    
    // parsing "rrr" with r |> upper yields an empty set
    test.deepEqual(Map(Char('r'), upper).parse("rrr"), []);
    
    // parsing "abc" with r |> upper yields an empty set
    test.deepEqual(Map(Char('r'), upper).parse("abc"), []);
    
    test.done();
};

