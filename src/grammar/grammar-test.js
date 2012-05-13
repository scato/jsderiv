var $ = require('../jsderiv');

// import {Lexer, Parser, ID, QID, LITERAL, KEYWORD} from ...src."grammar"."grammar";
var Lexer   = require("./../../src/grammar/grammar").Lexer,
    Parser  = require("./../../src/grammar/grammar").Parser,
    ID      = require("./../../src/grammar/grammar").ID,
    QID     = require("./../../src/grammar/grammar").QID,
    LITERAL = require("./../../src/grammar/grammar").LITERAL,
    KEYWORD = require("./../../src/grammar/grammar").KEYWORD;

// KEYWORD: default | <"test" | "assert"> ?= ~ [A-Za-z0-9_\-] -> KEYWORD;
(function($default) {
    Lexer.prototype.KEYWORD = function() {
        return this._KEYWORD_1be4ac1f || (this._KEYWORD_1be4ac1f = $.Ref(function() {
            return $.Or($default.apply(this, []).resolve(), $.Red($.Seq($.Capture($.Or($.Literal("test"), $.Literal("assert"))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-"))))), KEYWORD));
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
    Parser.prototype.Definition = function() {
        return this._Definition_7979336b || (this._Definition_7979336b = $.Ref(function() {
            return $.Or($default.apply(this, []).resolve(), this.Test());
        }.bind(this), 'Definition'));
    };
})(Parser.prototype.Definition);

// Test: @"test"! @LITERAL @"{"! StartDeclaration <Assertion*> @"}"! -> Test;
(function($default) {
    Parser.prototype.Test = function() {
        return this._Test_52564daf || (this._Test_52564daf = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("test")), $.Type(LITERAL)), $.Ignore($.Value("{"))), this.StartDeclaration()), $.Capture($.Any(this.Assertion()))), $.Ignore($.Value("}"))), Test);
        }.bind(this), 'Test'));
    };
})(Parser.prototype.Test);

// StartDeclaration: @"start"! (@ID | @QID) @";"! -> StartDeclaration;
(function($default) {
    Parser.prototype.StartDeclaration = function() {
        return this._StartDeclaration_7b7557d4 || (this._StartDeclaration_7b7557d4 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Value("start")), $.Or($.Type(ID), $.Type(QID))), $.Ignore($.Value(";"))), StartDeclaration);
        }.bind(this), 'StartDeclaration'));
    };
})(Parser.prototype.StartDeclaration);

// Assertion: @"assert"! NodeList @"->"! NodeSet @";"! -> Assertion;
(function($default) {
    Parser.prototype.Assertion = function() {
        return this._Assertion_24c7dce2 || (this._Assertion_24c7dce2 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("assert")), this.NodeList()), $.Ignore($.Value("->"))), this.NodeSet()), $.Ignore($.Value(";"))), Assertion);
        }.bind(this), 'Assertion'));
    };
})(Parser.prototype.Assertion);

// NodeList: List | Term;
(function($default) {
    Parser.prototype.NodeList = function() {
        return this._NodeList_7aea58ae || (this._NodeList_7aea58ae = $.Ref(function() {
            return $.Or(this.List(), this.Term());
        }.bind(this), 'NodeList'));
    };
})(Parser.prototype.NodeList);

// List: @"("! (Node (@","! Node)*)? @")"! -> List;
(function($default) {
    Parser.prototype.List = function() {
        return this._List_2998c0c6 || (this._List_2998c0c6 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Ignore($.Value("(")), $.Maybe($.Seq(this.Node(), $.Any($.Seq($.Ignore($.Value(",")), this.Node()))))), $.Ignore($.Value(")"))), List);
        }.bind(this), 'List'));
    };
})(Parser.prototype.List);

// Term: @LITERAL -> Term;
(function($default) {
    Parser.prototype.Term = function() {
        return this._Term_40464aca || (this._Term_40464aca = $.Ref(function() {
            return $.Red($.Type(LITERAL), Term);
        }.bind(this), 'Term'));
    };
})(Parser.prototype.Term);

// NodeSet: @"{"! (NodeList (@","! NodeList)*)? @"}"! -> Set | NodeList -> Set;
(function($default) {
    Parser.prototype.NodeSet = function() {
        return this._NodeSet_50ffc26e || (this._NodeSet_50ffc26e = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq($.Ignore($.Value("{")), $.Maybe($.Seq(this.NodeList(), $.Any($.Seq($.Ignore($.Value(",")), this.NodeList()))))), $.Ignore($.Value("}"))), Set), $.Red(this.NodeList(), Set));
        }.bind(this), 'NodeSet'));
    };
})(Parser.prototype.NodeSet);

// Node: @ID List -> Node | NodeList;
(function($default) {
    Parser.prototype.Node = function() {
        return this._Node_7405dfd0 || (this._Node_7405dfd0 = $.Ref(function() {
            return $.Or($.Red($.Seq($.Type(ID), this.List()), Node), this.NodeList());
        }.bind(this), 'Node'));
    };
})(Parser.prototype.Node);
