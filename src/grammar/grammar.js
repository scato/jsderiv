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
    exports.Lexer.prototype.start = function() {
        return this._start_21ca4801 || (this._start_21ca4801 = $.Ref(function() {
            return $.Any($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or(this.SPACE(), this.ID()), this.QID()), this.COMMENT()), this.LITERAL()), this.CHAR()), this.CATEGORY()), this.SYMBOL()), this.CLASS()), this.KEYWORD()));
        }.bind(this), 'start'));
    };
})();

// _NEWLINE: "\r\n" | "\n";
(function() {
    exports.Lexer.prototype._NEWLINE = function() {
        return this.__NEWLINE_7cfe551a || (this.__NEWLINE_7cfe551a = $.Ref(function() {
            return $.Or($.Literal("\r\n"), $.Literal("\n"));
        }.bind(this), '_NEWLINE'));
    };
})();

// _CONTROL: "\\t" | "\\r" | "\\n" | "\\v" | "\\f";
(function() {
    exports.Lexer.prototype._CONTROL = function() {
        return this.__CONTROL_492e2e94 || (this.__CONTROL_492e2e94 = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Literal("\\t"), $.Literal("\\r")), $.Literal("\\n")), $.Literal("\\v")), $.Literal("\\f"));
        }.bind(this), '_CONTROL'));
    };
})();

// _UNICODE: "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F];
(function() {
    exports.Lexer.prototype._UNICODE = function() {
        return this.__UNICODE_1c3cc2df || (this.__UNICODE_1c3cc2df = $.Ref(function() {
            return $.Seq($.Seq($.Seq($.Seq($.Literal("\\u"), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F"))), $.Or($.Or($.Range("0", "9"), $.Range("a", "f")), $.Range("A", "F")));
        }.bind(this), '_UNICODE'));
    };
})();

// SPACE: ((" " | "\t" | "\r" | "\n")+ ?= ~ (" " | "\t" | "\r" | "\n"))!;
(function() {
    exports.Lexer.prototype.SPACE = function() {
        return this._SPACE_5f10e941 || (this._SPACE_5f10e941 = $.Ref(function() {
            return $.Ignore($.Seq($.Many($.Or($.Or($.Or($.Literal(" "), $.Literal("\t")), $.Literal("\r")), $.Literal("\n"))), $.Look($.Not($.Or($.Or($.Or($.Literal(" "), $.Literal("\t")), $.Literal("\r")), $.Literal("\n"))))));
        }.bind(this), 'SPACE'));
    };
})();

// _ID: [A-Za-z_] [A-Za-z0-9_\-]* ?= ~ [A-Za-z0-9_\-];
(function() {
    exports.Lexer.prototype._ID = function() {
        return this.__ID_3a139dc7 || (this.__ID_3a139dc7 = $.Ref(function() {
            return $.Seq($.Seq($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")), $.Any($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")))));
        }.bind(this), '_ID'));
    };
})();

// ID: <_ID ?= ~ "." & ~ KEYWORD> -> ID;
(function() {
    exports.Lexer.prototype.ID = function() {
        return this._ID_51b60bf9 || (this._ID_51b60bf9 = $.Ref(function() {
            return $.Red($.Capture($.And($.Seq(this._ID(), $.Look($.Not($.Literal(".")))), $.Not(this.KEYWORD()))), ID);
        }.bind(this), 'ID'));
    };
})();

// QID: <"."* (_ID | _LITERAL) ("." (_ID | _LITERAL))* ?= ~ "." & ~ _ID & ~ _LITERAL> -> QID;
(function() {
    exports.Lexer.prototype.QID = function() {
        return this._QID_40a85f2c || (this._QID_40a85f2c = $.Ref(function() {
            return $.Red($.Capture($.And($.And($.Seq($.Seq($.Seq($.Any($.Literal(".")), $.Or(this._ID(), this._LITERAL())), $.Any($.Seq($.Literal("."), $.Or(this._ID(), this._LITERAL())))), $.Look($.Not($.Literal(".")))), $.Not(this._ID())), $.Not(this._LITERAL()))), QID);
        }.bind(this), 'QID'));
    };
})();

// COMMENT: ("/*" ([^*] | "*" ?= ~ "/")* "*/" | "//" ~ (.* _NEWLINE .*) ?= _NEWLINE)!;
(function() {
    exports.Lexer.prototype.COMMENT = function() {
        return this._COMMENT_6e254a6b || (this._COMMENT_6e254a6b = $.Ref(function() {
            return $.Ignore($.Or($.Seq($.Seq($.Literal("/*"), $.Any($.Or($.And($.One(), $.Not($.Char("*"))), $.Seq($.Literal("*"), $.Look($.Not($.Literal("/"))))))), $.Literal("*/")), $.Seq($.Seq($.Literal("//"), $.Not($.Seq($.Seq($.Any($.One()), this._NEWLINE()), $.Any($.One())))), $.Look(this._NEWLINE()))));
        }.bind(this), 'COMMENT'));
    };
})();

// _LITERAL: "\"" ([^"\\] | "\\\\" | "\\\"" | _CONTROL | _UNICODE)* "\"";
(function() {
    exports.Lexer.prototype._LITERAL = function() {
        return this.__LITERAL_73640bf || (this.__LITERAL_73640bf = $.Ref(function() {
            return $.Seq($.Seq($.Literal("\""), $.Any($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Char("\""), $.Char("\\")))), $.Literal("\\\\")), $.Literal("\\\"")), this._CONTROL()), this._UNICODE()))), $.Literal("\""));
        }.bind(this), '_LITERAL'));
    };
})();

