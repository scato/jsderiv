var $ = require('../jsderiv');

// export constructor ID, QID, LITERAL, CHAR, CATEGORY, SYMBOL, CLASS, KEYWORD;
var ID       = exports.ID       = $.Node.define("ID");
var QID      = exports.QID      = $.Node.define("QID");
var LITERAL  = exports.LITERAL  = $.Node.define("LITERAL");
var CHAR     = exports.CHAR     = $.Node.define("CHAR");
var CATEGORY = exports.CATEGORY = $.Node.define("CATEGORY");
var SYMBOL   = exports.SYMBOL   = $.Node.define("SYMBOL");
var CLASS    = exports.CLASS    = $.Node.define("CLASS");
var KEYWORD  = exports.KEYWORD  = $.Node.define("KEYWORD");

// export grammar Lexer;
var Lexer = exports.Lexer = function() {};

// start (SPACE | ID | QID | COMMENT | LITERAL | CHAR | CATEGORY | SYMBOL | CLASS | KEYWORD)*;
(function() {
    var $cache;
    
    exports.Lexer.prototype.start = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Any($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or(this.SPACE(), this.ID()), this.QID()), this.COMMENT()), this.LITERAL()), this.CHAR()), this.CATEGORY()), this.SYMBOL()), this.CLASS()), this.KEYWORD()));
        }.bind(this), 'start'));
    };
})();

// _NEWLINE: "\r\n" | "\n";
(function() {
    var $cache;
    
    exports.Lexer.prototype._NEWLINE = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Literal("\r\n"), $.Value("\r\n")), $.Or($.Literal("\n"), $.Value("\n")));
        }.bind(this), '_NEWLINE'));
    };
})();

// _CONTROL: "\\t" | "\\r" | "\\n" | "\\v" | "\\f";
(function() {
    var $cache;
    
    exports.Lexer.prototype._CONTROL = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Literal("\\t"), $.Value("\\t")), $.Or($.Literal("\\r"), $.Value("\\r"))), $.Or($.Literal("\\n"), $.Value("\\n"))), $.Or($.Literal("\\v"), $.Value("\\v"))), $.Or($.Literal("\\f"), $.Value("\\f")));
        }.bind(this), '_CONTROL'));
    };
})();

// _UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F];
(function() {
    var $cache;
    
    exports.Lexer.prototype._UNICODE = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Seq($.Seq($.Seq($.Seq($.Or($.Literal("\\u"), $.Value("\\u")), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F")));
        }.bind(this), '_UNICODE'));
    };
})();

// SPACE: ((" " | "\t" | "\r" | "\n")+ ?= ~ (" " | "\t" | "\r" | "\n"))!;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SPACE = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Ignore($.Seq($.Many($.Or($.Or($.Or($.Or($.Literal(" "), $.Value(" ")), $.Or($.Literal("\t"), $.Value("\t"))), $.Or($.Literal("\r"), $.Value("\r"))), $.Or($.Literal("\n"), $.Value("\n")))), $.Look($.Not($.Or($.Or($.Or($.Or($.Literal(" "), $.Value(" ")), $.Or($.Literal("\t"), $.Value("\t"))), $.Or($.Literal("\r"), $.Value("\r"))), $.Or($.Literal("\n"), $.Value("\n")))))));
        }.bind(this), 'SPACE'));
    };
})();

// _ID: [A-Za-z_] [A-Za-z0-9_\-]* ?= ~ [A-Za-z0-9_\-];
(function() {
    var $cache;
    
    exports.Lexer.prototype._ID = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Seq($.Seq($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")), $.Any($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")))));
        }.bind(this), '_ID'));
    };
})();

// ID: <_ID ?= ~ "." & ~ KEYWORD> -> ID;
(function() {
    var $cache;
    
    exports.Lexer.prototype.ID = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.And($.Seq(this._ID(), $.Look($.Not($.Or($.Literal("."), $.Value("."))))), $.Not(this.KEYWORD()))), ID);
        }.bind(this), 'ID'));
    };
})();

