var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Char    = require('../../src/jsderiv').Char,
    One     = require('../../src/jsderiv').One,
    Any     = require('../../src/jsderiv').Any,
    Seq     = require('../../src/jsderiv').Seq,
    Null    = require('../../src/jsderiv').Null,
    Or      = require('../../src/jsderiv').Or,
    Not     = require('../../src/jsderiv').Not,
    And     = require('../../src/jsderiv').And,
    Red     = require('../../src/jsderiv').Red,
    Capture = require('../../src/jsderiv').Capture,
    Defer   = require('../../src/jsderiv').Defer,
    Part    = require('../../src/jsderiv').Part,
    Map     = require('../../src/jsderiv').Map,
    Ignore  = require('../../src/jsderiv').Ignore,
    Omit    = require('../../src/jsderiv').Omit,
    Many    = require('../../src/jsderiv').Many,
    Maybe   = require('../../src/jsderiv').Maybe,
    Literal = require('../../src/jsderiv').Literal,
    OneOf   = require('../../src/jsderiv').OneOf,
    NoneOf  = require('../../src/jsderiv').NoneOf,
    ButNot  = require('../../src/jsderiv').ButNot,
    Look    = require('../../src/jsderiv').Look,
    Range   = require('../../src/jsderiv').Range;

function lower(string) {
    return string.toLowerCase();
}

function upper(string) {
    return string.toUpperCase();
}

exports['test Red'] = function(test) {
    // function expects two arguments
    test.throws(function() {
        Red();
    }, ArgumentError);
    
    // function expects two arguments
    test.throws(function() {
        Red(Char('r'));
    }, ArgumentError);
    
    // function expects an expression and a function
    test.throws(function() {
        Red(false, upper);
    }, ArgumentError);
    
    // function expects an expression and a function
    test.throws(function() {
        Red(Char('r'), false);
    }, ArgumentError);
    
    // r -> upper is a shortcut for r |> ...
    test.ok(Red(Char('r'), upper) instanceof Map);
    
    // parsing "rrr" with <r*> -> upper yields ("RRR")
    test.deepEqual(Red(Capture(Any(Char('r'))), upper).parse("rrr"), [["RRR"]]);
    
    test.done();
};

exports['test Capture'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Capture();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Capture(false);
    }, ArgumentError);
    
    // <r> is a shortcut for r |> ...
    test.ok(Capture(Char('r')) instanceof Map);
    
    // parsing "rrr" with <r*> yields ("rrr")
    test.deepEqual(Capture(Any(Char('r'))).parse('rrr'), [["rrr"]]);
    
    // parsing "rrr" with <r>* yields ("r", "r", "r")
    test.deepEqual(Any(Capture(Char('r'))).parse('rrr'), [["r", "r", "r"]]);
    
    // parsing "rrr" with <<r>*> yields (("r", "r", "r"))
    test.deepEqual(Capture(Any(Capture(Char('r')))).parse('rrr'), [[["r", "r", "r"]]]);
    
    test.done();
};

exports['test Defer'] = function(test) {
    // function expects two arguments
    test.throws(function() {
        Defer();
    }, ArgumentError);
    
    // function expects two arguments
    test.throws(function() {
        Defer(Char('r'));
    }, ArgumentError);
    
    // function expects two expressions
    test.throws(function() {
        Defer(false, Char('s'));
    }, ArgumentError);
    
    // function expects two expressions
    test.throws(function() {
        Defer(Char('r'), false);
    }, ArgumentError);
    
    // r &> s is a shortcut for r |> ...
    test.ok(Defer(Char('r'), Char('s')) instanceof Map);
    
    // parsing "rrr" with <r*> &> (<.*> -> upper) yields ("RRR")
    test.deepEqual(Defer(Capture(Any(Char('r'))), Red(Capture(Any(One())), upper)).parse("rrr"), [["RRR"]]);
    
    test.done();
};

exports['test Part'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Part();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Part(false);
    }, ArgumentError);
    
    // r$ is a shortcut for (. &> r)
    test.ok(Part(Char('r')) instanceof Map);
    test.ok(Part(Char('r')).expr.equals(One()));
    
    // parsing "rrr" with "rrr"$ yields an empty set
    test.deepEqual(Part(Literal("rrr")).parse('rrr'), []);
    
    // parsing ["rrr"] with "rrr"$ yields "rrr"
    test.deepEqual(Part(Literal("rrr")).parse(['rrr']), ["rrr"]);
    
    test.done();
};

exports['test Ignore'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Ignore();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Ignore(false);
    }, ArgumentError);
    
    // r! is a shortcut for r |> ...
    test.ok(Ignore(Char('r')) instanceof Map);
    
    // parsing "rrr" with r*! yields an empty list
    test.deepEqual(Ignore(Any(Char('r'))).parse('rrr'), [[]]);
    
    test.done();
};

