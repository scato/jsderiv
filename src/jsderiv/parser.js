var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {ID, CLASS, LITERAL} from .lexer;
var ID      = require('./lexer').ID,
    CLASS   = require('./lexer').CLASS,
    LITERAL = require('./lexer').LITERAL;

// export constructor Module, Import, Export, Constructor, Grammar, Start, Rule;
var Module      = exports.Module      = g.Cons("Module"),
    Import      = exports.Import      = g.Cons("Import"),
    Export      = exports.Export      = g.Cons("Export"),
    Constructor = exports.Constructor = g.Cons("Constructor"),
    Grammar     = exports.Grammar     = g.Cons("Grammar"),
    Start       = exports.Start       = g.Cons("Start"),
    Rule        = exports.Rule        = g.Cons("Rule");

// export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, InstanceOf, Ref, One, Class, Literal;
var Or         = exports.Or         = g.Cons("Or"),
    Red        = exports.Red        = g.Cons("Red"),
    And        = exports.And        = g.Cons("And"),
    Seq        = exports.Seq        = g.Cons("Seq"),
    Any        = exports.Any        = g.Cons("Any"),
    Many       = exports.Many       = g.Cons("Many"),
    Maybe      = exports.Maybe      = g.Cons("Maybe"),
    Ignore     = exports.Ignore     = g.Cons("Ignore"),
    Not        = exports.Not        = g.Cons("Not"),
    Look       = exports.Look       = g.Cons("Look"),
    InstanceOf = exports.InstanceOf = g.Cons("InstanceOf"),
    One        = exports.One        = g.Cons("One"),
    Ref        = exports.Ref        = g.Cons("Ref"),
    Class      = exports.Class      = g.Cons("Class"),
    Literal    = exports.Literal    = g.Cons("Literal");

var Parser = exports.Parser = function() {};

// start Statement* -> Module ;
Parser.prototype.start = function() {
    return /*this._start = this._start || g.Ref(function() {
        return*/ c.Red(c.Any(this.Statement()), Module)/*;
    }.bind(this), 'start')*/;
};

// Statement       : Import | Export | Definition ;
Parser.prototype.Statement = function() {
    return this._Statement = this._Statement || g.Ref(function() {
        return c.Or(c.Or(this.Import(), this.Export()), this.Definition());
    }.bind(this), 'Statement');
};

// Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
Parser.prototype.Import = function() {
    return this._Import = this._Import || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(
            c.Ignore(g.Literal("import")),
            this.IdentifierList()),
            c.Ignore(g.Literal("from"))),
            this.ModuleIdentifier()),
            c.Ignore(g.Literal(";"))
        ), Import);
    }.bind(this), 'Import');
};

// Export          : "export"! Definition -> Export ;
Parser.prototype.Export = function() {
    return this._Export = this._Export || g.Ref(function() {
        return c.Red(c.Seq(
            c.Ignore(g.Literal("export")),
            this.Definition()
        ), Export);
    }.bind(this), 'Export');
};

// Definition      : Constructor | Grammar ;
Parser.prototype.Definition = function() {
    return this._Definition = this._Definition || g.Ref(function() {
        return c.Or(this.Constructor(), this.Grammar());
    }.bind(this), 'Definition');
};

// Constructor     : "constructor"! @ID (","! @ID)* ";"! -> Constructor ;
Parser.prototype.Constructor = function() {
    return this._Constructor = this._Constructor || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(
            c.Ignore(g.Literal("constructor")),
            g.InstanceOf(ID)),
            c.Any(c.Seq(
                c.Ignore(g.Literal(",")),
                g.InstanceOf(ID)
            ))),
            c.Ignore(g.Literal(";"))
        ), Constructor);
    }.bind(this), 'Constructor');
};

// Grammar         : "grammar"! @ID "{"! (Rule* -> List) "}"! -> Grammar ;
Parser.prototype.Grammar = function() {
    return this._Grammar = this._Grammar || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(
            c.Ignore(g.Literal("grammar")),
            g.InstanceOf(ID)),
            c.Ignore(g.Literal("{"))),
            c.Red(c.Any(this.Rule()), List)),
            c.Ignore(g.Literal("}"))
        ), Grammar);
    }.bind(this), 'Grammar');
};

// Rule            : "start"! Expression ";"! -> Start
//                 | @ID ":"! Expression ";"! -> Rule ;
Parser.prototype.Rule = function() {
    return this._Rule = this._Rule || g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("start")), this.Expression()), c.Ignore(g.Literal(";"))), Start),
            c.Red(c.Seq(c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal(":"))), this.Expression()), c.Ignore(g.Literal(";"))), Rule)
        );
    }.bind(this), 'Rule');
};

