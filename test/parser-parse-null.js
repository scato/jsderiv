var common = require('../lib/common'),
    lexer  = require('../lib/lexer'),
    parser = require('../lib/parser');

var Null    = common.Null,
    Empty   = common.Empty,
    Token   = parser.Token;

var Stream  = lexer.Stream;

var test = require('../src/grammars/test');

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP;

function derive(expr, input) {
    var output = expr;
    
    input.forEach(function(token) {
        output = output.derive(token);
    });
    
    return output;
}

exports['test Token'] = function(test) {
    var output;
    
    test.deepEqual(Token(INT).parseNull(), []);
    
    output = derive(Token(INT), new Stream(INT("1")));
    test.deepEqual(output.parseNull(), [[INT("1")]]);
    
    test.done();
};