// LITERAL: <_LITERAL> -> LITERAL;
(function() {
    exports.Lexer.prototype.LITERAL = function() {
        return this._LITERAL_41742832 || (this._LITERAL_41742832 = $.Ref(function() {
            return $.Red($.Capture(this._LITERAL()), LITERAL);
        }.bind(this), 'LITERAL'));
    };
})();

// SYMBOL: <":" | ";" | "(" | ")" | "*" | "+" | "?" | "&" | "|" | "~" | "?=" | "!" | "->" | "@" | "{" | "}" | "," | "." ?= ~ [A-Za-z0-9_\-.] | "<" | ">"> -> SYMBOL;
(function() {
    exports.Lexer.prototype.SYMBOL = function() {
        return this._SYMBOL_668b054f || (this._SYMBOL_668b054f = $.Ref(function() {
            return $.Red($.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal(":"), $.Literal(";")), $.Literal("(")), $.Literal(")")), $.Literal("*")), $.Literal("+")), $.Literal("?")), $.Literal("&")), $.Literal("|")), $.Literal("~")), $.Literal("?=")), $.Literal("!")), $.Literal("->")), $.Literal("@")), $.Literal("{")), $.Literal("}")), $.Literal(",")), $.Seq($.Literal("."), $.Look($.Not($.Or($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-")), $.Char(".")))))), $.Literal("<")), $.Literal(">"))), SYMBOL);
        }.bind(this), 'SYMBOL'));
    };
})();

// _CHAR: [^\\] | "\\'" | "\\\\" | _CONTROL | _UNICODE;
(function() {
    exports.Lexer.prototype._CHAR = function() {
        return this.__CHAR_8ab3211 || (this.__CHAR_8ab3211 = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Char("\\"))), $.Literal("\\'")), $.Literal("\\\\")), this._CONTROL()), this._UNICODE());
        }.bind(this), '_CHAR'));
    };
})();

// CHAR: <"'" _CHAR "'"> -> CHAR;
(function() {
    exports.Lexer.prototype.CHAR = function() {
        return this._CHAR_1db55790 || (this._CHAR_1db55790 = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Literal("'"), this._CHAR()), $.Literal("'"))), CHAR);
        }.bind(this), 'CHAR'));
    };
})();

// _CATEGORY: "\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]* "}";
(function() {
    exports.Lexer.prototype._CATEGORY = function() {
        return this.__CATEGORY_3213d426 || (this.__CATEGORY_3213d426 = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("\\d"), $.Literal("\\D")), $.Literal("\\s")), $.Literal("\\S")), $.Literal("\\w")), $.Literal("\\W")), $.Seq($.Seq($.Literal("\\p{"), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Literal("}"))), $.Seq($.Seq($.Literal("\\P{"), $.Any($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Char("_")))), $.Literal("}")));
        }.bind(this), '_CATEGORY'));
    };
})();

