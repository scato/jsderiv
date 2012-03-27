var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {ID, CLASS, LITERAL} from .lexer;
var ID      = require('./lexer').ID,
    CLASS   = require('./lexer').CLASS,
    LITERAL = require('./lexer').LITERAL;

// export constructor Module, Import, Export, Constructor, Grammar, Start, Rule, Augmentation;
var Module       = exports.Module       = g.Cons("Module");
var Import       = exports.Import       = g.Cons("Import");
var Export       = exports.Export       = g.Cons("Export");
var Constructor  = exports.Constructor  = g.Cons("Constructor");
var Grammar      = exports.Grammar      = g.Cons("Grammar");
var Start        = exports.Start        = g.Cons("Start");
var Rule         = exports.Rule         = g.Cons("Rule");
var Augmentation = exports.Augmentation = g.Cons("Augmentation");

// export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, InstanceOf, One, Ref, Class, Literal, Default, Super, Capture;
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
var Default    = exports.Default    = g.Cons("Default");
var Super      = exports.Super      = g.Cons("Super");
var Capture    = exports.Capture    = g.Cons("Capture");

// export grammar Parser;
var Parser = exports.Parser = function() {};

// start Statement* -> Module;
(function() {
    var $cache;
    
    exports.Parser.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Any(this.Statement()), Module);
        }.bind(this), 'start'));
    };
})();

// Statement: Import | Export | Definition | Augmentation;
(function() {
    var $cache;
    
    exports.Parser.prototype.Statement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.Import(), this.Export()), this.Definition()), this.Augmentation());
        }.bind(this), 'Statement'));
    };
})();

// Import: "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import;
(function() {
    var $cache;
    
    exports.Parser.prototype.Import = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("import")), this.IdentifierList()), c.Ignore(g.Literal("from"))), this.ModuleIdentifier()), c.Ignore(g.Literal(";"))), Import);
        }.bind(this), 'Import'));
    };
})();

// IdentifierList: "{"! @ID (":"! @ID)? (","! @ID (":"! @ID)?)* "}"! -> List | @ID (","! @ID)* -> List;
(function() {
    var $cache;
    
    exports.Parser.prototype.IdentifierList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("{")), g.InstanceOf(ID)), c.Maybe(c.Seq(c.Ignore(g.Literal(":")), g.InstanceOf(ID)))), c.Any(c.Seq(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)), c.Maybe(c.Seq(c.Ignore(g.Literal(":")), g.InstanceOf(ID)))))), c.Ignore(g.Literal("}"))), List), c.Red(c.Seq(g.InstanceOf(ID), c.Any(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)))), List));
        }.bind(this), 'IdentifierList'));
    };
})();

// ModuleIdentifier: "."* (@ID | @LITERAL) ("." (@ID | @LITERAL))* -> Text;
(function() {
    var $cache;
    
    exports.Parser.prototype.ModuleIdentifier = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Any(g.Literal(".")), c.Or(g.InstanceOf(ID), g.InstanceOf(LITERAL))), c.Any(c.Seq(g.Literal("."), c.Or(g.InstanceOf(ID), g.InstanceOf(LITERAL))))), Text);
        }.bind(this), 'ModuleIdentifier'));
    };
})();

// Export: "export"! Definition -> Export;
(function() {
    var $cache;
    
    exports.Parser.prototype.Export = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Ignore(g.Literal("export")), this.Definition()), Export);
        }.bind(this), 'Export'));
    };
})();

// Definition: Constructor | Grammar;
(function() {
    var $cache;
    
    exports.Parser.prototype.Definition = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.Constructor(), this.Grammar());
        }.bind(this), 'Definition'));
    };
})();

// Constructor: "constructor"! @ID (","! @ID)* ";"! -> Constructor;
(function() {
    var $cache;
    
    exports.Parser.prototype.Constructor = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("constructor")), g.InstanceOf(ID)), c.Any(c.Seq(c.Ignore(g.Literal(",")), g.InstanceOf(ID)))), c.Ignore(g.Literal(";"))), Constructor);
        }.bind(this), 'Constructor'));
    };
})();

// Grammar: "grammar"! @ID ("extends"! @ID)? "{"! (Rule* -> List) "}"! -> Grammar;
(function() {
    var $cache;
    
    exports.Parser.prototype.Grammar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("grammar")), g.InstanceOf(ID)), c.Maybe(c.Seq(c.Ignore(g.Literal("extends")), g.InstanceOf(ID)))), c.Ignore(g.Literal("{"))), c.Red(c.Any(this.Rule()), List)), c.Ignore(g.Literal("}"))), Grammar);
        }.bind(this), 'Grammar'));
    };
})();

