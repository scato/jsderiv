var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {Parser, Literal} from .parser;
var Parser  = require('./parser').Parser,
    Literal = require('./parser').Literal;

// import {ID, LITERAL} from .lexer;
var ID      = require('./lexer').ID,
    LITERAL = require('./lexer').LITERAL;

// export constructor Test, StartDeclaration, Assertion, NodeList, NodeSet, Node, Terminal;
var Test             = exports.Test             = g.Cons("Test");
var StartDeclaration = exports.StartDeclaration = g.Cons("StartDeclaration");
var Assertion        = exports.Assertion        = g.Cons("Assertion");
var NodeList         = exports.NodeList         = g.Cons("NodeList");
var NodeSet          = exports.NodeSet          = g.Cons("NodeSet");
var Node             = exports.Node             = g.Cons("Node");
var Terminal         = exports.Terminal         = g.Cons("Terminal");

// Definition: default | Test;
(function($default) {
    var $cache;
    
    Parser.prototype.Definition = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Or($default.apply(this, []), this.Test());
        }.bind(this), 'Definition');
    };
})(Parser.prototype.Definition);

// Test: "test"! @LITERAL "{"! StartDeclaration (Assertion* -> List) "}"! -> Test;
(function($default) {
    var $cache;
    
    Parser.prototype.Test = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("test")), g.InstanceOf(LITERAL)), c.Ignore(g.Literal("{"))), this.StartDeclaration()), c.Red(c.Any(this.Assertion()), List)), c.Ignore(g.Literal("}"))), Test);
        }.bind(this), 'Test');
    };
})(Parser.prototype.Test);

// StartDeclaration: "start"! RuleIdentifier ";"! -> StartDeclaration;
(function($default) {
    var $cache;
    
    Parser.prototype.StartDeclaration = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("start")), this.RuleIdentifier()), c.Ignore(g.Literal(";"))), StartDeclaration);
        }.bind(this), 'StartDeclaration');
    };
})(Parser.prototype.StartDeclaration);

// RuleIdentifier: @ID "."! @ID | @ID "."! ("start" -> Text);
(function($default) {
    var $cache;
    
    Parser.prototype.RuleIdentifier = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Or(c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal("."))), g.InstanceOf(ID)), c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal("."))), c.Red(g.Literal("start"), Text)));
        }.bind(this), 'RuleIdentifier');
    };
})(Parser.prototype.RuleIdentifier);

// Assertion: "assert"! NodeList "->"! NodeSet ";"! -> Assertion;
(function($default) {
    var $cache;
    
    Parser.prototype.Assertion = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("assert")), this.NodeList()), c.Ignore(g.Literal("->"))), this.NodeSet()), c.Ignore(g.Literal(";"))), Assertion);
        }.bind(this), 'Assertion');
    };
})(Parser.prototype.Assertion);

// NodeList: "("! (Node (","! Node)*)? ")"! -> NodeList | @LITERAL -> Terminal;
(function($default) {
    var $cache;
    
    Parser.prototype.NodeList = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("(")), c.Maybe(c.Seq(this.Node(), c.Any(c.Seq(c.Ignore(g.Literal(",")), this.Node()))))), c.Ignore(g.Literal(")"))), NodeList), c.Red(g.InstanceOf(LITERAL), Terminal));
        }.bind(this), 'NodeList');
    };
})(Parser.prototype.NodeList);

// NodeSet: "{"! (NodeList (","! NodeList)*)? "}"! -> NodeSet | NodeList -> NodeSet;
(function($default) {
    var $cache;
    
    Parser.prototype.NodeSet = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("{")), c.Maybe(c.Seq(this.NodeList(), c.Any(c.Seq(c.Ignore(g.Literal(",")), this.NodeList()))))), c.Ignore(g.Literal("}"))), NodeSet), c.Red(this.NodeList(), NodeSet));
        }.bind(this), 'NodeSet');
    };
})(Parser.prototype.NodeSet);

// Node: @ID NodeList -> Node;
(function($default) {
    var $cache;
    
    Parser.prototype.Node = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Red(c.Seq(g.InstanceOf(ID), this.NodeList()), Node);
        }.bind(this), 'Node');
    };
})(Parser.prototype.Node);
