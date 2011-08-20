var common = require('../lib/common'),
    parser = require('../lib/parser');

var Null    = common.Null,
    Empty   = common.Empty,
    Token   = parser.Token;

var test = require('../src/grammars/test');

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP;

exports['test "\\INT = \\INT"'] = function(test) {
    test.ok(Token(INT).equals(Token(INT)));
    test.done();
};

exports['test "{\\INT} != {\\OP}"'] = function(test) {
    test.ok(!Token(INT).equals(Token(OP)));
    test.done();
};

