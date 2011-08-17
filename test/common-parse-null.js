var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Null    = common.Null,
    Empty   = common.Empty,
    Char    = lexer.Char,
    Seq     = common.Seq,
    Any     = common.Any,
    Or      = common.Or,
    And     = common.And,
    Not     = common.Not,
    Red     = common.Red,
    Many    = common.Many,
    Opt     = common.Opt,
    Look    = common.Look;

function derive(expr, input) {
    var output = expr;
    
    for(var i = 0; i < input.length; i++) {
        output = output.derive(input[i]);
    }
    
    return output;
}

// {}
exports['test Null'] = function(test) {
    test.deepEqual(Null().parseNull(), []);
    test.done();
};

// {""}
exports['test Empty'] = function(test) {
    test.deepEqual(Empty().parseNull(), [[]]);
    test.done();
};

// r s
exports['test Seq'] = function(test) {
    var output;
    
    output = derive(Seq(Char('a'), Char('b')), "ab");
    test.deepEqual(output.parseNull(), [['a', 'b']]);
    
    test.done();
};

// r*
exports['test Any'] = function(test) {
    var output;
    
    test.done();
};

// r | s
exports['test Or'] = function(test) {
    var output;
    
    test.done();
};

// r & s
exports['test And'] = function(test) {
    var output;
    
    test.done();
};

// ~a
exports['test Not'] = function(test) {
    var output;
    
    test.done();
};

// a+
exports['test Many'] = function(test) {
    var output;
    
    test.done();
};

// a?
exports['test Opt'] = function(test) {
    var output;
    
    test.done();
};

// a (?= b)
exports['test Look'] = function(test) {
    var output;
    
    test.done();
};