// Rule: "start"! Expression ";"! -> Start | @ID ":"! Expression ";"! -> Rule;
(function() {
    var $cache;
    
    exports.Parser.prototype.Rule = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("start")), this.Expression()), c.Ignore(g.Literal(";"))), Start), c.Red(c.Seq(c.Seq(c.Seq(g.InstanceOf(ID), c.Ignore(g.Literal(":"))), this.Expression()), c.Ignore(g.Literal(";"))), Rule));
        }.bind(this), 'Rule'));
    };
})();

// Augmentation: "augment"! "grammar"! @ID "{"! (Rule* -> List) "}"! -> Augmentation;
(function() {
    var $cache;
    
    exports.Parser.prototype.Augmentation = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("augment")), c.Ignore(g.Literal("grammar"))), g.InstanceOf(ID)), c.Ignore(g.Literal("{"))), c.Red(c.Any(this.Rule()), List)), c.Ignore(g.Literal("}"))), Augmentation);
        }.bind(this), 'Augmentation'));
    };
})();

// Expression: OrExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.Expression = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.OrExpr();
        }.bind(this), 'Expression'));
    };
})();

// OrExpr: OrExpr "|"! RedExpr -> Or | RedExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.OrExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(this.OrExpr(), c.Ignore(g.Literal("|"))), this.RedExpr()), Or), this.RedExpr());
        }.bind(this), 'OrExpr'));
    };
})();

// RedExpr: RedExpr "->"! @ID -> Red | AndExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.RedExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(this.RedExpr(), c.Ignore(g.Literal("->"))), g.InstanceOf(ID)), Red), this.AndExpr());
        }.bind(this), 'RedExpr'));
    };
})();

// AndExpr: AndExpr "&"! SeqExpr -> And | SeqExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.AndExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(this.AndExpr(), c.Ignore(g.Literal("&"))), this.SeqExpr()), And), this.SeqExpr());
        }.bind(this), 'AndExpr'));
    };
})();

// SeqExpr: SeqExpr RightExpr -> Seq | RightExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.SeqExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(this.SeqExpr(), this.RightExpr()), Seq), this.RightExpr());
        }.bind(this), 'SeqExpr'));
    };
})();

// RightExpr: RightExpr "*"! -> Any | RightExpr "+"! -> Many | RightExpr "?"! -> Maybe | RightExpr "!"! -> Ignore | LeftExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.RightExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("*"))), Any), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("+"))), Many)), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("?"))), Maybe)), c.Red(c.Seq(this.RightExpr(), c.Ignore(g.Literal("!"))), Ignore)), this.LeftExpr());
        }.bind(this), 'RightExpr'));
    };
})();

// LeftExpr: "~"! LeftExpr -> Not | "?="! LeftExpr -> Look | Terminal;
(function() {
    var $cache;
    
    exports.Parser.prototype.LeftExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Red(c.Seq(c.Ignore(g.Literal("~")), this.LeftExpr()), Not), c.Red(c.Seq(c.Ignore(g.Literal("?=")), this.LeftExpr()), Look)), this.Terminal());
        }.bind(this), 'LeftExpr'));
    };
})();

// Terminal: "("! Expression ")"! | "<"! Expression ">"! -> Capture | "@"! @ID -> InstanceOf | "."! -> One | @ID -> Ref | @CLASS -> Class | @LITERAL -> Literal | "default"! -> Default | "super"! -> Super;
(function() {
    var $cache;
    
    exports.Parser.prototype.Terminal = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Seq(c.Seq(c.Ignore(g.Literal("(")), this.Expression()), c.Ignore(g.Literal(")"))), c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("<")), this.Expression()), c.Ignore(g.Literal(">"))), Capture)), c.Red(c.Seq(c.Ignore(g.Literal("@")), g.InstanceOf(ID)), InstanceOf)), c.Red(c.Ignore(g.Literal(".")), One)), c.Red(g.InstanceOf(ID), Ref)), c.Red(g.InstanceOf(CLASS), Class)), c.Red(g.InstanceOf(LITERAL), Literal)), c.Red(c.Ignore(g.Literal("default")), Default)), c.Red(c.Ignore(g.Literal("super")), Super));
        }.bind(this), 'Terminal'));
    };
})();
