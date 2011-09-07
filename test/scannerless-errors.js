var test = require('../src/test-sl-lang');

var parse = test.parse;

exports['test parse error'] = function(test) {
    test.doesNotThrow(function() {
        parse("1 + 1");
    });
    
    test.throws(function() {
        parse("1 + ");
    });
    
    test.done();
};

exports['test unexpected char'] = function(test) {
    test.doesNotThrow(function() {
        parse("1 + 1");
    });
    
    test.throws(function() {
        parse("1 + + 1");
    });
    
    test.done();
};

exports['test invalid char'] = function(test) {
    test.throws(function() {
        parse("2");
    });
    
    test.done();
};

exports['test invalid char at'] = function(test) {
    try {
        parse("2");
    } catch(e) {
        test.equal(e.message, "Invalid character '2' at 1:1");
    }
    
    try {
        parse("1 + 1\n  + 2 + 1");
    } catch(e) {
        test.equal(e.message, "Invalid character '2' at 2:5");
    }
    
    test.done();
};
