var lexer  = require('../lib/lexer'),
    common = require('../lib/common');

var Null    = common.Null,
    Empty   = common.Empty,
    Char    = lexer.Char,
    Literal = lexer.Literal,
    RegExp  = lexer.RegExp;

exports['test "{a} = {a}"'] = function(test) {
    test.ok(Char("a").equals(Char("a")));
    test.done();
};

exports['test "{a} != {b}"'] = function(test) {
    test.ok(!Char("a").equals(Char("b")));
    test.done();
};

exports['test "{aaa} = {aaa}"'] = function(test) {
    test.ok(Literal("aaa").equals(Literal("aaa")));
    test.done();
};

exports['test "{aaa} != {abc}"'] = function(test) {
    test.ok(!Literal("aaa").equals(Literal("abc")));
    test.done();
};

