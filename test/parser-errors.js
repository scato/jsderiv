var test = require('../src/test-lang');

var tokenize = test.tokenize,
    parse    = test.parse;

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP;

exports['test parse error'] = function(test) {
    test.doesNotThrow(function() {
        parse(tokenize("1 + 1").exclude(LAYOUT));
    });
    
    test.throws(function() {
        parse(tokenize("1 + ").exclude(LAYOUT));
    });
    
    test.done();
};

exports['test unexpected token'] = function(test) {
    test.doesNotThrow(function() {
        parse(tokenize("1 + 1").exclude(LAYOUT));
    });
    
    test.throws(function() {
        parse(tokenize("1 + 1"));
    });
    
    test.done();
};

exports['test unexpected token at'] = function(test) {
    try {
        parse(tokenize("1 + 1"));
    } catch(e) {
        test.equal(e.message, "Unexpected token LAYOUT(\" \") at 1:2");
    }
    
    try {
        parse(tokenize("1 + 1 +\n + 1 + 1").exclude(LAYOUT));
    } catch(e) {
        test.equal(e.message, "Unexpected token OP(\"+\") at 2:2");
    }
    
    test.done();
};
