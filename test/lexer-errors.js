var test = require('../src/test-lang');

var tokenize = test.tokenize;

var LAYOUT = test.LAYOUT,
    INT    = test.INT,
    OP     = test.OP;

exports['test invalid char'] = function(test) {
    test.throws(function() {
        tokenize("2");
    });
    
    test.done();
};

exports['test invalid char at'] = function(test) {
    try {
        tokenize("2");
    } catch(e) {
        test.equal(e.message, "Invalid character '2' at 1:1");
    }
    
    try {
        tokenize("1 + 1\n  + 2 + 1");
    } catch(e) {
        test.equal(e.message, "Invalid character '2' at 2:5");
    }
    
    test.done();
};
