var Module      = require('../../src/grammar/grammar').Module,
    Export      = require('../../src/grammar/grammar').Export;

var Test             = require('../../src/grammar/grammar-test').Test,
    StartDeclaration = require('../../src/grammar/grammar-test').StartDeclaration,
    Assertion        = require('../../src/grammar/grammar-test').Assertion,
    Set              = require('../../src/grammar/grammar-test').Set,
    List             = require('../../src/grammar/grammar-test').List,
    Node             = require('../../src/grammar/grammar-test').Node,
    Term             = require('../../src/grammar/grammar-test').Term;

require('../../src/grammar/grammar-test-to-javascript');

exports['test Test'] = function(test) {
    test.equals("\
exports[\"test \\\"Example\\\"\"] = function(test) {\n\
    var start = new Example().NEWLINE();\n\
    \n\
    test.deepEqual(start.parse(\"\\n\"), [[NEWLINE(\"\\n\")]]);\n\
    test.done();\n\
};\
", Test("\"Example\"", StartDeclaration("Example.NEWLINE"), [Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\""))))))]).toJavascript('exports'));
    
    test.done();
};

exports['test StartDeclaration'] = function(test) {
    test.equals("var start = new Example().NEWLINE();", StartDeclaration("Example.NEWLINE").toJavascript());
    
    test.done();
};

exports['test Assertion'] = function(test) {
    test.equals("test.deepEqual(start.parse(\"\\n\"), [[NEWLINE(\"\\n\")]]);", Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\"")))))).toJavascript());
    
    test.done();
};

exports['test Set'] = function(test) {
    test.equals("[]", Set().toJavascript());
    test.equals("[[NEWLINE(\"\\n\")]]", Set(List(Node("NEWLINE", List(Term("\"\\n\""))))).toJavascript());
    
    test.done();
};

exports['test List'] = function(test) {
    test.equals("[NEWLINE(\"\\n\")]", List(Node("NEWLINE", List(Term("\"\\n\"")))).toJavascript());
    
    test.done();
};

exports['test Node'] = function(test) {
    test.equals("NEWLINE(\"\\n\")", Node("NEWLINE", List(Term("\"\\n\""))).toJavascript());
    
    test.done();
};

exports['test Term'] = function(test) {
    test.equals("\"\\n\"", Term("\"\\n\"").toJavascript());
    
    test.done();
};

