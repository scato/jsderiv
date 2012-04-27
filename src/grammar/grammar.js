var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

g.Cons = function(id) { return g.Node.define(id); };
var defaultRed = c.Red;
c.Red = function(expr, lambda) { return c.Capture(defaultRed(c.Capture(expr), lambda)); };
g.InstanceOf = g.Type;
g.List = function() { return arguments[0]; };
var Release = function() { return arguments[0][0]; };
g.Text = function() { return Array.prototype.join.apply(arguments[0], ['']); };
var defaultLiteral = g.Literal;
g.Literal = function(string) { return c.Or(defaultLiteral(string), g.Value(string)); };

var List = g.List,
    Text = g.Text;

// export constructor Class, Char, Control, Unicode, Range, Category, Not;
var Class    = exports.Class    = g.Cons("Class");
var Char     = exports.Char     = g.Cons("Char");
var Control  = exports.Control  = g.Cons("Control");
var Unicode  = exports.Unicode  = g.Cons("Unicode");
var Range    = exports.Range    = g.Cons("Range");
var Category = exports.Category = g.Cons("Category");
var Not      = exports.Not      = g.Cons("Not");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// start Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.Class();
        }.bind(this), 'start'));
    };
})();

// CONTROL: ("\\t" | "\\r" | "\\n" | "\\v" | "\\f") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CONTROL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(g.Literal("\\t"), g.Literal("\\r")), g.Literal("\\n")), g.Literal("\\v")), g.Literal("\\f")), Text);
        }.bind(this), 'CONTROL'));
    };
})();

// UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.UNICODE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("\\u"), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), Text);
        }.bind(this), 'UNICODE'));
    };
})();

// CHAR: ([^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CHAR = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(c.Or(c.Or(g.Char("^"), g.Char("-")), g.Char("\\")), g.Char("]")))), g.Literal("\\^")), g.Literal("\\-")), g.Literal("\\\\")), g.Literal("\\]")), Text);
        }.bind(this), 'CHAR'));
    };
})();

// CATEGORY: ("\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}") -> Text;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.CATEGORY = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\\d"), g.Literal("\\D")), g.Literal("\\s")), g.Literal("\\S")), g.Literal("\\w")), g.Literal("\\W")), c.Seq(c.Seq(g.Literal("\\p{"), c.Any(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}"))), c.Seq(c.Seq(g.Literal("\\P{"), c.Many(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}"))), Text);
        }.bind(this), 'CATEGORY'));
    };
})();

// Range: (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Range = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Or(this.CHAR(), this.UNICODE()), c.Ignore(g.Literal("-"))), c.Or(this.CHAR(), this.UNICODE())), Range);
        }.bind(this), 'Range'));
    };
})();

// Category: CATEGORY -> Category;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Category = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(this.CATEGORY(), Category);
        }.bind(this), 'Category'));
    };
})();

// Char: Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Char = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.Category(), c.Red(this.CHAR(), Char)), c.Red(this.CONTROL(), Control)), c.Red(this.UNICODE(), Unicode));
        }.bind(this), 'Char'));
    };
})();

// Class: "["! ((Range | Char)* -> List) ("^"! (Range | Char)+ -> Not)? "]"! -> Class;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Class = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("[")), c.Red(c.Any(c.Or(this.Range(), this.Char())), List)), c.Maybe(c.Red(c.Seq(c.Ignore(g.Literal("^")), c.Many(c.Or(this.Range(), this.Char()))), Not))), c.Ignore(g.Literal("]"))), Class);
        }.bind(this), 'Class'));
    };
})();

var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

var List = g.List,
    Text = g.Text;

// export constructor ID, LITERAL, SYMBOL, CLASS, KEYWORD;
var ID      = exports.ID      = g.Cons("ID");
var LITERAL = exports.LITERAL = g.Cons("LITERAL");
var SYMBOL  = exports.SYMBOL  = g.Cons("SYMBOL");
var CLASS   = exports.CLASS   = g.Cons("CLASS");
var KEYWORD = exports.KEYWORD = g.Cons("KEYWORD");

// export grammar Lexer;
var Lexer = exports.Lexer = function() {};

// start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
(function() {
    var $cache;
    
    exports.Lexer.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.SPACE(), this.ID()), this.COMMENT()), this.LITERAL()), this.SYMBOL()), this.CLASS()), this.KEYWORD()));
        }.bind(this), 'start'));
    };
})();

// NEWLINE: "\r\n" | "\n";
(function() {
    var $cache;
    
    exports.Lexer.prototype.NEWLINE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("\r\n"), g.Literal("\n"));
        }.bind(this), 'NEWLINE'));
    };
})();

// CONTROL: "\\t" | "\\r" | "\\n" | "\\v" | "\\f";
(function() {
    var $cache;
    
    exports.Lexer.prototype.CONTROL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(g.Literal("\\t"), g.Literal("\\r")), g.Literal("\\n")), g.Literal("\\v")), g.Literal("\\f"));
        }.bind(this), 'CONTROL'));
    };
})();

// UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F];
(function() {
    var $cache;
    
    exports.Lexer.prototype.UNICODE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("\\u"), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F"))), c.Or(c.Or(g.Range("0", "9"), g.Range("a", "f")), g.Range("A", "F")));
        }.bind(this), 'UNICODE'));
    };
})();

// SPACE: ((" " | "\t" | "\r" | "\n")+ ?= ~ (" " | "\t" | "\r" | "\n"))!;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SPACE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(c.Seq(c.Many(c.Or(c.Or(c.Or(g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))), l.Look(c.Not(c.Or(c.Or(c.Or(g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))))));
        }.bind(this), 'SPACE'));
    };
})();