// QID: <"."* (_ID | _LITERAL) ("." (_ID | _LITERAL))* ?= ~ "." & ~ _ID & ~ _LITERAL> -> QID;
(function() {
    var $cache;
    
    exports.Lexer.prototype.QID = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.And($.And($.Seq($.Seq($.Seq($.Any($.Or($.Literal("."), $.Value("."))), $.Or(this._ID(), this._LITERAL())), $.Any($.Seq($.Or($.Literal("."), $.Value(".")), $.Or(this._ID(), this._LITERAL())))), $.Look($.Not($.Or($.Literal("."), $.Value("."))))), $.Not(this._ID())), $.Not(this._LITERAL()))), QID);
        }.bind(this), 'QID'));
    };
})();

// COMMENT: ("/*" ([^*] | "*" ?= ~ "/")* "*/" | "//" ~ (.* _NEWLINE .*) ?= _NEWLINE)!;
(function() {
    var $cache;
    
    exports.Lexer.prototype.COMMENT = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Ignore($.Or($.Seq($.Seq($.Or($.Literal("/*"), $.Value("/*")), $.Any($.Or($.And($.One(), $.Not($.Char("*"))), $.Seq($.Or($.Literal("*"), $.Value("*")), $.Look($.Not($.Or($.Literal("/"), $.Value("/")))))))), $.Or($.Literal("*/"), $.Value("*/"))), $.Seq($.Seq($.Or($.Literal("//"), $.Value("//")), $.Not($.Seq($.Seq($.Any($.One()), this._NEWLINE()), $.Any($.One())))), $.Look(this._NEWLINE()))));
        }.bind(this), 'COMMENT'));
    };
})();

// _LITERAL: "\"" ([^"\\] | "\\\\" | "\\\"" | _CONTROL | _UNICODE)* "\"";
(function() {
    var $cache;
    
    exports.Lexer.prototype._LITERAL = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Seq($.Seq($.Or($.Literal("\""), $.Value("\"")), $.Any($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Char("\""), $.Char("\\")))), $.Or($.Literal("\\\\"), $.Value("\\\\"))), $.Or($.Literal("\\\""), $.Value("\\\""))), this._CONTROL()), this._UNICODE()))), $.Or($.Literal("\""), $.Value("\"")));
        }.bind(this), '_LITERAL'));
    };
})();

// LITERAL: <_LITERAL> -> LITERAL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.LITERAL = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture(this._LITERAL()), LITERAL);
        }.bind(this), 'LITERAL'));
    };
})();

// SYMBOL: <":" | ";" | "(" | ")" | "*" | "+" | "?" | "&" | "|" | "~" | "?=" | "!" | "->" | "@" | "{" | "}" | "," | "." ?= ~ [A-Za-z0-9_\-] | "<" | ">"> -> SYMBOL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SYMBOL = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal(":"), $.Value(":")), $.Or($.Literal(";"), $.Value(";"))), $.Or($.Literal("("), $.Value("("))), $.Or($.Literal(")"), $.Value(")"))), $.Or($.Literal("*"), $.Value("*"))), $.Or($.Literal("+"), $.Value("+"))), $.Or($.Literal("?"), $.Value("?"))), $.Or($.Literal("&"), $.Value("&"))), $.Or($.Literal("|"), $.Value("|"))), $.Or($.Literal("~"), $.Value("~"))), $.Or($.Literal("?="), $.Value("?="))), $.Or($.Literal("!"), $.Value("!"))), $.Or($.Literal("->"), $.Value("->"))), $.Or($.Literal("@"), $.Value("@"))), $.Or($.Literal("{"), $.Value("{"))), $.Or($.Literal("}"), $.Value("}"))), $.Or($.Literal(","), $.Value(","))), $.Seq($.Or($.Literal("."), $.Value(".")), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")))))), $.Or($.Literal("<"), $.Value("<"))), $.Or($.Literal(">"), $.Value(">")))), SYMBOL);
        }.bind(this), 'SYMBOL'));
    };
})();

