var $ = require('../jsderiv');

// import {Lexer, Parser, ID, QID, LITERAL, KEYWORD} from ...src."grammar"."grammar";
var Lexer   = require("./../../src/grammar/grammar").Lexer,
    Parser  = require("./../../src/grammar/grammar").Parser,
    ID      = require("./../../src/grammar/grammar").ID,
    QID     = require("./../../src/grammar/grammar").QID,
    LITERAL = require("./../../src/grammar/grammar").LITERAL,
    KEYWORD = require("./../../src/grammar/grammar").KEYWORD;

// ID: default & ~ KEYWORD;
(function($default) {
    var $cache;
    
    Lexer.prototype.ID = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.And($default.apply(this, []).resolve(), $.Not(this.KEYWORD()));
        }.bind(this), 'ID'));
    };
})(Lexer.prototype.ID);

// KEYWORD: default | <"test" | "assert"> ?= ~ [A-Za-z0-9_\-] -> KEYWORD;
(function($default) {
    var $cache;
    
    Lexer.prototype.KEYWORD = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($default.apply(this, []).resolve(), $.Red($.Seq($.Capture($.Or($.Or($.Literal("test"), $.Value("test")), $.Or($.Literal("assert"), $.Value("assert")))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-"))))), KEYWORD));
        }.bind(this), 'KEYWORD'));
    };
})(Lexer.prototype.KEYWORD);

// export constructor Test, StartDeclaration, Assertion;
var Test             = exports.Test             = $.Node.define("Test");
var StartDeclaration = exports.StartDeclaration = $.Node.define("StartDeclaration");
var Assertion        = exports.Assertion        = $.Node.define("Assertion");

// export constructor List, Set, Node, Term;
var List = exports.List = $.Node.define("List");
var Set  = exports.Set  = $.Node.define("Set");
var Node = exports.Node = $.Node.define("Node");
var Term = exports.Term = $.Node.define("Term");

// Definition: default | Test;
(function($default) {
    var $cache;
    
    Parser.prototype.Definition = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($default.apply(this, []).resolve(), this.Test());
        }.bind(this), 'Definition'));
    };
})(Parser.prototype.Definition);

// Test: "test"! @LITERAL "{"! StartDeclaration <Assertion*> "}"! -> Test;
(function($default) {
    var $cache;
    
    Parser.prototype.Test = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("test"), $.Value("test"))), $.Type(LITERAL)), $.Ignore($.Or($.Literal("{"), $.Value("{")))), this.StartDeclaration()), $.Capture($.Any(this.Assertion()))), $.Ignore($.Or($.Literal("}"), $.Value("}")))), Test);
        }.bind(this), 'Test'));
    };
})(Parser.prototype.Test);

// StartDeclaration: "start"! (@ID | @QID) ";"! -> StartDeclaration;
(function($default) {
    var $cache;
    
    Parser.prototype.StartDeclaration = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Or($.Literal("start"), $.Value("start"))), $.Or($.Type(ID), $.Type(QID))), $.Ignore($.Or($.Literal(";"), $.Value(";")))), StartDeclaration);
        }.bind(this), 'StartDeclaration'));
    };
})(Parser.prototype.StartDeclaration);

// Assertion: "assert"! NodeList "->"! NodeSet ";"! -> Assertion;
(function($default) {
    var $cache;
    
    Parser.prototype.Assertion = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("assert"), $.Value("assert"))), this.NodeList()), $.Ignore($.Or($.Literal("->"), $.Value("->")))), this.NodeSet()), $.Ignore($.Or($.Literal(";"), $.Value(";")))), Assertion);
        }.bind(this), 'Assertion'));
    };
})(Parser.prototype.Assertion);

// NodeList: List | Term;
(function($default) {
    var $cache;
    
    Parser.prototype.NodeList = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or(this.List(), this.Term());
        }.bind(this), 'NodeList'));
    };
})(Parser.prototype.NodeList);

// List: "("! (Node (","! Node)*)? ")"! -> List;
(function($default) {
    var $cache;
    
    Parser.prototype.List = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Or($.Literal("("), $.Value("("))), $.Maybe($.Seq(this.Node(), $.Any($.Seq($.Ignore($.Or($.Literal(","), $.Value(","))), this.Node()))))), $.Ignore($.Or($.Literal(")"), $.Value(")")))), List);
        }.bind(this), 'List'));
    };
})(Parser.prototype.List);

// Term: @LITERAL -> Term;
(function($default) {
    var $cache;
    
    Parser.prototype.Term = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Type(LITERAL), Term);
        }.bind(this), 'Term'));
    };
})(Parser.prototype.Term);

// NodeSet: "{"! (NodeList (","! NodeList)*)? "}"! -> Set | NodeList -> Set;
(function($default) {
    var $cache;
    
    Parser.prototype.NodeSet = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq($.Ignore($.Or($.Literal("{"), $.Value("{"))), $.Maybe($.Seq(this.NodeList(), $.Any($.Seq($.Ignore($.Or($.Literal(","), $.Value(","))), this.NodeList()))))), $.Ignore($.Or($.Literal("}"), $.Value("}")))), Set), $.Red(this.NodeList(), Set));
        }.bind(this), 'NodeSet'));
    };
})(Parser.prototype.NodeSet);

// Node: @ID List -> Node | NodeList;
(function($default) {
    var $cache;
    
    Parser.prototype.Node = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Type(ID), this.List()), Node), this.NodeList());
        }.bind(this), 'Node'));
    };
})(Parser.prototype.Node);