// CATEGORY: <"'" _CATEGORY "'"> -> CATEGORY;
(function() {
    exports.Lexer.prototype.CATEGORY = function() {
        return this._CATEGORY_2d87070 || (this._CATEGORY_2d87070 = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Literal("'"), this._CATEGORY()), $.Literal("'"))), CATEGORY);
        }.bind(this), 'CATEGORY'));
    };
})();

// _CLASS_CHAR: [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | _CONTROL | _UNICODE | _CATEGORY | "\\]";
(function() {
    exports.Lexer.prototype._CLASS_CHAR = function() {
        return this.__CLASS_CHAR_795e901b || (this.__CLASS_CHAR_795e901b = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.And($.One(), $.Not($.Or($.Or($.Or($.Char("^"), $.Char("-")), $.Char("\\")), $.Char("]")))), $.Literal("\\^")), $.Literal("\\-")), $.Literal("\\\\")), this._CONTROL()), this._UNICODE()), this._CATEGORY()), $.Literal("\\]"));
        }.bind(this), '_CLASS_CHAR'));
    };
})();

// _CLASS_RANGE: _CLASS_CHAR "-" _CLASS_CHAR;
(function() {
    exports.Lexer.prototype._CLASS_RANGE = function() {
        return this.__CLASS_RANGE_51cd596f || (this.__CLASS_RANGE_51cd596f = $.Ref(function() {
            return $.Seq($.Seq(this._CLASS_CHAR(), $.Literal("-")), this._CLASS_CHAR());
        }.bind(this), '_CLASS_RANGE'));
    };
})();

// CLASS: <"[" ((_CLASS_RANGE | _CLASS_CHAR)* | "^" (_CLASS_RANGE | _CLASS_CHAR)+) "]"> -> CLASS;
(function() {
    exports.Lexer.prototype.CLASS = function() {
        return this._CLASS_68868163 || (this._CLASS_68868163 = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Literal("["), $.Or($.Any($.Or(this._CLASS_RANGE(), this._CLASS_CHAR())), $.Seq($.Literal("^"), $.Many($.Or(this._CLASS_RANGE(), this._CLASS_CHAR()))))), $.Literal("]"))), CLASS);
        }.bind(this), 'CLASS'));
    };
})();

// KEYWORD: <"grammar" | "start" | "import" | "from" | "export" | "constructor" | "augment" | "default" | "extends" | "super"> ?= ~ [A-Za-z0-9_\-] -> KEYWORD;
(function() {
    exports.Lexer.prototype.KEYWORD = function() {
        return this._KEYWORD_35b8e9c0 || (this._KEYWORD_35b8e9c0 = $.Ref(function() {
            return $.Red($.Seq($.Capture($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Literal("grammar"), $.Literal("start")), $.Literal("import")), $.Literal("from")), $.Literal("export")), $.Literal("constructor")), $.Literal("augment")), $.Literal("default")), $.Literal("extends")), $.Literal("super"))), $.Look($.Not($.Or($.Or($.Or($.Or($.Range("A", "Z"), $.Range("a", "z")), $.Range("0", "9")), $.Char("_")), $.Char("-"))))), KEYWORD);
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
    exports.Parser.prototype.start = function() {
        return this._start_1130d4a || (this._start_1130d4a = $.Ref(function() {
            return $.Red($.Any(this.Statement()), Module);
        }.bind(this), 'start'));
    };
})();

// Statement: Import | Export | Definition | Augmentation;
(function() {
    exports.Parser.prototype.Statement = function() {
        return this._Statement_1016a344 || (this._Statement_1016a344 = $.Ref(function() {
            return $.Or($.Or($.Or(this.Import(), this.Export()), this.Definition()), this.Augmentation());
        }.bind(this), 'Statement'));
    };
})();

// Import: @"import"! IdentifierList @"from"! @QID @";"! -> Import;
(function() {
    exports.Parser.prototype.Import = function() {
        return this._Import_56668f8e || (this._Import_56668f8e = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("import")), this.IdentifierList()), $.Ignore($.Value("from"))), $.Type(QID)), $.Ignore($.Value(";"))), Import);
        }.bind(this), 'Import'));
    };
})();