// _CHAR: [^\\] | "\\'" | "\\\\" | _CONTROL | _UNICODE;
(function() {
    var $cache;
    
    exports.Lexer.prototype._CHAR = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Char("\\"))), $.Or($.Literal("\\'"), $.Value("\\'"))), $.Or($.Literal("\\\\"), $.Value("\\\\"))), this._CONTROL()), this._UNICODE());
        }.bind(this), '_CHAR'));
    };
})();

// CHAR: <"'" _CHAR "'"> -> CHAR;
(function() {
    var $cache;
    
    exports.Lexer.prototype.CHAR = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Or($.Literal("'"), $.Value("'")), this._CHAR()), $.Or($.Literal("'"), $.Value("'")))), CHAR);
        }.bind(this), 'CHAR'));
    };
})();

// _CATEGORY: "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]* "}";
(function() {
    var $cache;
    
    exports.Lexer.prototype._CATEGORY = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("\\d"), $.Value("\\d")), $.Or($.Literal("\\D"), $.Value("\\D"))), $.Or($.Literal("\\s"), $.Value("\\s"))), $.Or($.Literal("\\S"), $.Value("\\S"))), $.Or($.Literal("\\w"), $.Value("\\w"))), $.Or($.Literal("\\W"), $.Value("\\W"))), $.Seq($.Seq($.Or($.Literal("\\p{"), $.Value("\\p{")), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Or($.Literal("}"), $.Value("}")))), $.Seq($.Seq($.Or($.Literal("\\P{"), $.Value("\\P{")), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Or($.Literal("}"), $.Value("}"))));
        }.bind(this), '_CATEGORY'));
    };
})();

// CATEGORY: <"'" _CATEGORY "'"> -> CATEGORY;
(function() {
    var $cache;
    
    exports.Lexer.prototype.CATEGORY = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Or($.Literal("'"), $.Value("'")), this._CATEGORY()), $.Or($.Literal("'"), $.Value("'")))), CATEGORY);
        }.bind(this), 'CATEGORY'));
    };
})();

// _CLASS_CHAR: [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | _CONTROL | _UNICODE | _CATEGORY | "\\]";
(function() {
    var $cache;
    
    exports.Lexer.prototype._CLASS_CHAR = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Or($.Or($.Char("^"), $.Char("-")), $.Char("\\")), $.Char("]")))), $.Or($.Literal("\\^"), $.Value("\\^"))), $.Or($.Literal("\\-"), $.Value("\\-"))), $.Or($.Literal("\\\\"), $.Value("\\\\"))), this._CONTROL()), this._UNICODE()), this._CATEGORY()), $.Or($.Literal("\\]"), $.Value("\\]")));
        }.bind(this), '_CLASS_CHAR'));
    };
})();

// _CLASS_RANGE: _CLASS_CHAR "-" _CLASS_CHAR;
(function() {
    var $cache;
    
    exports.Lexer.prototype._CLASS_RANGE = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Seq($.Seq(this._CLASS_CHAR(), $.Or($.Literal("-"), $.Value("-"))), this._CLASS_CHAR());
        }.bind(this), '_CLASS_RANGE'));
    };
})();

// CLASS: <"[" ((_CLASS_RANGE | _CLASS_CHAR)* | "^" (_CLASS_RANGE | _CLASS_CHAR)+) "]"> -> CLASS;
(function() {
    var $cache;
    
    exports.Lexer.prototype.CLASS = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Or($.Literal("["), $.Value("[")), $.Or($.Any($.Or(this._CLASS_RANGE(), this._CLASS_CHAR())), $.Seq($.Or($.Literal("^"), $.Value("^")), $.Many($.Or(this._CLASS_RANGE(), this._CLASS_CHAR()))))), $.Or($.Literal("]"), $.Value("]")))), CLASS);
        }.bind(this), 'CLASS'));
    };
})();

