var common = require('../lib/common'),
    lexer  = require('../lib/lexer');

var Void    = common.Void,
    Null   = common.Null,
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
exports['test Void'] = function(test) {
    test.deepEqual(Void().parseNull(), []);
    test.done();
};

// {""}
exports['test Null'] = function(test) {
    test.deepEqual(Null().parseNull(), [[]]);
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
    
    output = derive(Any(Char('a')), "aa");
    test.deepEqual(output.parseNull(), [['a', 'a']]);
    
    test.done();
};

// r | s
exports['test Or'] = function(test) {
    var output;
    
    output = derive(Or(Char('a'), Char('b')), "b");
    test.deepEqual(output.parseNull(), [['b']]);
    
    test.done();
};

// r & s
exports['test And'] = function(test) {
    var output;
    
    output = derive(And(Char('a'), Char('a')), "a");
    test.deepEqual(output.parseNull(), [['a']]);
    
    test.done();
};

// ~a
exports['test Not'] = function(test) {
    var output;
    
    output = derive(Not(Char('a')), "a");
    test.deepEqual(output.parseNull(), []);
    
    output = derive(Not(Char('a')), "b");
    test.deepEqual(output.parseNull(), [['b']]);
    
    test.done();
};

// a+
exports['test Many'] = function(test) {
    var output;
    
    output = derive(Many(Char('a')), "aa");
    test.deepEqual(output.parseNull(), [['a', 'a']]);
    
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

