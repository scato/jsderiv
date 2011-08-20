var common    = require('../lib/common'),
    lexer     = require('../lib/lexer'),
    lookahead = require('../lib/lookahead');

var And     = common.And,
    Null    = common.Null,
    Empty   = common.Empty,
    Any     = common.Any,
    Not     = common.Not,
    Seq     = common.Seq,
    Or      = common.Or,
    Red     = common.Red,
    Look    = lookahead.Look,
    Grammar = lexer.Grammar;

var grammar = new Grammar();

var Ref = grammar.Ref;

var r = Ref("r"),
    s = Ref("s"),
    t = Ref("t");

exports['test "r & r = r"'] = function(test) {
    test.ok(And(r, r).equals(r));
    test.done();
};

exports['test "r & s = s & r"'] = function(test) {
    test.ok(And(r, s).equals(And(s, r)));
    test.done();
};

exports['test "(r & s) & t = r & (s & t)"'] = function(test) {
    test.ok(And(And(r, s), t).equals(And(r, And(s, t))));
    test.done();
};

exports['test "0 & r = 0"'] = function(test) {
    test.ok(And(Null(), r).equals(Null()));
    test.done();
};

exports['test "^0 & r = r"'] = function(test) {
    test.ok(And(Not(Null()), r).equals(r));
    test.done();
};

exports['test "r + r = r"'] = function(test) {
    test.ok(Or(r, r).equals(r));
    test.done();
};

exports['test "r + s = s + r"'] = function(test) {
    test.ok(Or(r, s).equals(Or(s, r)));
    test.done();
};

exports['test "(r + s) + t = r + (s + t)"'] = function(test) {
    test.ok(Or(Or(r, s), t).equals(Or(r, Or(s, t))));
    test.done();
};

exports['test "^0 + r = ^0"'] = function(test) {
    test.ok(Or(Not(Null()), r).equals(Not(Null())));
    test.done();
};

exports['test "0 + r = r"'] = function(test) {
    test.ok(Or(Null(), r).equals(r));
    test.done();
};

exports['test "(r . s) . t = r . (s . t)"'] = function(test) {
    test.ok(Seq(Seq(r, s), t).equals(Seq(r, Seq(s, t))));
    test.done();
};

exports['test "0 . r = 0"'] = function(test) {
    test.ok(Seq(Null(), r).equals(Null()));
    test.done();
};

exports['test "r . 0 = 0"'] = function(test) {
    test.ok(Seq(r, Null()).equals(Null()));
    test.done();
};

exports['test "E . r = r"'] = function(test) {
    test.ok(Seq(Empty(), r).equals(r));
    test.done();
};

exports['test "r . E = r"'] = function(test) {
    test.ok(Seq(r, Empty()).equals(r));
    test.done();
};

exports['test "(r*)* = r*"'] = function(test) {
    test.ok(Any(Any(r)).equals(Any(r)));
    test.done();
};

exports['test "E* = E"'] = function(test) {
    test.ok(Any(Empty()).equals(Empty()));
    test.done();
};

exports['test "0* = E"'] = function(test) {
    test.ok(Any(Null()).equals(Empty()));
    test.done();
};

exports['test "^(^r) = r"'] = function(test) {
    test.ok(Not(Not(r)).equals(r));
    test.done();
};

exports['test "0 -> f = 0"'] = function(test) {
    test.ok(Red(Null(), function(x) { return x; }).equals(Null()));
    test.done();
};

exports['test "?E = E"'] = function(test) {
    test.ok(Look(Empty()).equals(Empty()));
    test.done();
};

exports['test "?0 = 0"'] = function(test) {
    test.ok(Look(Null()).equals(Null()));
    test.done();
};

