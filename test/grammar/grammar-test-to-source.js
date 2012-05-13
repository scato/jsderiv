var Module      = require('../../src/grammar/grammar').Module,
    Export      = require('../../src/grammar/grammar').Export;

var Test             = require('../../src/grammar/grammar-test').Test,
    StartDeclaration = require('../../src/grammar/grammar-test').StartDeclaration,
    Assertion        = require('../../src/grammar/grammar-test').Assertion,
    Set              = require('../../src/grammar/grammar-test').Set,
    List             = require('../../src/grammar/grammar-test').List,
    Node             = require('../../src/grammar/grammar-test').Node,
    Term             = require('../../src/grammar/grammar-test').Term;

require('../../src/grammar/grammar-test-to-source');

exports['test Test'] = function(test) {
    test.equals("\
test \"Example\" {\n\
    start Example.NEWLINE;\n\
    \n\
    assert \"\\n\" -> (NEWLINE(\"\\n\"));\n\
}\
", Test("\"Example\"", StartDeclaration("Example.NEWLINE"), [Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\""))))))]).toSource());
    
    test.done();
};

exports['test StartDeclaration'] = function(test) {
    test.equals("start Example.NEWLINE;", StartDeclaration("Example.NEWLINE").toSource());
    
    test.done();
};

exports['test Assertion'] = function(test) {
    test.equals("assert \"\\n\" -> (NEWLINE(\"\\n\"));", Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\"")))))).toSource());
    
    test.done();
};

exports['test Set'] = function(test) {
    test.equals("{}", Set().toSource());
    test.equals("(NEWLINE(\"\\n\"))", Set(List(Node("NEWLINE", List(Term("\"\\n\""))))).toSource());
    
    test.done();
};

exports['test List'] = function(test) {
    test.equals("(NEWLINE(\"\\n\"))", List(Node("NEWLINE", List(Term("\"\\n\"")))).toSource());
    
    test.done();
};

exports['test Node'] = function(test) {
    test.equals("NEWLINE(\"\\n\")", Node("NEWLINE", List(Term("\"\\n\""))).toSource());
    
    test.done();
};

exports['test Term'] = function(test) {
    test.equals("\"\\n\"", Term("\"\\n\"").toSource());
    
    test.done();
};

