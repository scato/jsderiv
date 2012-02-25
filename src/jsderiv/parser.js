var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {ID, CLASS, LITERAL} from .lexer;
var ID      = require('./lexer').ID,
    CLASS   = require('./lexer').CLASS,
    LITERAL = require('./lexer').LITERAL;

var Module      = exports.Module      = g.Cons("Module");
var Import      = exports.Import      = g.Cons("Import");
var Export      = exports.Export      = g.Cons("Export");
var Constructor = exports.Constructor = g.Cons("Constructor");
var Grammar     = exports.Grammar     = g.Cons("Grammar");
var Start       = exports.Start       = g.Cons("Start");
var Rule        = exports.Rule        = g.Cons("Rule");

var Or         = exports.Or         = g.Cons("Or");
var Red        = exports.Red        = g.Cons("Red");
var And        = exports.And        = g.Cons("And");
var Seq        = exports.Seq        = g.Cons("Seq");
var Any        = exports.Any        = g.Cons("Any");
var Many       = exports.Many       = g.Cons("Many");
var Maybe      = exports.Maybe      = g.Cons("Maybe");
var Ignore     = exports.Ignore     = g.Cons("Ignore");
var Not        = exports.Not        = g.Cons("Not");
var Look       = exports.Look       = g.Cons("Look");
var InstanceOf = exports.InstanceOf = g.Cons("InstanceOf");
var One        = exports.One        = g.Cons("One");
var Ref        = exports.Ref        = g.Cons("Ref");
var Class      = exports.Class      = g.Cons("Class");
var Literal    = exports.Literal    = g.Cons("Literal");

var Parser = exports.Parser = function() {};

// start Statement* -> Module;
exports.Parser.prototype.start = function() {
    return this._start = this._start || g.Ref(function() {
        return c.Red(c.Any(this.Statement()), Module);
    }.bind(this), 'start');
};

// Statement: Import | Export | Definition;
exports.Parser.prototype.Statement = function() {
    return this._Statement = this._Statement || g.Ref(function() {
        return c.Or(c.Or(this.Import(), this.Export()), this.Definition());
    }.bind(this), 'Statement');
};

// Import: "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import;
exports.Parser.prototype.Import = function() {
    return this._Import = this._Import || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("import")), this.IdentifierList()), c.Ignore(g.Literal("from"))), this.ModuleIdentifier()), c.Ignore(g.Literal(";"))), Import);
    }.bind(this), 'Import');
};

// Export: "export"! Definition -> Export;
exports.Parser.prototype.Export = function() {
    return this._Export = this._Export || g.Ref(function() {
        return c.Red(c.Seq(c.Ignore(g.Literal("export")), this.Definition()), Export);
    }.bind(this), 'Export');
};

// Definition: Constructor | Grammar;
exports.Parser.prototype.Definition = function() {
    return this._Definition = this._Definition || g.Ref(function() {
        return c.Or(this.Constructor(), this.Grammar());
    }.bind(this), 'Definition');
};

// Constructor: "constructor"! @ID (","! @ID)* ";"! -> Constructor;
exports.Parser.prototype.Constructor = function() {
    return this._Constructor = this._Constructor || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("constructor")), g.InstanceOf(ID)), c.Any(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)))), c.Ignore(g.Literal(";"))), Constructor);
    }.bind(this), 'Constructor');
};

// Grammar: "grammar"! @ID "{"! (Rule* -> List) "}"! -> Grammar;
exports.Parser.prototype.Grammar = function() {
    return this._Grammar = this._Grammar || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("grammar")), g.InstanceOf(ID)), c.Ignore(g.Literal("{"))), c.Red(c.Any(this.Rule()), List)), c.Ignore(g.Literal("}"))), Grammar);
    }.bind(this), 'Grammar');
};

// Rule: "start"! Expression ";"! -> Start | @ID ":"! Expression ";"! -> Rule;
exports.Parser.prototype.Rule = function() {
    return this._Rule = this._Rule || g.Ref(function() {
        return c.Or(c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("start")), this.Expression()), c.Ignore(g.Literal(";"))), Start), c.Red(c.Seq(c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal(":"))), this.Expression()), c.Ignore(g.Literal(";"))), Rule));
    }.bind(this), 'Rule');
};

// IdentifierList: "{"! @ID (","! @ID)* "}"! -> List;
exports.Parser.prototype.IdentifierList = function() {
    return this._IdentifierList = this._IdentifierList || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("{")), g.InstanceOf(ID)), c.Any(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)))), c.Ignore(g.Literal("}"))), List);
    }.bind(this), 'IdentifierList');
};