// IdentifierList: <@"{"! @ID (@":"! @ID)? (@","! @ID (@":"! @ID)?)* @"}"!> | <@ID (@","! @ID)*>;
(function() {
    exports.Parser.prototype.IdentifierList = function() {
        return this._IdentifierList_4c28dc8e || (this._IdentifierList_4c28dc8e = $.Ref(function() {
            return $.Or($.Capture($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("{")), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Value(":")), $.Type(ID)))), $.Any($.Seq($.Seq($.Ignore($.Value(",")), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Value(":")), $.Type(ID)))))), $.Ignore($.Value("}")))), $.Capture($.Seq($.Type(ID), $.Any($.Seq($.Ignore($.Value(",")), $.Type(ID))))));
        }.bind(this), 'IdentifierList'));
    };
})();

// Export: @"export"! Definition -> Export;
(function() {
    exports.Parser.prototype.Export = function() {
        return this._Export_65c70121 || (this._Export_65c70121 = $.Ref(function() {
            return $.Red($.Seq($.Ignore($.Value("export")), this.Definition()), Export);
        }.bind(this), 'Export'));
    };
})();

// Definition: Constructor | Grammar;
(function() {
    exports.Parser.prototype.Definition = function() {
        return this._Definition_53907b1d || (this._Definition_53907b1d = $.Ref(function() {
            return $.Or(this.Constructor(), this.Grammar());
        }.bind(this), 'Definition'));
    };
})();

// Constructor: @"constructor"! @ID (@","! @ID)* @";"! -> Constructor;
(function() {
    exports.Parser.prototype.Constructor = function() {
        return this._Constructor_3afc2ae8 || (this._Constructor_3afc2ae8 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Ignore($.Value("constructor")), $.Type(ID)), $.Any($.Seq($.Ignore($.Value(",")), $.Type(ID)))), $.Ignore($.Value(";"))), Constructor);
        }.bind(this), 'Constructor'));
    };
})();

// Grammar: @"grammar"! @ID (@"extends"! @ID)? @"{"! <Rule*> @"}"! -> Grammar;
(function() {
    exports.Parser.prototype.Grammar = function() {
        return this._Grammar_69e95806 || (this._Grammar_69e95806 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("grammar")), $.Type(ID)), $.Maybe($.Seq($.Ignore($.Value("extends")), $.Type(ID)))), $.Ignore($.Value("{"))), $.Capture($.Any(this.Rule()))), $.Ignore($.Value("}"))), Grammar);
        }.bind(this), 'Grammar'));
    };
})();

// Rule: @"start"! Expression @";"! -> Start | @ID @":"! Expression @";"! -> Rule;
(function() {
    exports.Parser.prototype.Rule = function() {
        return this._Rule_1f59ce2b || (this._Rule_1f59ce2b = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq($.Ignore($.Value("start")), this.Expression()), $.Ignore($.Value(";"))), Start), $.Red($.Seq($.Seq($.Seq($.Type(ID), $.Ignore($.Value(":"))), this.Expression()), $.Ignore($.Value(";"))), Rule));
        }.bind(this), 'Rule'));
    };
})();

// Augmentation: @"augment"! @"grammar"! @ID @"{"! <Rule*> @"}"! -> Augmentation;
(function() {
    exports.Parser.prototype.Augmentation = function() {
        return this._Augmentation_3f60bd9e || (this._Augmentation_3f60bd9e = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Value("augment")), $.Ignore($.Value("grammar"))), $.Type(ID)), $.Ignore($.Value("{"))), $.Capture($.Any(this.Rule()))), $.Ignore($.Value("}"))), Augmentation);
        }.bind(this), 'Augmentation'));
    };
})();

// Expression: OrExpr;
(function() {
    exports.Parser.prototype.Expression = function() {
        return this._Expression_72c98168 || (this._Expression_72c98168 = $.Ref(function() {
            return this.OrExpr();
        }.bind(this), 'Expression'));
    };
})();

// OrExpr: OrExpr @"|"! RedExpr -> Or | RedExpr;
(function() {
    exports.Parser.prototype.OrExpr = function() {
        return this._OrExpr_58879795 || (this._OrExpr_58879795 = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.OrExpr(), $.Ignore($.Value("|"))), this.RedExpr()), Or), this.RedExpr());
        }.bind(this), 'OrExpr'));
    };
})();

