var common      = require('../lib/common'),
    scannerless = require('../lib/scannerless');

var Void    = common.Void,
    Null   = common.Null,
    Char    = scannerless.Char,
    Literal = scannerless.Literal;

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