// ModuleIdentifier: "."* @ID ("." @ID)* -> Text;
exports.Parser.prototype.ModuleIdentifier = function() {
    return this._ModuleIdentifier = this._ModuleIdentifier || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Any(g.Literal(".")), g.InstanceOf(ID)), c.Any(c.Seq(g.Literal("."), g.InstanceOf(ID)))), Text);
    }.bind(this), 'ModuleIdentifier');
};

// Expression: OrExpr;
exports.Parser.prototype.Expression = function() {
    return this._Expression = this._Expression || g.Ref(function() {
        return this.OrExpr();
    }.bind(this), 'Expression');
};

// OrExpr: OrExpr "|"! RedExpr -> Or | RedExpr;
exports.Parser.prototype.OrExpr = function() {
    return this._OrExpr = this._OrExpr || g.Ref(function() {
        return c.Or(c.Red(c.Seq(c.Seq(this.OrExpr(), c.Ignore(g.Literal("|"))), this.RedExpr()), Or), this.RedExpr());
    }.bind(this), 'OrExpr');
};

// RedExpr: RedExpr "->"! @ID -> Red | AndExpr;
exports.Parser.prototype.RedExpr = function() {
    return this._RedExpr = this._RedExpr || g.Ref(function() {
        return c.Or(c.Red(c.Seq(c.Seq(this.RedExpr(), c.Ignore(g.Literal("->"))), g.InstanceOf(ID)), Red), this.AndExpr());
    }.bind(this), 'RedExpr');
};

// AndExpr: AndExpr "&"! SeqExpr -> And | SeqExpr;
exports.Parser.prototype.AndExpr = function() {
    return this._AndExpr = this._AndExpr || g.Ref(function() {
        return c.Or(c.Red(c.Seq(c.Seq(this.AndExpr(), c.Ignore(g.Literal("&"))), this.SeqExpr()), And), this.SeqExpr());
    }.bind(this), 'AndExpr');
};

// SeqExpr: SeqExpr RightExpr -> Seq | RightExpr;
exports.Parser.prototype.SeqExpr = function() {
    return this._SeqExpr = this._SeqExpr || g.Ref(function() {
        return c.Or(c.Red(c.Seq(this.SeqExpr(), this.RightExpr()), Seq), this.RightExpr());
    }.bind(this), 'SeqExpr');
};

// RightExpr: RightExpr "*"! -> Any | RightExpr "+"! -> Many | RightExpr "?"! -> Maybe | RightExpr "!"! -> Ignore | LeftExpr;
exports.Parser.prototype.RightExpr = function() {
    return this._RightExpr = this._RightExpr || g.Ref(function() {
        return c.Or(c.Or(c.Or(c.Or(c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("*"))), Any), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("+"))), Many)), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("?"))), Maybe)), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("!"))), Ignore)), this.LeftExpr());
    }.bind(this), 'RightExpr');
};

// LeftExpr: "~"! LeftExpr -> Not | "?="! LeftExpr -> Look | Terminal;
exports.Parser.prototype.LeftExpr = function() {
    return this._LeftExpr = this._LeftExpr || g.Ref(function() {
        return c.Or(c.Or(c.Red(c.Seq(c.Ignore(g.Literal("~")), this.LeftExpr()), Not), c.Red(c.Seq(c.Ignore(g.Literal("?=")), this.LeftExpr()), Look)), this.Terminal());
    }.bind(this), 'LeftExpr');
};

// Terminal: "("! Expression ")"! | "@"! @ID -> InstanceOf | "."! -> One | @ID -> Ref | @CLASS -> Class | @LITERAL -> Literal;
exports.Parser.prototype.Terminal = function() {
    return this._Terminal = this._Terminal || g.Ref(function() {
        return c.Or(c.Or(c.Or(c.Or(c.Or(c.Seq(c.Seq(c.Ignore(g.Literal("(")), this.Expression()), c.Ignore(g.Literal(")"))), c.Red(c.Seq(c.Ignore(g.Literal("@")), g.InstanceOf(ID)), InstanceOf)), c.Red(c.Ignore(g.Literal(".")), One)), c.Red(g.InstanceOf(ID), Ref)), c.Red(g.InstanceOf(CLASS), Class)), c.Red(g.InstanceOf(LITERAL), Literal));
    }.bind(this), 'Terminal');
};