// ID: [A-Za-z_] [A-Za-z0-9_]* ?= ~ [A-Za-z0-9_] & ~ KEYWORD -> ID;
(function() {
    var $cache;
    
    exports.Lexer.prototype.ID = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.And(c.Seq(c.Seq(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")), c.Any(c.Or(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Range("0", "9")), g.Char("_")))), l.Look(c.Not(c.Or(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Range("0", "9")), g.Char("_"))))), c.Not(this.KEYWORD())), ID);
        }.bind(this), 'ID'));
    };
})();

// COMMENT: ("/*" ([^*] | "*" ?= ~ "/")* "*/" | "//" ~ (.* NEWLINE .*) ?= NEWLINE)!;
(function() {
    var $cache;
    
    exports.Lexer.prototype.COMMENT = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(c.Or(c.Seq(c.Seq(g.Literal("/*"), c.Any(c.Or(c.And(g.One(), c.Not(g.Char("*"))), c.Seq(g.Literal("*"), l.Look(c.Not(g.Literal("/"))))))), g.Literal("*/")), c.Seq(c.Seq(g.Literal("//"), c.Not(c.Seq(c.Seq(c.Any(g.One()), this.NEWLINE()), c.Any(g.One())))), l.Look(this.NEWLINE()))));
        }.bind(this), 'COMMENT'));
    };
})();

// LITERAL: ("\"" ([^"\\] | "\\\\" | "\\\"" | CONTROL | UNICODE)* "\"" | '\'' ([^'\\] | '\\\\' | '\\\'' | CONTROL | UNICODE)* '\'') -> LITERAL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.LITERAL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(g.Literal("\""), c.Any(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(g.Char("\""), g.Char("\\")))), g.Literal("\\\\")), g.Literal("\\\"")), this.CONTROL()), this.UNICODE()))), g.Literal("\"")), c.Seq(c.Seq(g.Literal('\''), c.Any(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(g.Char("'"), g.Char("\\")))), g.Literal('\\\\')), g.Literal('\\\'')), this.CONTROL()), this.UNICODE()))), g.Literal('\''))), LITERAL);
        }.bind(this), 'LITERAL'));
    };
})();

// SYMBOL: (":" | ";" | "(" | ")" | "*" | "+" | "?" | "&" | "|" | "~" | "?=" | "!" | "->" | "@" | "{" | "}" | "," | "." | "<" | ">") -> SYMBOL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SYMBOL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal(":"), g.Literal(";")), g.Literal("(")), g.Literal(")")), g.Literal("*")), g.Literal("+")), g.Literal("?")), g.Literal("&")), g.Literal("|")), g.Literal("~")), g.Literal("?=")), g.Literal("!")), g.Literal("->")), g.Literal("@")), g.Literal("{")), g.Literal("}")), g.Literal(",")), g.Literal(".")), g.Literal("<")), g.Literal(">")), SYMBOL);
        }.bind(this), 'SYMBOL'));
    };
})();

// RANGE: CHAR "-" CHAR;
(function() {
    var $cache;
    
    exports.Lexer.prototype.RANGE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(this.CHAR(), g.Literal("-")), this.CHAR());
        }.bind(this), 'RANGE'));
    };
})();

// CATEGORY: "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]* "}";
(function() {
    var $cache;
    
    exports.Lexer.prototype.CATEGORY = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\\d"), g.Literal("\\D")), g.Literal("\\s")), g.Literal("\\S")), g.Literal("\\w")), g.Literal("\\W")), c.Seq(c.Seq(g.Literal("\\p{"), c.Any(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}"))), c.Seq(c.Seq(g.Literal("\\P{"), c.Any(c.Or(c.Or(g.Range("A", "Z"), g.Range("a", "z")), g.Char("_")))), g.Literal("}")));
        }.bind(this), 'CATEGORY'));
    };
})();

// CHAR: [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | CONTROL | UNICODE | CATEGORY | "\\]";
(function() {
    var $cache;
    
    exports.Lexer.prototype.CHAR = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(c.Or(c.Or(g.Char("^"), g.Char("-")), g.Char("\\")), g.Char("]")))), g.Literal("\\^")), g.Literal("\\-")), g.Literal("\\\\")), this.CONTROL()), this.UNICODE()), this.CATEGORY()), g.Literal("\\]"));
        }.bind(this), 'CHAR'));
    };
})();

// CLASS: "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
(function() {
    var $cache;
    
    exports.Lexer.prototype.CLASS = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(g.Literal("["), c.Any(c.Or(this.RANGE(), this.CHAR()))), c.Maybe(c.Seq(g.Literal("^"), c.Many(c.Or(this.RANGE(), this.CHAR()))))), g.Literal("]")), CLASS);
        }.bind(this), 'CLASS'));
    };
})();

// KEYWORD: ("grammar" | "start" | "import" | "from" | "export" | "constructor" | "augment" | "default" | "extends" | "super") -> KEYWORD;
(function() {
    var $cache;
    
    exports.Lexer.prototype.KEYWORD = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("grammar"), g.Literal("start")), g.Literal("import")), g.Literal("from")), g.Literal("export")), g.Literal("constructor")), g.Literal("augment")), g.Literal("default")), g.Literal("extends")), g.Literal("super")), KEYWORD);
        }.bind(this), 'KEYWORD'));
    };
})();

var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

var List = g.List,
    Text = g.Text;

// import {ID, CLASS, LITERAL} from .lexer;
var ID      = require('./grammar').ID,
    CLASS   = require('./grammar').CLASS,
    LITERAL = require('./grammar').LITERAL;

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
