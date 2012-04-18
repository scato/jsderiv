var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void    = require('../../src/jsderiv').Void,
    Null    = require('../../src/jsderiv').Null,
    Char    = require('../../src/jsderiv').Char,
    Seq     = require('../../src/jsderiv').Seq,
    Look    = require('../../src/jsderiv').Look,
    Not     = require('../../src/jsderiv').Not,
    Any     = require('../../src/jsderiv').Any,
    Map     = require('../../src/jsderiv').Map,
    One     = require('../../src/jsderiv').One,
    Capture = require('../../src/jsderiv').Capture;

function upper(string) {
    return [string.toUpperCase()];
}

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Look();
    }, ArgumentError);
    
    // constructor expects an expression
    test.throws(function() {
        new Look(Array());
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Look(Char('r')) instanceof Look);
    
    test.done();
};

exports['test equals'] = function(test) {
    // ?= r is equal to "another" ?= r
    test.ok(Look(Char('r')).equals(Look(Char('r'))));
    
    // ?= r is not equal to ?= s
    test.ok(!Look(Char('r')).equals(Look(Char('s'))));
    
    // ?= r is not equal to Void
    test.ok(!Look(Char('r')).equals(Void()));
    
    // ?= [] equals []
    test.ok(Look(Void()).equals(Void()));
    
    // ?= () equals ()
    test.ok(Look(Null()).equals(Null()));
    
    // ?= ~[] equals ()
    test.ok(Look(Not(Void())).equals(Null()));

    // ?= ~() equals []
    test.ok(Look(Not(Null())).equals(Void()));
    
    // ?= r |> upper equals ?= r
    test.ok(Look(Map(Char('r'), upper)).equals(Look(Char('r'))));
    
    // ?= ~(r |> upper) equals ?= ~r
    test.ok(Look(Not(Map(Char('r'), upper))).equals(Look(Not(Char('r')))));
    
    test.done();
};

exports['test toString'] = function(test) {
    // ?= r renders as "Look(Char("r"))"
    test.equals('Look(Char("r"))', Look(Char('r')).toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // ?= r is nullable
    test.ok(Look(Char('r')).isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // ?= r is voidable
    test.ok(Look(Char('r')).isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Look(Char('r')).delta();
    }, ArgumentError);
    
    // the delta of ?= r is Null for 'r'
    test.ok(Look(Char('r')).delta('r').equals(Null()));
    
    // the delta of ?= r is Void for 'a'
    test.ok(Look(Char('r')).delta('a').equals(Void()));
    
    /* never mind...
    // the delta of ?= 'a' 'b' is ?= 'b' for 'a'
    test.ok(Look(Seq(Char('a'), Char('b'))).delta('a').equals(Look(Char('b'))));
    */
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Look(Char('r')).derive();
    }, ArgumentError);
    
    // deriving ?= r always yields Void
    test.ok(Look(Char('r')).derive('r').equals(Void()));
    
    test.done();
    
    return;
    
    // deriving ?= r yields Null for 'r'
    test.ok(Look(Char('r')).derive('r').equals(Null()));
    
    // deriving ?= (r s) yields ?= ((Null -> 'r') s) for 'r'
    test.ok(Look(Seq(Char('r'), Char('s'))).derive('r') instanceof Look);
    test.ok(Look(Seq(Char('r'), Char('s'))).derive('r').expr instanceof Seq);
    test.ok(Look(Seq(Char('r'), Char('s'))).derive('r').expr.left instanceof Map);
    test.deepEqual(Look(Seq(Char('r'), Char('s'))).derive('r').expr.left.parseNull(), ['r']);
    test.ok(Look(Seq(Char('r'), Char('s'))).derive('r').expr.right.equals(Char('s')));
    
    // deriving ?= s yields Void for 'r'
    test.ok(Look(Char('s')).derive('r').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with ?= r yields an empty set
    test.deepEqual(Look(Char('r')).parseNull(), [[]]);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Look(Char('r')).parse();
    });
    
    // parsing "r" with ?= r yields an empty set
    test.deepEqual(Look(Char('r')).parse("r"), []);
    
    // parsing "abc" with (a ?= ~b) .* yields an empty set
    test.deepEqual(Seq(Char('a'), Look(Not(Char('b'))), Any(One())).parse("abc"), []);
    
    // parsing "acc" with (a ?= ~b) .* yields "acc"
    test.deepEqual(Seq(Seq(Char('a'), Look(Not(Char('b')))), Any(One())).parse("acc"), ["acc"]);
    
    test.done();
};