exports['test Omit'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Omit();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Omit(false);
    }, ArgumentError);
    
    // r# is a shortcut for (r |> ...)*
    test.ok(Omit(Char('r')) instanceof Any);
    test.ok(Omit(Char('r')).expr instanceof Map);
    
    // parsing "rrr" with r# yields an empty list
    test.deepEqual(Omit(Char('r')).parse('rrr'), [[]]);
    
    test.done();
};

exports['test Many'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Many();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Many(false);
    }, ArgumentError);
    
    // r+ is a shortcut for (r r*)
    test.ok(Many(Char('r')).equals(Seq(Char('r'), Any(Char('r')))));
    
    // parsing "" with r+ yields an empty set
    test.deepEqual(Many(Char('r')).parse(''), []);
    
    // parsing "rrr" with r+ yields "rrr"
    test.deepEqual(Many(Char('r')).parse('rrr'), ["rrr"]);
    
    test.done();
};

exports['test Maybe'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Maybe();
    }, ArgumentError);
    
    // function expects an expression
    test.throws(function() {
        Maybe(false);
    }, ArgumentError);
    
    // r? is a shortcut for (r | ())
    test.ok(Maybe(Char('r')).equals(Or(Char('r'), Null())));
    
    // parsing "" with r? yields an empty list
    test.deepEqual(Maybe(Char('r')).parse(''), [[]]);
    
    // parsing "r" with r? yields "r"
    test.deepEqual(Maybe(Char('r')).parse('r'), ["r"]);
    
    test.done();
};

exports['test Literal'] = function(test) {
    // function expects one argument
    test.throws(function() {
        Literal();
    }, ArgumentError);
    
    // function expects a string
    test.throws(function() {
        Literal(false);
    }, ArgumentError);
    
    // "abc\n" is a shortcut for ('a' 'b' 'c')
    test.ok(Literal("abc").equals(Seq(Seq(Char('a'), Char('b')), Char('c'))));
    
    // parsing "abc" with "abc" yields "abc"
    test.deepEqual(Literal("abc").parse('abc'), ["abc"]);
    
    test.done();
};

exports['test OneOf'] = function(test) {
    // function expects any number of expressions
    test.throws(function() {
        OneOf(false);
    }, ArgumentError);
    
    // [abc] is a shortcut for ('a' | 'b' | 'c')
    test.ok(OneOf(Char('a'), Char('b'), Char('c')).equals(Or(Or(Char('a'), Char('b')), Char('c'))));
    
    // parsing "a" with [abc] yields "a"
    test.deepEqual(OneOf(Char('a'), Char('b'), Char('c')).parse('a'), ["a"]);
    
    // parsing "d" with [abc] yields an empty set
    test.deepEqual(OneOf(Char('a'), Char('b'), Char('c')).parse('d'), []);
    
    test.done();
};

exports['test NoneOf'] = function(test) {
    // function expects any number of expressions
    test.throws(function() {
        NoneOf(false);
    }, ArgumentError);
    
    // [^abc] is a shortcut for . ^ [abc]
    test.ok(NoneOf(Char('a'), Char('b'), Char('c')).equals(ButNot(One(), OneOf(Char('a'), Char('b'), Char('c')))));
    
    // parsing "a" with [^abc] yields an empty set
    test.deepEqual(NoneOf(Char('a'), Char('b'), Char('c')).parse('a'), []);
    
    // parsing "d" with [^abc] yields "d"
    test.deepEqual(NoneOf(Char('a'), Char('b'), Char('c')).parse('d'), ["d"]);
    
    test.done();
};

exports['test ButNot'] = function(test) {
    // function expects two arguments
    test.throws(function() {
        ButNot();
    }, ArgumentError);
    
    // function expects two arguments
    test.throws(function() {
        ButNot(Char('r'));
    }, ArgumentError);
    
    // function expects two expressions
    test.throws(function() {
        ButNot(false, Char('s'));
    }, ArgumentError);
    
    // function expects two expressions
    test.throws(function() {
        ButNot(Char('r'), false);
    }, ArgumentError);
    
    // r ^ s is a shortcut for r & ~s
    test.ok(ButNot(Char('r'), Char('s')).equals(And(Char('r'), Not(Char('s')))));
    
    // parsing "r" with . ^ s yields "r"
    test.deepEqual(ButNot(Char('r'), Char('s')).parse("r"), ["r"]);
    
    // parsing "s" with . ^ s yields an empty set
    test.deepEqual(ButNot(Char('r'), Char('s')).parse("s"), []);
    
    test.done();

};

require('../../src/jsderiv').debug = false;

/*
var Seq   = require('../../src/jsderiv').Seq,
    Not   = require('../../src/jsderiv').Not,
    Any   = require('../../src/jsderiv').Any,
    Many  = require('../../src/jsderiv').Many,
*/

var ID = Many(Range('a', 'z'));

exports['test (ID ?= ~ID)*'] = function(test) {
    var start = Any(Seq(ID, Look(Not(ID))));
    
    test.deepEqual(start.parse("id"), ["id"]);
    
    test.done();
};

