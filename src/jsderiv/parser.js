var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

// import {ID, CLASS, LITERAL} from .lexer;
var ID      = require('./lexer').ID,
    CLASS   = require('./lexer').CLASS,
    LITERAL = require('./lexer').LITERAL;

// export constructor Module, Import, Export, Grammar, Start, Rule;
var Module  = exports.Module  = g.Cons("Module"),
    Import  = exports.Import  = g.Cons("Import"),
    Export  = exports.Export  = g.Cons("Export"),
    Grammar = exports.Grammar = g.Cons("Grammar"),
    Start   = exports.Start   = g.Cons("Start"),
    Rule    = exports.Rule    = g.Cons("Rule");

// export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, InstanceOf, Ref, Class, Literal;
var Or         = exports.Or         = g.Cons("Or"),
    Red        = exports.Red        = g.Cons("Red"),
    And        = exports.And        = g.Cons("And"),
    Seq        = exports.Seq        = g.Cons("Seq"),
    Any        = exports.Any        = g.Cons("Any"),
    Many       = exports.Many       = g.Cons("Many"),
    Maybe      = exports.Maybe      = g.Cons("Maybe"),
    Ignore     = exports.Ignore     = g.Cons("Ignore"),
    Not        = exports.Not        = g.Cons("Not"),
    InstanceOf = exports.InstanceOf = g.Cons("InstanceOf"),
    Ref        = exports.Ref        = g.Cons("Ref"),
    Class      = exports.Class      = g.Cons("Class"),
    Literal    = exports.Literal    = g.Cons("Literal");

var Grammar = exports.Grammar = function() {};

// start Statement* -> Module ;

// Statement       : Import | Export | Definition ;
// Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
// Export          : "export"! Definition -> Export ;
// Definition      : Grammar ;
// Grammar         : "grammar"! @ID ";"! Definition* -> Grammar ;

// Rule            : "start"! Expression ";"! -> Start
//                 | @ID ":"! Expression ";"! -> Rule ;
Grammar.prototype.Rule = function() {
    return g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("start")), this.Expression()), c.Ignore(g.Literal(";"))), Start),
            c.Red(c.Seq(c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal(":"))), this.Expression()), c.Ignore(g.Literal(";"))), Rule)
        );
    }.bind(this));
};

// IdentifierList  : "{"! @ID (","! @ID)* "}"! ;
// ModuleIdentifier: "."* @ID ("." @ID)* ;

// Expression  : OrExpr ;
Grammar.prototype.Expression = function() {
    // debug
    return this.Terminal();
    
    return g.Ref(function() {
        return this.OrExpr();
    }.bind(this));
};

// OrExpr      : OrExpr "|" RedExpr -> Or
//             | RedExpr ;
// RedExpr     : AndExpr "->" @ID -> Red
//             | AndExpr ;
// AndExpr     : AndExpr "&" SeqExpr -> And
//             | SeqExpr ;
// SeqExpr     : SeqExpr RightExpr -> Seq
//             | RightExpr ;
// RightExpr   : LeftExpr "*" -> Any
//             | LeftExpr "+" -> Many
//             | LeftExpr "?" -> Maybe
//             | LeftExpr "!" -> Ignore
//             | LeftExpr ;
// LeftExpr    : "~" Terminal -> Not
//             | "@" @ID -> InstanceOf
//             | Terminal ;

// Terminal    : "(" Expression ")"
//             | @ID -> Ref
//             | @CLASS -> Class
//             | @LITERAL -> Literal ;
Grammar.prototype.Terminal = function() {
    return this._Terminal = this._Terminal || g.Ref(function() {
        return c.Or(c.Or(c.Or(
            c.Seq(c.Seq(g.Literal("("), this.Expression()), g.Literal(")")),
            c.Red(g.InstanceOf(ID), Ref)),
            c.Red(g.InstanceOf(CLASS), Class)),
            c.Red(g.InstanceOf(LITERAL), Literal)
        );
    }.bind(this));
};
