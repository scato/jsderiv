var common    = require('../lib/common'),
    lexer     = require('../lib/lexer'),
    lookahead = require('../lib/lookahead');

var Void    = common.Void,
    Null   = common.Null,
    Char    = lexer.Char,
    Seq     = common.Seq,
    Any     = common.Any,
    Or      = common.Or,
    And     = common.And,
    Not     = common.Not,
    Red     = common.Red,
    RedMany  = common.RedMany,
    Many    = common.Many,
    Maybe   = common.Maybe,
    Ignore  = common.Ignore,
    Look    = lookahead.Look;

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
exports['test Maybe'] = function(test) {
    var output;
    
    output = derive(Maybe(Char('a')), "a");
    test.deepEqual(output.parseNull(), [['a']]);
    
    output = derive(Maybe(Char('a')), "");
    test.deepEqual(output.parseNull(), [[]]);
    
    output = derive(Maybe(Char('a')), "b");
    test.deepEqual(output.parseNull(), []);
    
    test.done();
};

// a (?= b)
exports['test Look'] = function(test) {
    var output;
    
    output = derive(Seq(Char('a'), Look(Char('b'))), "a");
    test.deepEqual(output.parseNull(), [['a']]);
    
    output = derive(Seq(Char('a'), Look(Char('b'))), "ab");
    test.deepEqual(output.parseNull(), []);
    
    output = derive(Seq(Seq(Char('a'), Look(Char('b'))), Char('b')), "ab");
    test.deepEqual(output.parseNull(), [['a', 'b']]);
    
    test.done();
};

// a -> f
exports['test Red'] = function(test) {
    var output;
    
    function f(x) {
        return ['"' + x.join('') + '"'];
    }
    
    output = derive(Red(Char('a'), f), "a");
    test.deepEqual(output.parseNull(), [['"a"']]);
    
    test.done();
};

// a => f
exports['test RedMany'] = function(test) {
    var output;
    
    function f(x) {
        return [['"' + x.join('') + '"']];
    }
    
    output = derive(RedMany(Char('a'), f), "a");
    test.deepEqual(output.parseNull(), [['"a"']]);
    
    test.done();
};

// a!
exports['test Ignore'] = function(test) {
    var output;
    
    output = derive(Ignore(Char('a')), "a");
    test.deepEqual(output.parseNull(), [[]]);
    
    test.done();
};