// KEYWORD: <"grammar" | "start" | "import" | "from" | "export" | "constructor" | "augment" | "default" | "extends" | "super"> ?= ~ [A-Za-z0-9_\-] -> KEYWORD;
(function() {
    var $cache;
    
    exports.Lexer.prototype.KEYWORD = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("grammar"), $.Value("grammar")), $.Or($.Literal("start"), $.Value("start"))), $.Or($.Literal("import"), $.Value("import"))), $.Or($.Literal("from"), $.Value("from"))), $.Or($.Literal("export"), $.Value("export"))), $.Or($.Literal("constructor"), $.Value("constructor"))), $.Or($.Literal("augment"), $.Value("augment"))), $.Or($.Literal("default"), $.Value("default"))), $.Or($.Literal("extends"), $.Value("extends"))), $.Or($.Literal("super"), $.Value("super")))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-"))))), KEYWORD);
        }.bind(this), 'KEYWORD'));
    };
})();

// export constructor Module, Import, Export, Constructor, Grammar, Start, Rule, Augmentation;
var Module       = exports.Module       = $.Node.define("Module");
var Import       = exports.Import       = $.Node.define("Import");
var Export       = exports.Export       = $.Node.define("Export");
var Constructor  = exports.Constructor  = $.Node.define("Constructor");
var Grammar      = exports.Grammar      = $.Node.define("Grammar");
var Start        = exports.Start        = $.Node.define("Start");
var Rule         = exports.Rule         = $.Node.define("Rule");
var Augmentation = exports.Augmentation = $.Node.define("Augmentation");

// export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, Type, Value, One, Ref, Class, Literal, Char, Category, Default, Super, Capture;
var Or       = exports.Or       = $.Node.define("Or");
var Red      = exports.Red      = $.Node.define("Red");
var And      = exports.And      = $.Node.define("And");
var Seq      = exports.Seq      = $.Node.define("Seq");
var Any      = exports.Any      = $.Node.define("Any");
var Many     = exports.Many     = $.Node.define("Many");
var Maybe    = exports.Maybe    = $.Node.define("Maybe");
var Ignore   = exports.Ignore   = $.Node.define("Ignore");
var Not      = exports.Not      = $.Node.define("Not");
var Look     = exports.Look     = $.Node.define("Look");
var Type     = exports.Type     = $.Node.define("Type");
var Value    = exports.Value    = $.Node.define("Value");
var One      = exports.One      = $.Node.define("One");
var Ref      = exports.Ref      = $.Node.define("Ref");
var Class    = exports.Class    = $.Node.define("Class");
var Literal  = exports.Literal  = $.Node.define("Literal");
var Char     = exports.Char     = $.Node.define("Char");
var Category = exports.Category = $.Node.define("Category");
var Default  = exports.Default  = $.Node.define("Default");
var Super    = exports.Super    = $.Node.define("Super");
var Capture  = exports.Capture  = $.Node.define("Capture");

// export grammar Parser;
var Parser = exports.Parser = function() {};

// start Statement* -> Module;
(function() {
    var $cache;
    
    exports.Parser.prototype.start = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Any(this.Statement()), Module);
        }.bind(this), 'start'));
    };
})();

// Statement: Import | Export | Definition | Augmentation;
(function() {
    var $cache;
    
    exports.Parser.prototype.Statement = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or(this.Import(), this.Export()), this.Definition()), this.Augmentation());
        }.bind(this), 'Statement'));
    };
})();

// Import: "import"! IdentifierList "from"! @QID ";"! -> Import;
(function() {
    var $cache;
    
    exports.Parser.prototype.Import = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("import"), $.Value("import"))), this.IdentifierList()), $.Ignore($.Or($.Literal("from"), $.Value("from")))), $.Type(QID)), $.Ignore($.Or($.Literal(";"), $.Value(";")))), Import);
        }.bind(this), 'Import'));
    };
})();