// RedExpr: RedExpr @"->"! @ID -> Red | AndExpr;
(function() {
    exports.Parser.prototype.RedExpr = function() {
        return this._RedExpr_4042149d || (this._RedExpr_4042149d = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.RedExpr(), $.Ignore($.Value("->"))), $.Type(ID)), Red), this.AndExpr());
        }.bind(this), 'RedExpr'));
    };
})();

// AndExpr: AndExpr @"&"! SeqExpr -> And | SeqExpr;
(function() {
    exports.Parser.prototype.AndExpr = function() {
        return this._AndExpr_2f1fd44b || (this._AndExpr_2f1fd44b = $.Ref(function() {
            return $.Or($.Red($.Seq($.Seq(this.AndExpr(), $.Ignore($.Value("&"))), this.SeqExpr()), And), this.SeqExpr());
        }.bind(this), 'AndExpr'));
    };
})();

// SeqExpr: SeqExpr RightExpr -> Seq | RightExpr;
(function() {
    exports.Parser.prototype.SeqExpr = function() {
        return this._SeqExpr_269f9328 || (this._SeqExpr_269f9328 = $.Ref(function() {
            return $.Or($.Red($.Seq(this.SeqExpr(), this.RightExpr()), Seq), this.RightExpr());
        }.bind(this), 'SeqExpr'));
    };
})();

// RightExpr: RightExpr @"*"! -> Any | RightExpr @"+"! -> Many | RightExpr @"?"! -> Maybe | RightExpr @"!"! -> Ignore | LeftExpr;
(function() {
    exports.Parser.prototype.RightExpr = function() {
        return this._RightExpr_6a00908c || (this._RightExpr_6a00908c = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Red($.Seq(this.RightExpr(), $.Ignore($.Value("*"))), Any), $.Red($.Seq(this.RightExpr(), $.Ignore($.Value("+"))), Many)), $.Red($.Seq(this.RightExpr(), $.Ignore($.Value("?"))), Maybe)), $.Red($.Seq(this.RightExpr(), $.Ignore($.Value("!"))), Ignore)), this.LeftExpr());
        }.bind(this), 'RightExpr'));
    };
})();

// LeftExpr: @"~"! LeftExpr -> Not | @"?="! LeftExpr -> Look | Terminal;
(function() {
    exports.Parser.prototype.LeftExpr = function() {
        return this._LeftExpr_7727c56a || (this._LeftExpr_7727c56a = $.Ref(function() {
            return $.Or($.Or($.Red($.Seq($.Ignore($.Value("~")), this.LeftExpr()), Not), $.Red($.Seq($.Ignore($.Value("?=")), this.LeftExpr()), Look)), this.Terminal());
        }.bind(this), 'LeftExpr'));
    };
})();

// Terminal: @"("! Expression @")"! | @"<"! Expression @">"! -> Capture | @"@"! @ID -> Type | @"@"! @LITERAL -> Value | @"."! -> One | @ID -> Ref | @CLASS -> Class | @LITERAL -> Literal | @CHAR -> Char | @CATEGORY -> Category | @"default"! -> Default | @"super"! -> Super;
(function() {
    exports.Parser.prototype.Terminal = function() {
        return this._Terminal_6c7eecd0 || (this._Terminal_6c7eecd0 = $.Ref(function() {
            return $.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Or($.Seq($.Seq($.Ignore($.Value("(")), this.Expression()), $.Ignore($.Value(")"))), $.Red($.Seq($.Seq($.Ignore($.Value("<")), this.Expression()), $.Ignore($.Value(">"))), Capture)), $.Red($.Seq($.Ignore($.Value("@")), $.Type(ID)), Type)), $.Red($.Seq($.Ignore($.Value("@")), $.Type(LITERAL)), Value)), $.Red($.Ignore($.Value(".")), One)), $.Red($.Type(ID), Ref)), $.Red($.Type(CLASS), Class)), $.Red($.Type(LITERAL), Literal)), $.Red($.Type(CHAR), Char)), $.Red($.Type(CATEGORY), Category)), $.Red($.Ignore($.Value("default")), Default)), $.Red($.Ignore($.Value("super")), Super));
        }.bind(this), 'Terminal'));
    };
})();