// IdentifierList  : "{"! @ID (","! @ID)* "}"! -> List ;
Parser.prototype.IdentifierList = function() {
    return this._IdentifierList = this._IdentifierList || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(
            c.Ignore(g.Literal("{")),
            g.InstanceOf(ID)),
            c.Any(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)))),
            c.Ignore(g.Literal("}"))
        ), List);
    }.bind(this), 'IdentifierList');
};

// ModuleIdentifier: "."* @ID ("." @ID)* -> Text ;
Parser.prototype.ModuleIdentifier = function() {
    return this._ModuleIdentifier = this._ModuleIdentifier || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(
            g.Literal("."),
            g.InstanceOf(ID)),
            c.Any(c.Seq(g.Literal("."), g.InstanceOf(ID)))
        ), Text);
    }.bind(this), 'ModuleIdentifier');
};

// Expression  : OrExpr ;
Parser.prototype.Expression = function() {
    return this._Expression = this._Expression || g.Ref(function() {
        return this.OrExpr();
    }.bind(this), 'Expression');
};

// OrExpr      : OrExpr "|"! RedExpr -> Or
//             | RedExpr ;
Parser.prototype.OrExpr = function() {
    return this._OrExpr = this._OrExpr || g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(c.Seq(this.OrExpr(), c.Ignore(g.Literal("|"))), this.RedExpr()), Or),
            this.RedExpr()
        );
    }.bind(this), 'OrExpr');
};

// RedExpr     : RedExpr "->"! @ID -> Red
//             | AndExpr ;
Parser.prototype.RedExpr = function() {
    return this._RedExpr = this._RedExpr || g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(c.Seq(this.RedExpr(), c.Ignore(g.Literal("->"))), g.InstanceOf(ID)), Red),
            this.AndExpr()
        );
    }.bind(this), 'RedExpr');
};

// AndExpr     : AndExpr "&"! SeqExpr -> And
//             | SeqExpr ;
Parser.prototype.AndExpr = function() {
    return this._AndExpr = this._AndExpr || g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(c.Seq(this.AndExpr(), c.Ignore(g.Literal("&"))), this.SeqExpr()), And),
            this.SeqExpr()
        );
    }.bind(this), 'AndExpr');
};

// SeqExpr     : SeqExpr RightExpr -> Seq
//             | RightExpr ;
Parser.prototype.SeqExpr = function() {
    return this._SeqExpr = this._SeqExpr || g.Ref(function() {
        return c.Or(
            c.Red(c.Seq(this.SeqExpr(), this.RightExpr()), Seq),
            this.RightExpr()
        );
    }.bind(this), 'SeqExpr');
};

// RightExpr   : RightExpr "*"! -> Any
//             | RightExpr "+"! -> Many
//             | RightExpr "?"! -> Maybe
//             | RightExpr "!"! -> Ignore
//             | LeftExpr ;
Parser.prototype.RightExpr = function() {
    return this._RightExpr = this._RightExpr || g.Ref(function() {
        return c.Or(c.Or(c.Or(c.Or(
            c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("*"))), Any),
            c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("+"))), Many)),
            c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("?"))), Maybe)),
            c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("!"))), Ignore)),
            this.LeftExpr()
        );
    }.bind(this), 'RightExpr');
};

// LeftExpr    : "~"! LeftExpr -> Not
//             | "?="! LeftExpr -> Look
//             | Terminal ;
Parser.prototype.LeftExpr = function() {
    return this._LeftExpr = this._LeftExpr || g.Ref(function() {
        return c.Or(c.Or(
            c.Red(c.Seq(c.Ignore(g.Literal("~")), this.LeftExpr()), Not),
            c.Red(c.Seq(c.Ignore(g.Literal("?=")), this.LeftExpr()), Look)),
            this.Terminal()
        );
    }.bind(this), 'LeftExpr');
};

// Terminal    : "("! Expression ")"!
//             | "@"! @ID -> InstanceOf
//             | "."! -> One
//             | @ID -> Ref
//             | @CLASS -> Class
//             | @LITERAL -> Literal ;
Parser.prototype.Terminal = function() {
    return this._Terminal = this._Terminal || g.Ref(function() {
        return c.Or(c.Or(c.Or(c.Or(c.Or(
            c.Seq(c.Seq(c.Ignore(g.Literal("(")), this.Expression()), c.Ignore(g.Literal(")"))),
            c.Red(c.Seq(c.Ignore(g.Literal("@")), g.InstanceOf(ID)), InstanceOf)),
            c.Red(c.Ignore(g.Literal(".")), One)),
            c.Red(g.InstanceOf(ID), Ref)),
            c.Red(g.InstanceOf(CLASS), Class)),
            c.Red(g.InstanceOf(LITERAL), Literal)
        );
    }.bind(this), 'Terminal');
};