// IdentifierList: <"{"! @ID (":"! @ID)? (","! @ID (":"! @ID)?)* "}"!> | <@ID (","! @ID)*>;
(function() {
    var $cache;
    
    exports.Parser.prototype.IdentifierList = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Capture($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("{"), $.Value("{"))), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Or($.Literal(":"), $.Value(":"))), $.Type(ID)))), $.Any($.Seq($.Seq($.Ignore($.Or($.Literal(","), $.Value(","))), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Or($.Literal(":"), $.Value(":"))), $.Type(ID)))))), $.Ignore($.Or($.Literal("}"), $.Value("}"))))), $.Capture($.Seq($.Type(ID), $.Any($.Seq($.Ignore($.Or($.Literal(","), $.Value(","))), $.Type(ID))))));
        }.bind(this), 'IdentifierList'));
    };
})();

// Export: "export"! Definition -> Export;
(function() {
    var $cache;
    
    exports.Parser.prototype.Export = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Ignore($.Or($.Literal("export"), $.Value("export"))), this.Definition()), Export);
        }.bind(this), 'Export'));
    };
})();

// Definition: Constructor | Grammar;
(function() {
    var $cache;
    
    exports.Parser.prototype.Definition = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or(this.Constructor(), this.Grammar());
        }.bind(this), 'Definition'));
    };
})();

// Constructor: "constructor"! @ID (","! @ID)* ";"! -> Constructor;
(function() {
    var $cache;
    
    exports.Parser.prototype.Constructor = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("constructor"), $.Value("constructor"))), $.Type(ID)), $.Any($.Seq($.Ignore($.Or($.Literal(","), $.Value(","))), $.Type(ID)))), $.Ignore($.Or($.Literal(";"), $.Value(";")))), Constructor);
        }.bind(this), 'Constructor'));
    };
})();

// Grammar: "grammar"! @ID ("extends"! @ID)? "{"! <Rule*> "}"! -> Grammar;
(function() {
    var $cache;
    
    exports.Parser.prototype.Grammar = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("grammar"), $.Value("grammar"))), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Or($.Literal("extends"), $.Value("extends"))), $.Type(ID)))), $.Ignore($.Or($.Literal("{"), $.Value("{")))), $.Capture($.Any(this.Rule()))), $.Ignore($.Or($.Literal("}"), $.Value("}")))), Grammar);
        }.bind(this), 'Grammar'));
    };
})();

// Rule: "start"! Expression ";"! -> Start | @ID ":"! Expression ";"! -> Rule;
(function() {
    var $cache;
    
    exports.Parser.prototype.Rule = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq($.Ignore($.Or($.Literal("start"), $.Value("start"))), this.Expression()), $.Ignore($.Or($.Literal(";"), $.Value(";")))), Start), $.Red($.Seq($.Seq($.Seq($.Type(ID), $.Ignore($.Or($.Literal(":"), $.Value(":")))), this.Expression()), $.Ignore($.Or($.Literal(";"), $.Value(";")))), Rule));
        }.bind(this), 'Rule'));
    };
})();

// Augmentation: "augment"! "grammar"! @ID "{"! <Rule*> "}"! -> Augmentation;
(function() {
    var $cache;
    
    exports.Parser.prototype.Augmentation = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Or($.Literal("augment"), $.Value("augment"))), $.Ignore($.Or($.Literal("grammar"), $.Value("grammar")))), $.Type(ID)), $.Ignore($.Or($.Literal("{"), $.Value("{")))), $.Capture($.Any(this.Rule()))), $.Ignore($.Or($.Literal("}"), $.Value("}")))), Augmentation);
        }.bind(this), 'Augmentation'));
    };
})();

// Expression: OrExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.Expression = function() {
        return $cache || ($cache = $.Ref(function() {
            return this.OrExpr();
        }.bind(this), 'Expression'));
    };
})();

// OrExpr: OrExpr "|"! RedExpr -> Or | RedExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.OrExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.OrExpr(), $.Ignore($.Or($.Literal("|"), $.Value("|")))), this.RedExpr()), Or), this.RedExpr());
        }.bind(this), 'OrExpr'));
    };
})();

