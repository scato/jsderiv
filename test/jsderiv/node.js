var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Node = require('../../src/jsderiv').Node;

exports['test constructor'] = function(test) {
    // constructor expects two arguments
    test.throws(function() {
        new Node();
    }, ArgumentError);
    
    // constructor expects two arguments
    test.throws(function() {
        new Node('ID');
    }, ArgumentError);
    
    // constructor expects a string and an array
    test.throws(function() {
        new Node(false, ["foo"]);
    }, ArgumentError);
    
    // constructor expects a string and an array
    test.throws(function() {
        new Node('ID', false);
    }, ArgumentError);
    
    // function can also be used as a constructor
    test.ok(Node('ID', ["foo"]) instanceof Node);
    
    test.done();
};

exports['test define'] = function(test) {
    var ID = Node.define('ID');
    
    // define produces a constructor
    test.equals('function', typeof ID);
    
    // function can also be used as a constructor
    test.ok(ID("foo") instanceof ID);
    
    // constructor inherits from Node
    test.ok(ID("foo") instanceof Node);
    
    // constructor saves arguments as childNodes
    test.deepEqual(new ID("foo", "bar").childNodes, ["foo", "bar"]);
    
    // function saves arguments as childNodes
    test.deepEqual(ID("foo", "bar").childNodes, ["foo", "bar"]);
    
    test.done();
};

exports['test toString'] = function(test) {
    // Node('ID', ["foo", "bar"]) renders as "ID("foo", "bar")"
    test.equals('ID("foo", "bar")', Node('ID', ["foo", "bar"]).toString());
    
    // Node('Var', [Node('ID', ["foo"]), Node('ID', ["bar"])]) renders as "Var(ID("foo"), ID("bar"))"
    test.equals('Var(ID("foo"), ID("bar"))', Node('Var', [Node('ID', ["foo"]), Node('ID', ["bar"])]).toString());
    
    test.done();
};