// RedExpr: RedExpr "->"! @ID -> Red | AndExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.RedExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.RedExpr(), $.Ignore($.Or($.Literal("->"), $.Value("->")))), $.Type(ID)), Red), this.AndExpr());
        }.bind(this), 'RedExpr'));
    };
})();

// AndExpr: AndExpr "&"! SeqExpr -> And | SeqExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.AndExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.AndExpr(), $.Ignore($.Or($.Literal("&"), $.Value("&")))), this.SeqExpr()), And), this.SeqExpr());
        }.bind(this), 'AndExpr'));
    };
})();

// SeqExpr: SeqExpr RightExpr -> Seq | RightExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.SeqExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Red($.Seq(this.SeqExpr(), this.RightExpr()), Seq), this.RightExpr());
        }.bind(this), 'SeqExpr'));
    };
})();

// RightExpr: RightExpr "*"! -> Any | RightExpr "+"! -> Many | RightExpr "?"! -> Maybe | RightExpr "!"! -> Ignore | LeftExpr;
(function() {
    var $cache;
    
    exports.Parser.prototype.RightExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Red($.Seq(this.RightExpr(), $.Ignore($.Or($.Literal("*"), $.Value("*")))), Any), $.Red($.Seq(this.RightExpr(), $.Ignore($.Or($.Literal("+"), $.Value("+")))), Many)), $.Red($.Seq(this.RightExpr(), $.Ignore($.Or($.Literal("?"), $.Value("?")))), Maybe)), $.Red($.Seq(this.RightExpr(), $.Ignore($.Or($.Literal("!"), $.Value("!")))), Ignore)), this.LeftExpr());
        }.bind(this), 'RightExpr'));
    };
})();

// LeftExpr: "~"! LeftExpr -> Not | "?="! LeftExpr -> Look | Terminal;
(function() {
    var $cache;
    
    exports.Parser.prototype.LeftExpr = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Red($.Seq($.Ignore($.Or($.Literal("~"), $.Value("~"))), this.LeftExpr()), Not), $.Red($.Seq($.Ignore($.Or($.Literal("?="), $.Value("?="))), this.LeftExpr()), Look)), this.Terminal());
        }.bind(this), 'LeftExpr'));
    };
})();

// Terminal: "("! Expression ")"! | "<"! Expression ">"! -> Capture | "@"! @ID -> Type | "@"! @LITERAL -> Value | "."! -> One | @ID -> Ref | @CLASS -> Class | @LITERAL -> Literal | @CHAR -> Char | @CATEGORY -> Category | "default"! -> Default | "super"! -> Super;
(function() {
    var $cache;
    
    exports.Parser.prototype.Terminal = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Seq($.Seq($.Ignore($.Or($.Literal("("), $.Value("("))), this.Expression()), $.Ignore($.Or($.Literal(")"), $.Value(")")))), $.Red($.Seq($.Seq($.Ignore($.Or($.Literal("<"), $.Value("<"))), this.Expression()), $.Ignore($.Or($.Literal(">"), $.Value(">")))), Capture)), $.Red($.Seq($.Ignore($.Or($.Literal("@"), $.Value("@"))), $.Type(ID)), Type)), $.Red($.Seq($.Ignore($.Or($.Literal("@"), $.Value("@"))), $.Type(LITERAL)), Value)), $.Red($.Ignore($.Or($.Literal("."), $.Value("."))), One)), $.Red($.Type(ID), Ref)), $.Red($.Type(CLASS), Class)), $.Red($.Type(LITERAL), Literal)), $.Red($.Type(CHAR), Char)), $.Red($.Type(CATEGORY), Category)), $.Red($.Ignore($.Or($.Literal("default"), $.Value("default"))), Default)), $.Red($.Ignore($.Or($.Literal("super"), $.Value("super"))), Super));
        }.bind(this), 'Terminal'));
    };
})();
