var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// export grammar Lexical;
var Lexical = exports.Lexical = function() {};

// SourceCharacter: .;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SourceCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.One();
        }.bind(this), 'SourceCharacter'));
    };
})();

// InputElementDiv: WhiteSpace | LineTerminator | Comment | Token | DivPunctuator;
(function() {
    var $cache;
    
    exports.Lexical.prototype.InputElementDiv = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.WhiteSpace(), this.LineTerminator()), this.Comment()), this.Token()), this.DivPunctuator());
        }.bind(this), 'InputElementDiv'));
    };
})();

// InputElementRegExp: WhiteSpace | LineTerminator | Comment | Token | RegularExpressionLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.InputElementRegExp = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.WhiteSpace(), this.LineTerminator()), this.Comment()), this.Token()), this.RegularExpressionLiteral());
        }.bind(this), 'InputElementRegExp'));
    };
})();

// WhiteSpace: "\t" | "\v" | "\f" | " " | "\u00a0" | "\ufeff" | [\s^\t\n\r\v\f \u00a0\u2028\u2029];
(function() {
    var $cache;
    
    exports.Lexical.prototype.WhiteSpace = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\t"), g.Literal("\v")), g.Literal("\f")), g.Literal(" ")), g.Literal("\u00a0")), g.Literal("\ufeff")), c.And(g.Category("\\s"), c.Not(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Char("\\t"), g.Char("\\n")), g.Char("\\r")), g.Char("\\v")), g.Char("\\f")), g.Char(" ")), g.Char("\\u00a0")), g.Char("\\u2028")), g.Char("\\u2029")))));
        }.bind(this), 'WhiteSpace'));
    };
})();

// LineTerminator: "\n" | "\r" | "\u2028" | "\u2029";
(function() {
    var $cache;
    
    exports.Lexical.prototype.LineTerminator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(g.Literal("\n"), g.Literal("\r")), g.Literal("\u2028")), g.Literal("\u2029"));
        }.bind(this), 'LineTerminator'));
    };
})();

// LineTerminatorSequence: "\n" | "\r" ?= ~ "\n" | "\u2028" | "\u2029" | "\r" "\n";
(function() {
    var $cache;
    
    exports.Lexical.prototype.LineTerminatorSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(g.Literal("\n"), c.Seq(g.Literal("\r"), l.Look(c.Not(g.Literal("\n"))))), g.Literal("\u2028")), g.Literal("\u2029")), c.Seq(g.Literal("\r"), g.Literal("\n")));
        }.bind(this), 'LineTerminatorSequence'));
    };
})();

// Comment: MultiLineComment | SingleLineComment;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Comment = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.MultiLineComment(), this.SingleLineComment());
        }.bind(this), 'Comment'));
    };
})();

// MultiLineComment: "/*" MultiLineCommentChars? "*/";
(function() {
    var $cache;
    
    exports.Lexical.prototype.MultiLineComment = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("/*"), c.Maybe(this.MultiLineCommentChars())), g.Literal("*/"));
        }.bind(this), 'MultiLineComment'));
    };
})();

// MultiLineCommentChars: MultiLineNotAsteriskChar MultiLineCommentChars? | "*" PostAsteriskCommentChars?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.MultiLineCommentChars = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(this.MultiLineNotAsteriskChar(), c.Maybe(this.MultiLineCommentChars())), c.Seq(g.Literal("*"), c.Maybe(this.PostAsteriskCommentChars())));
        }.bind(this), 'MultiLineCommentChars'));
    };
})();

// PostAsteriskCommentChars: MultiLineNotForwardSlashOrAsteriskChar MultiLineCommentChars? | "*" PostAsteriskCommentChars?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.PostAsteriskCommentChars = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(this.MultiLineNotForwardSlashOrAsteriskChar(), c.Maybe(this.MultiLineCommentChars())), c.Seq(g.Literal("*"), c.Maybe(this.PostAsteriskCommentChars())));
        }.bind(this), 'PostAsteriskCommentChars'));
    };
})();

// MultiLineNotAsteriskChar: SourceCharacter & ~ "*";
(function() {
    var $cache;
    
    exports.Lexical.prototype.MultiLineNotAsteriskChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(g.Literal("*")));
        }.bind(this), 'MultiLineNotAsteriskChar'));
    };
})();

// MultiLineNotForwardSlashOrAsteriskChar: SourceCharacter & ~ ("/" | "*");
(function() {
    var $cache;
    
    exports.Lexical.prototype.MultiLineNotForwardSlashOrAsteriskChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(c.Or(g.Literal("/"), g.Literal("*"))));
        }.bind(this), 'MultiLineNotForwardSlashOrAsteriskChar'));
    };
})();

// SingleLineComment: "//" SingleLineCommentChars?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleLineComment = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(g.Literal("//"), c.Maybe(this.SingleLineCommentChars()));
        }.bind(this), 'SingleLineComment'));
    };
})();

// SingleLineCommentChars: SingleLineCommentChar SingleLineCommentChars?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleLineCommentChars = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.SingleLineCommentChar(), c.Maybe(this.SingleLineCommentChars()));
        }.bind(this), 'SingleLineCommentChars'));
    };
})();

// SingleLineCommentChar: SourceCharacter & ~ LineTerminator;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleLineCommentChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(this.LineTerminator()));
        }.bind(this), 'SingleLineCommentChar'));
    };
})();

// Token: IdentifierName | Punctuator | NumericLiteral | StringLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Token = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.IdentifierName(), this.Punctuator()), this.NumericLiteral()), this.StringLiteral());
        }.bind(this), 'Token'));
    };
})();

// Identifier: IdentifierName & ~ ReservedWord;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Identifier = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.IdentifierName(), c.Not(this.ReservedWord()));
        }.bind(this), 'Identifier'));
    };
})();

// IdentifierName: IdentifierStart | IdentifierName IdentifierPart;
(function() {
    var $cache;
    
    exports.Lexical.prototype.IdentifierName = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.IdentifierStart(), c.Seq(this.IdentifierName(), this.IdentifierPart()));
        }.bind(this), 'IdentifierName'));
    };
})();

// IdentifierStart: UnicodeLetter | "$" | "_" | "\\" UnicodeEscapeSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.IdentifierStart = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.UnicodeLetter(), g.Literal("$")), g.Literal("_")), c.Seq(g.Literal("\\"), this.UnicodeEscapeSequence()));
        }.bind(this), 'IdentifierStart'));
    };
})();

// IdentifierPart: IdentifierStart | UnicodeCombiningMark | UnicodeDigit | UnicodeConnectorPunctuation | "\u200c" | "\u200d";
(function() {
    var $cache;
    
    exports.Lexical.prototype.IdentifierPart = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(this.IdentifierStart(), this.UnicodeCombiningMark()), this.UnicodeDigit()), this.UnicodeConnectorPunctuation()), g.Literal("\u200c")), g.Literal("\u200d"));
        }.bind(this), 'IdentifierPart'));
    };
})();

// UnicodeLetter: [\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nl}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeLetter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Category("\\p{Lu}"), g.Category("\\p{Ll}")), g.Category("\\p{Lt}")), g.Category("\\p{Lm}")), g.Category("\\p{Lo}")), g.Category("\\p{Nl}"));
        }.bind(this), 'UnicodeLetter'));
    };
})();

// UnicodeCombiningMark: [\p{Mn}\p{Mc}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeCombiningMark = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Category("\\p{Mn}"), g.Category("\\p{Mc}"));
        }.bind(this), 'UnicodeCombiningMark'));
    };
})();

// UnicodeDigit: [\p{Nd}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Category("\\p{Nd}");
        }.bind(this), 'UnicodeDigit'));
    };
})();

// UnicodeConnectorPunctuation: [\p{Pc}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeConnectorPunctuation = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Category("\\p{Pc}");
        }.bind(this), 'UnicodeConnectorPunctuation'));
    };
})();

// ReservedWord: Keyword | FutureReservedWord | NullLiteral | BooleanLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ReservedWord = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.Keyword(), this.FutureReservedWord()), this.NullLiteral()), this.BooleanLiteral());
        }.bind(this), 'ReservedWord'));
    };
})();

// Keyword: "break" | "do" | "instanceof" | "typeof" | "case" | "else" | "new" | "var" | "catch" | "finally" | "return" | "void" | "continue" | "for" | "switch" | "while" | "debugger" | "function" | "this" | "with" | "default" | "if" | "throw" | " " | "delete" | "in" | "try";
(function() {
    var $cache;
    
    exports.Lexical.prototype.Keyword = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("break"), g.Literal("do")), g.Literal("instanceof")), g.Literal("typeof")), g.Literal("case")), g.Literal("else")), g.Literal("new")), g.Literal("var")), g.Literal("catch")), g.Literal("finally")), g.Literal("return")), g.Literal("void")), g.Literal("continue")), g.Literal("for")), g.Literal("switch")), g.Literal("while")), g.Literal("debugger")), g.Literal("function")), g.Literal("this")), g.Literal("with")), g.Literal("default")), g.Literal("if")), g.Literal("throw")), g.Literal(" ")), g.Literal("delete")), g.Literal("in")), g.Literal("try"));
        }.bind(this), 'Keyword'));
    };
})();

// FutureReservedWord: "class" | "enum" | "extends" | "super" | "const" | "export" | "import" | "implements" | "let" | "private" | "public" | "interface" | "package" | "protected" | "static" | "yield";
(function() {
    var $cache;
    
    exports.Lexical.prototype.FutureReservedWord = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("class"), g.Literal("enum")), g.Literal("extends")), g.Literal("super")), g.Literal("const")), g.Literal("export")), g.Literal("import")), g.Literal("implements")), g.Literal("let")), g.Literal("private")), g.Literal("public")), g.Literal("interface")), g.Literal("package")), g.Literal("protected")), g.Literal("static")), g.Literal("yield"));
        }.bind(this), 'FutureReservedWord'));
    };
})();

// Punctuator: "{" | "}" | "(" | ")" | "[" | "]" | "." | ";" | "," | "<" | ">" | "<=" | ">=" | "==" | "!=" | "===" | "!==" | "+" | "-" | "*" | "%" | "++" | "--" | "<<" | ">>" | ">>>" | "&" | "|" | "^" | "!" | "~" | "&&" | "||" | "?" | ":" | "=" | "+=" | "-=" | "*=" | "%=" | "<<=" | ">>=" | ">>>=" | "&=" | "|=" | "^=";
(function() {
    var $cache;
    
    exports.Lexical.prototype.Punctuator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("{"), g.Literal("}")), g.Literal("(")), g.Literal(")")), g.Literal("[")), g.Literal("]")), g.Literal(".")), g.Literal(";")), g.Literal(",")), g.Literal("<")), g.Literal(">")), g.Literal("<=")), g.Literal(">=")), g.Literal("==")), g.Literal("!=")), g.Literal("===")), g.Literal("!==")), g.Literal("+")), g.Literal("-")), g.Literal("*")), g.Literal("%")), g.Literal("++")), g.Literal("--")), g.Literal("<<")), g.Literal(">>")), g.Literal(">>>")), g.Literal("&")), g.Literal("|")), g.Literal("^")), g.Literal("!")), g.Literal("~")), g.Literal("&&")), g.Literal("||")), g.Literal("?")), g.Literal(":")), g.Literal("=")), g.Literal("+=")), g.Literal("-=")), g.Literal("*=")), g.Literal("%=")), g.Literal("<<=")), g.Literal(">>=")), g.Literal(">>>=")), g.Literal("&=")), g.Literal("|=")), g.Literal("^="));
        }.bind(this), 'Punctuator'));
    };
})();

// DivPunctuator: "/" | "/=";
(function() {
    var $cache;
    
    exports.Lexical.prototype.DivPunctuator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("/"), g.Literal("/="));
        }.bind(this), 'DivPunctuator'));
    };
})();

// Literal: NullLiteral | BooleanLiteral | NumericLiteral | StringLiteral | RegularExpressionLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Literal = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.NullLiteral(), this.BooleanLiteral()), this.NumericLiteral()), this.StringLiteral()), this.RegularExpressionLiteral());
        }.bind(this), 'Literal'));
    };
})();

// NullLiteral: "null";
(function() {
    var $cache;
    
    exports.Lexical.prototype.NullLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Literal("null");
        }.bind(this), 'NullLiteral'));
    };
})();

// BooleanLiteral: "true" | "false";
(function() {
    var $cache;
    
    exports.Lexical.prototype.BooleanLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("true"), g.Literal("false"));
        }.bind(this), 'BooleanLiteral'));
    };
})();

// NumericLiteral: DecimalLiteral | HexIntegerLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.NumericLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.DecimalLiteral(), this.HexIntegerLiteral());
        }.bind(this), 'NumericLiteral'));
    };
})();

// DecimalLiteral: DecimalIntegerLiteral "." DecimalDigits? ExponentPart? | "." DecimalDigits ExponentPart? | DecimalIntegerLiteral ExponentPart?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DecimalLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(c.Seq(c.Seq(this.DecimalIntegerLiteral(), g.Literal(".")), c.Maybe(this.DecimalDigits())), c.Maybe(this.ExponentPart())), c.Seq(c.Seq(g.Literal("."), this.DecimalDigits()), c.Maybe(this.ExponentPart()))), c.Seq(this.DecimalIntegerLiteral(), c.Maybe(this.ExponentPart())));
        }.bind(this), 'DecimalLiteral'));
    };
})();

// DecimalIntegerLiteral: "0" | NonZeroDigit DecimalDigits?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DecimalIntegerLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("0"), c.Seq(this.NonZeroDigit(), c.Maybe(this.DecimalDigits())));
        }.bind(this), 'DecimalIntegerLiteral'));
    };
})();

// DecimalDigits: DecimalDigit | DecimalDigits DecimalDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DecimalDigits = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.DecimalDigit(), c.Seq(this.DecimalDigits(), this.DecimalDigit()));
        }.bind(this), 'DecimalDigits'));
    };
})();

// DecimalDigit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
(function() {
    var $cache;
    
    exports.Lexical.prototype.DecimalDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7")), g.Literal("8")), g.Literal("9"));
        }.bind(this), 'DecimalDigit'));
    };
})();

// NonZeroDigit: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
(function() {
    var $cache;
    
    exports.Lexical.prototype.NonZeroDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("1"), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7")), g.Literal("8")), g.Literal("9"));
        }.bind(this), 'NonZeroDigit'));
    };
})();

// ExponentPart: ExponentIndicator SignedInteger;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ExponentPart = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.ExponentIndicator(), this.SignedInteger());
        }.bind(this), 'ExponentPart'));
    };
})();

// ExponentIndicator: "e" | "E";
(function() {
    var $cache;
    
    exports.Lexical.prototype.ExponentIndicator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("e"), g.Literal("E"));
        }.bind(this), 'ExponentIndicator'));
    };
})();

// SignedInteger: DecimalDigits | "+" DecimalDigits | "-" DecimalDigits;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SignedInteger = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.DecimalDigits(), c.Seq(g.Literal("+"), this.DecimalDigits())), c.Seq(g.Literal("-"), this.DecimalDigits()));
        }.bind(this), 'SignedInteger'));
    };
})();

// HexIntegerLiteral: "0x" HexDigit | "0X" HexDigit | HexIntegerLiteral HexDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.HexIntegerLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(g.Literal("0x"), this.HexDigit()), c.Seq(g.Literal("0X"), this.HexDigit())), c.Seq(this.HexIntegerLiteral(), this.HexDigit()));
        }.bind(this), 'HexIntegerLiteral'));
    };
})();

// HexDigit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
(function() {
    var $cache;
    
    exports.Lexical.prototype.HexDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7")), g.Literal("8")), g.Literal("9")), g.Literal("a")), g.Literal("b")), g.Literal("c")), g.Literal("d")), g.Literal("e")), g.Literal("f")), g.Literal("A")), g.Literal("B")), g.Literal("C")), g.Literal("D")), g.Literal("E")), g.Literal("F"));
        }.bind(this), 'HexDigit'));
    };
})();

// StringLiteral: "\"" DoubleStringCharacters? "\"" | "'" SingleStringCharacters? "'";
(function() {
    var $cache;
    
    exports.Lexical.prototype.StringLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(g.Literal("\""), c.Maybe(this.DoubleStringCharacters())), g.Literal("\"")), c.Seq(c.Seq(g.Literal("'"), c.Maybe(this.SingleStringCharacters())), g.Literal("'")));
        }.bind(this), 'StringLiteral'));
    };
})();

// DoubleStringCharacters: DoubleStringCharacter DoubleStringCharacters?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DoubleStringCharacters = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.DoubleStringCharacter(), c.Maybe(this.DoubleStringCharacters()));
        }.bind(this), 'DoubleStringCharacters'));
    };
})();

// SingleStringCharacters: SingleStringCharacter SingleStringCharacters?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleStringCharacters = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.SingleStringCharacter(), c.Maybe(this.SingleStringCharacters()));
        }.bind(this), 'SingleStringCharacters'));
    };
})();

// DoubleStringCharacter: SourceCharacter & ~ ("\"" | "\\" | LineTerminator) | "\\" EscapeSequence | LineContinuation;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DoubleStringCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.And(this.SourceCharacter(), c.Not(c.Or(c.Or(g.Literal("\""), g.Literal("\\")), this.LineTerminator()))), c.Seq(g.Literal("\\"), this.EscapeSequence())), this.LineContinuation());
        }.bind(this), 'DoubleStringCharacter'));
    };
})();

// SingleStringCharacter: SourceCharacter & ~ ("'" | "\\" | LineTerminator) | "\\" EscapeSequence | LineContinuation;
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleStringCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.And(this.SourceCharacter(), c.Not(c.Or(c.Or(g.Literal("'"), g.Literal("\\")), this.LineTerminator()))), c.Seq(g.Literal("\\"), this.EscapeSequence())), this.LineContinuation());
        }.bind(this), 'SingleStringCharacter'));
    };
})();

// LineContinuation: "\\" LineTerminatorSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.LineContinuation = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(g.Literal("\\"), this.LineTerminatorSequence());
        }.bind(this), 'LineContinuation'));
    };
})();

// EscapeSequence: CharacterEscapeSequence | "0" ?= ~ DecimalDigit | HexEscapeSequence | UnicodeEscapeSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.EscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.CharacterEscapeSequence(), c.Seq(g.Literal("0"), l.Look(c.Not(this.DecimalDigit())))), this.HexEscapeSequence()), this.UnicodeEscapeSequence());
        }.bind(this), 'EscapeSequence'));
    };
})();

// CharacterEscapeSequence: SingleEscapeCharacter | NonEscapeCharacter;
(function() {
    var $cache;
    
    exports.Lexical.prototype.CharacterEscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.SingleEscapeCharacter(), this.NonEscapeCharacter());
        }.bind(this), 'CharacterEscapeSequence'));
    };
})();

// SingleEscapeCharacter: "'" | "\"" | "\\" | "b" | "f" | "n" | "r" | "t" | "v";
(function() {
    var $cache;
    
    exports.Lexical.prototype.SingleEscapeCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("'"), g.Literal("\"")), g.Literal("\\")), g.Literal("b")), g.Literal("f")), g.Literal("n")), g.Literal("r")), g.Literal("t")), g.Literal("v"));
        }.bind(this), 'SingleEscapeCharacter'));
    };
})();

// NonEscapeCharacter: SourceCharacter & ~ (EscapeCharacter | LineTerminator);
(function() {
    var $cache;
    
    exports.Lexical.prototype.NonEscapeCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(c.Or(this.EscapeCharacter(), this.LineTerminator())));
        }.bind(this), 'NonEscapeCharacter'));
    };
})();

// EscapeCharacter: SingleEscapeCharacter | DecimalDigit | "x" | "u";
(function() {
    var $cache;
    
    exports.Lexical.prototype.EscapeCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.SingleEscapeCharacter(), this.DecimalDigit()), g.Literal("x")), g.Literal("u"));
        }.bind(this), 'EscapeCharacter'));
    };
})();

// HexEscapeSequence: "x" HexDigit HexDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.HexEscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("x"), this.HexDigit()), this.HexDigit());
        }.bind(this), 'HexEscapeSequence'));
    };
})();

// UnicodeEscapeSequence: "u" HexDigit HexDigit HexDigit HexDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeEscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("u"), this.HexDigit()), this.HexDigit()), this.HexDigit()), this.HexDigit());
        }.bind(this), 'UnicodeEscapeSequence'));
    };
})();

// RegularExpressionLiteral: "/" RegularExpressionBody "/" RegularExpressionFlags;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(g.Literal("/"), this.RegularExpressionBody()), g.Literal("/")), this.RegularExpressionFlags());
        }.bind(this), 'RegularExpressionLiteral'));
    };
})();

// RegularExpressionBody: RegularExpressionFirstChar RegularExpressionChars;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionBody = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.RegularExpressionFirstChar(), this.RegularExpressionChars());
        }.bind(this), 'RegularExpressionBody'));
    };
})();

// RegularExpressionChars: "" | RegularExpressionChars RegularExpressionChar;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionChars = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(""), c.Seq(this.RegularExpressionChars(), this.RegularExpressionChar()));
        }.bind(this), 'RegularExpressionChars'));
    };
})();

// RegularExpressionFirstChar: RegularExpressionNonTerminator & ~ ("*" | "\\" | "/" | "[") | RegularExpressionBackslashSequence | RegularExpressionClass;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionFirstChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.And(this.RegularExpressionNonTerminator(), c.Not(c.Or(c.Or(c.Or(g.Literal("*"), g.Literal("\\")), g.Literal("/")), g.Literal("[")))), this.RegularExpressionBackslashSequence()), this.RegularExpressionClass());
        }.bind(this), 'RegularExpressionFirstChar'));
    };
})();

// RegularExpressionChar: RegularExpressionNonTerminator & ~ ("\\" | "/" | "[") | RegularExpressionBackslashSequence | RegularExpressionClass;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.And(this.RegularExpressionNonTerminator(), c.Not(c.Or(c.Or(g.Literal("\\"), g.Literal("/")), g.Literal("[")))), this.RegularExpressionBackslashSequence()), this.RegularExpressionClass());
        }.bind(this), 'RegularExpressionChar'));
    };
})();

// RegularExpressionBackslashSequence: "\\" RegularExpressionNonTerminator;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionBackslashSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(g.Literal("\\"), this.RegularExpressionNonTerminator());
        }.bind(this), 'RegularExpressionBackslashSequence'));
    };
})();

// RegularExpressionNonTerminator: SourceCharacter & ~ LineTerminator;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionNonTerminator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(this.LineTerminator()));
        }.bind(this), 'RegularExpressionNonTerminator'));
    };
})();

// RegularExpressionClass: "[" RegularExpressionClassChars "]";
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionClass = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("["), this.RegularExpressionClassChars()), g.Literal("]"));
        }.bind(this), 'RegularExpressionClass'));
    };
})();

// RegularExpressionClassChars: "" | RegularExpressionClassChars RegularExpressionClassChar;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionClassChars = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(""), c.Seq(this.RegularExpressionClassChars(), this.RegularExpressionClassChar()));
        }.bind(this), 'RegularExpressionClassChars'));
    };
})();

// RegularExpressionClassChar: RegularExpressionNonTerminator & ~ ("]" | "\\") | RegularExpressionBackslashSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionClassChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.And(this.RegularExpressionNonTerminator(), c.Not(c.Or(g.Literal("]"), g.Literal("\\")))), this.RegularExpressionBackslashSequence());
        }.bind(this), 'RegularExpressionClassChar'));
    };
})();

// RegularExpressionFlags: "" | RegularExpressionFlags IdentifierPart;
(function() {
    var $cache;
    
    exports.Lexical.prototype.RegularExpressionFlags = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(""), c.Seq(this.RegularExpressionFlags(), this.IdentifierPart()));
        }.bind(this), 'RegularExpressionFlags'));
    };
})();

// Pattern: Disjunction;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Pattern = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.Disjunction();
        }.bind(this), 'Pattern'));
    };
})();

// Disjunction: Alternative | Alternative "|" Disjunction;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Disjunction = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.Alternative(), c.Seq(c.Seq(this.Alternative(), g.Literal("|")), this.Disjunction()));
        }.bind(this), 'Disjunction'));
    };
})();

// Alternative: "" | Alternative Term;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Alternative = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(""), c.Seq(this.Alternative(), this.Term()));
        }.bind(this), 'Alternative'));
    };
})();

// Term: Assertion | Atom | Atom Quantifier;
(function() {
    var $cache;
    
    exports.Lexical.prototype.Term = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.Assertion(), this.Atom()), c.Seq(this.Atom(), this.Quantifier()));
        }.bind(this), 'Term'));
    };
})();

// Assertion: "^" | "$" | "\\" "b" | "\\" "B" | "(" "?" "=" Disjunction ")" | "(" "?" "!" Disjunction ")";
(function() {
    var $cache;
    
    exports.Lexical.prototype.Assertion = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("^"), g.Literal("$")), c.Seq(g.Literal("\\"), g.Literal("b"))), c.Seq(g.Literal("\\"), g.Literal("B"))), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("("), g.Literal("?")), g.Literal("=")), this.Disjunction()), g.Literal(")"))), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("("), g.Literal("?")), g.Literal("!")), this.Disjunction()), g.Literal(")")));
        }.bind(this), 'Assertion'));
    };
})();

// Quantifier: QuantifierPrefix | QuantifierPrefix "?";
(function() {
    var $cache;
    
    exports.Lexical.prototype.Quantifier = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.QuantifierPrefix(), c.Seq(this.QuantifierPrefix(), g.Literal("?")));
        }.bind(this), 'Quantifier'));
    };
})();

// QuantifierPrefix: "*" | "+" | "?" | "{" DecimalDigits "}" | "{" DecimalDigits "," "}" | "{" DecimalDigits "," DecimalDigits "}";
(function() {
    var $cache;
    
    exports.Lexical.prototype.QuantifierPrefix = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("*"), g.Literal("+")), g.Literal("?")), c.Seq(c.Seq(g.Literal("{"), this.DecimalDigits()), g.Literal("}"))), c.Seq(c.Seq(c.Seq(g.Literal("{"), this.DecimalDigits()), g.Literal(",")), g.Literal("}"))), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), this.DecimalDigits()), g.Literal(",")), this.DecimalDigits()), g.Literal("}")));
        }.bind(this), 'QuantifierPrefix'));
    };
})();

// Atom: PatternCharacter | "." | "\\" AtomEscape | CharacterClass | "(" Disjunction ")" | "(" "?" ":" Disjunction ")";
(function() {
    var $cache;
    
    exports.Lexical.prototype.Atom = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(this.PatternCharacter(), g.Literal(".")), c.Seq(g.Literal("\\"), this.AtomEscape())), this.CharacterClass()), c.Seq(c.Seq(g.Literal("("), this.Disjunction()), g.Literal(")"))), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("("), g.Literal("?")), g.Literal(":")), this.Disjunction()), g.Literal(")")));
        }.bind(this), 'Atom'));
    };
})();

// PatternCharacter: SourceCharacter & ~ ("^" | "$" | "\\" | "." | "*" | "+" | "?" | "(" | ")" | "[" | "]" | "{" | "}" | "|");
(function() {
    var $cache;
    
    exports.Lexical.prototype.PatternCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.And(this.SourceCharacter(), c.Not(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("^"), g.Literal("$")), g.Literal("\\")), g.Literal(".")), g.Literal("*")), g.Literal("+")), g.Literal("?")), g.Literal("(")), g.Literal(")")), g.Literal("[")), g.Literal("]")), g.Literal("{")), g.Literal("}")), g.Literal("|"))));
        }.bind(this), 'PatternCharacter'));
    };
})();

// AtomEscape: DecimalEscape | CharacterEscape | CharacterClassEscape;
(function() {
    var $cache;
    
    exports.Lexical.prototype.AtomEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.DecimalEscape(), this.CharacterEscape()), this.CharacterClassEscape());
        }.bind(this), 'AtomEscape'));
    };
})();

// CharacterEscape: ControlEscape | "c" ControlLetter | HexEscapeSequence | UnicodeEscapeSequence | IdentityEscape;
(function() {
    var $cache;
    
    exports.Lexical.prototype.CharacterEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.ControlEscape(), c.Seq(g.Literal("c"), this.ControlLetter())), this.HexEscapeSequence()), this.UnicodeEscapeSequence()), this.IdentityEscape());
        }.bind(this), 'CharacterEscape'));
    };
})();

// ControlEscape: "f" | "n" | "r" | "t" | "v";
(function() {
    var $cache;
    
    exports.Lexical.prototype.ControlEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(g.Literal("f"), g.Literal("n")), g.Literal("r")), g.Literal("t")), g.Literal("v"));
        }.bind(this), 'ControlEscape'));
    };
})();

// ControlLetter: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
(function() {
    var $cache;
    
    exports.Lexical.prototype.ControlLetter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("a"), g.Literal("b")), g.Literal("c")), g.Literal("d")), g.Literal("e")), g.Literal("f")), g.Literal("g")), g.Literal("h")), g.Literal("i")), g.Literal("j")), g.Literal("k")), g.Literal("l")), g.Literal("m")), g.Literal("n")), g.Literal("o")), g.Literal("p")), g.Literal("q")), g.Literal("r")), g.Literal("s")), g.Literal("t")), g.Literal("u")), g.Literal("v")), g.Literal("w")), g.Literal("x")), g.Literal("y")), g.Literal("z")), g.Literal("A")), g.Literal("B")), g.Literal("C")), g.Literal("D")), g.Literal("E")), g.Literal("F")), g.Literal("G")), g.Literal("H")), g.Literal("I")), g.Literal("J")), g.Literal("K")), g.Literal("L")), g.Literal("M")), g.Literal("N")), g.Literal("O")), g.Literal("P")), g.Literal("Q")), g.Literal("R")), g.Literal("S")), g.Literal("T")), g.Literal("U")), g.Literal("V")), g.Literal("W")), g.Literal("X")), g.Literal("Y")), g.Literal("Z"));
        }.bind(this), 'ControlLetter'));
    };
})();

// IdentityEscape: SourceCharacter & ~ IdentifierPart | "\u200d" | "\u200c";
(function() {
    var $cache;
    
    exports.Lexical.prototype.IdentityEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.And(this.SourceCharacter(), c.Not(this.IdentifierPart())), g.Literal("\u200d")), g.Literal("\u200c"));
        }.bind(this), 'IdentityEscape'));
    };
})();

// DecimalEscape: DecimalIntegerLiteral ?= ~ DecimalDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.DecimalEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.DecimalIntegerLiteral(), l.Look(c.Not(this.DecimalDigit())));
        }.bind(this), 'DecimalEscape'));
    };
})();

// CharacterClassEscape: "d" | "D" | "s" | "S" | "w" | "W";
(function() {
    var $cache;
    
    exports.Lexical.prototype.CharacterClassEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("d"), g.Literal("D")), g.Literal("s")), g.Literal("S")), g.Literal("w")), g.Literal("W"));
        }.bind(this), 'CharacterClassEscape'));
    };
})();

// CharacterClass: "[" ?= ~ "^" ClassRanges "]" | "[" "^" ClassRanges "]";
(function() {
    var $cache;
    
    exports.Lexical.prototype.CharacterClass = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(c.Seq(g.Literal("["), l.Look(c.Not(g.Literal("^")))), this.ClassRanges()), g.Literal("]")), c.Seq(c.Seq(c.Seq(g.Literal("["), g.Literal("^")), this.ClassRanges()), g.Literal("]")));
        }.bind(this), 'CharacterClass'));
    };
})();

// ClassRanges: "" | NonemptyClassRanges;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ClassRanges = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(""), this.NonemptyClassRanges());
        }.bind(this), 'ClassRanges'));
    };
})();

// NonemptyClassRanges: ClassAtom | ClassAtom NonemptyClassRangesNoDash | ClassAtom "-" ClassAtom ClassRanges;
(function() {
    var $cache;
    
    exports.Lexical.prototype.NonemptyClassRanges = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.ClassAtom(), c.Seq(this.ClassAtom(), this.NonemptyClassRangesNoDash())), c.Seq(c.Seq(c.Seq(this.ClassAtom(), g.Literal("-")), this.ClassAtom()), this.ClassRanges()));
        }.bind(this), 'NonemptyClassRanges'));
    };
})();

// NonemptyClassRangesNoDash: ClassAtom | ClassAtomNoDash NonemptyClassRangesNoDash | ClassAtomNoDash "-" ClassAtom ClassRanges;
(function() {
    var $cache;
    
    exports.Lexical.prototype.NonemptyClassRangesNoDash = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.ClassAtom(), c.Seq(this.ClassAtomNoDash(), this.NonemptyClassRangesNoDash())), c.Seq(c.Seq(c.Seq(this.ClassAtomNoDash(), g.Literal("-")), this.ClassAtom()), this.ClassRanges()));
        }.bind(this), 'NonemptyClassRangesNoDash'));
    };
})();

// ClassAtom: "-" | ClassAtomNoDash;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ClassAtom = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("-"), this.ClassAtomNoDash());
        }.bind(this), 'ClassAtom'));
    };
})();

// ClassAtomNoDash: SourceCharacter & ~ ("\\" | "]" | "-") | "\\" ClassEscape;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ClassAtomNoDash = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.And(this.SourceCharacter(), c.Not(c.Or(c.Or(g.Literal("\\"), g.Literal("]")), g.Literal("-")))), c.Seq(g.Literal("\\"), this.ClassEscape()));
        }.bind(this), 'ClassAtomNoDash'));
    };
})();

// ClassEscape: DecimalEscape | "b" | CharacterEscape | CharacterClassEscape;
(function() {
    var $cache;
    
    exports.Lexical.prototype.ClassEscape = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.DecimalEscape(), g.Literal("b")), this.CharacterEscape()), this.CharacterClassEscape());
        }.bind(this), 'ClassEscape'));
    };
})();

// JSONWhiteSpace: "\t" | "\r" | "\n" | " ";
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONWhiteSpace = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(g.Literal("\t"), g.Literal("\r")), g.Literal("\n")), g.Literal(" "));
        }.bind(this), 'JSONWhiteSpace'));
    };
})();

// JSONString: "\"" JSONStringCharacters? "\"";
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONString = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("\""), c.Maybe(this.JSONStringCharacters())), g.Literal("\""));
        }.bind(this), 'JSONString'));
    };
})();

// JSONStringCharacters: JSONStringCharacter JSONStringCharacters?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONStringCharacters = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.JSONStringCharacter(), c.Maybe(this.JSONStringCharacters()));
        }.bind(this), 'JSONStringCharacters'));
    };
})();

// JSONStringCharacter: SourceCharacter & ~ ("\"" | "\\" | [\u0000-\u001f]) | "\\" JSONEscapeSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONStringCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.And(this.SourceCharacter(), c.Not(c.Or(c.Or(g.Literal("\""), g.Literal("\\")), g.Range("\\u0000", "\\u001f")))), c.Seq(g.Literal("\\"), this.JSONEscapeSequence()));
        }.bind(this), 'JSONStringCharacter'));
    };
})();

// JSONEscapeSequence: JSONEscapeCharacter | UnicodeEscapeSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONEscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.JSONEscapeCharacter(), this.UnicodeEscapeSequence());
        }.bind(this), 'JSONEscapeSequence'));
    };
})();

// JSONEscapeCharacter: "\"" | "/" | "\\" | "b" | "f" | "n" | "r" | "t";
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONEscapeCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\""), g.Literal("/")), g.Literal("\\")), g.Literal("b")), g.Literal("f")), g.Literal("n")), g.Literal("r")), g.Literal("t"));
        }.bind(this), 'JSONEscapeCharacter'));
    };
})();

// JSONNumber: "-"? DecimalIntegerLiteral JSONFraction? ExponentPart?;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONNumber = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Maybe(g.Literal("-")), this.DecimalIntegerLiteral()), c.Maybe(this.JSONFraction())), c.Maybe(this.ExponentPart()));
        }.bind(this), 'JSONNumber'));
    };
})();

// JSONFraction: "." DecimalDigits;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONFraction = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(g.Literal("."), this.DecimalDigits());
        }.bind(this), 'JSONFraction'));
    };
})();

// JSONNullLiteral: NullLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONNullLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.NullLiteral();
        }.bind(this), 'JSONNullLiteral'));
    };
})();

// JSONBooleanLiteral: BooleanLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.JSONBooleanLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.BooleanLiteral();
        }.bind(this), 'JSONBooleanLiteral'));
    };
})();

// NumericLiteral: DecimalLiteral | HexIntegerLiteral | OctalIntegerLiteral;
(function() {
    var $cache;
    
    exports.Lexical.prototype.NumericLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.DecimalLiteral(), this.HexIntegerLiteral()), this.OctalIntegerLiteral());
        }.bind(this), 'NumericLiteral'));
    };
})();

// OctalIntegerLiteral: "0" OctalDigit | OctalIntegerLiteral OctalDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.OctalIntegerLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(g.Literal("0"), this.OctalDigit()), c.Seq(this.OctalIntegerLiteral(), this.OctalDigit()));
        }.bind(this), 'OctalIntegerLiteral'));
    };
})();

// OctalDigit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
(function() {
    var $cache;
    
    exports.Lexical.prototype.OctalDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7"));
        }.bind(this), 'OctalDigit'));
    };
})();

// EscapeSequence: CharacterEscapeSequence | OctalEscapeSequence | HexEscapeSequence | UnicodeEscapeSequence;
(function() {
    var $cache;
    
    exports.Lexical.prototype.EscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.CharacterEscapeSequence(), this.OctalEscapeSequence()), this.HexEscapeSequence()), this.UnicodeEscapeSequence());
        }.bind(this), 'EscapeSequence'));
    };
})();

// OctalEscapeSequence: OctalDigit ?= ~ DecimalDigit | ZeroToThree OctalDigit ?= ~ DecimalDigit | FourToSeven OctalDigit | ZeroToThree OctalDigit OctalDigit;
(function() {
    var $cache;
    
    exports.Lexical.prototype.OctalEscapeSequence = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Seq(this.OctalDigit(), l.Look(c.Not(this.DecimalDigit()))), c.Seq(c.Seq(this.ZeroToThree(), this.OctalDigit()), l.Look(c.Not(this.DecimalDigit())))), c.Seq(this.FourToSeven(), this.OctalDigit())), c.Seq(c.Seq(this.ZeroToThree(), this.OctalDigit()), this.OctalDigit()));
        }.bind(this), 'OctalEscapeSequence'));
    };
})();

// ZeroToThree: "0" | "1" | "2" | "3";
(function() {
    var $cache;
    
    exports.Lexical.prototype.ZeroToThree = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3"));
        }.bind(this), 'ZeroToThree'));
    };
})();

// FourToSeven: "4" | "5" | "6" | "7";
(function() {
    var $cache;
    
    exports.Lexical.prototype.FourToSeven = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(g.Literal("4"), g.Literal("5")), g.Literal("6")), g.Literal("7"));
        }.bind(this), 'FourToSeven'));
    };
})();

// export grammar Syntactic;
var Syntactic = exports.Syntactic = function() {};

// PrimaryExpression: "this" | Identifier | Literal | ArrayLiteral | ObjectLiteral | "(" LT*! Expression LT*! ")";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PrimaryExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("this"), this.Identifier()), this.Literal()), this.ArrayLiteral()), this.ObjectLiteral()), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("("), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")));
        }.bind(this), 'PrimaryExpression'));
    };
})();

// ArrayLiteral: "[" LT*! Elision? LT*! "]" | "[" LT*! ElementList LT*! "]" | "[" LT*! ElementList LT*! "," LT*! Elision? LT*! "]";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ArrayLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("["), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Elision())), c.Ignore(c.Any(this.LT()))), g.Literal("]")), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("["), c.Ignore(c.Any(this.LT()))), this.ElementList()), c.Ignore(c.Any(this.LT()))), g.Literal("]"))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("["), c.Ignore(c.Any(this.LT()))), this.ElementList()), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Elision())), c.Ignore(c.Any(this.LT()))), g.Literal("]")));
        }.bind(this), 'ArrayLiteral'));
    };
})();

// ElementList: Elision? LT*! AssignmentExpression | ElementList LT*! "," LT*! Elision? LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ElementList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(c.Maybe(this.Elision()), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.ElementList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Elision())), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()));
        }.bind(this), 'ElementList'));
    };
})();

// Elision: "," | Elision LT*! ",";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Elision = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal(","), c.Seq(c.Seq(this.Elision(), c.Ignore(c.Any(this.LT()))), g.Literal(",")));
        }.bind(this), 'Elision'));
    };
})();

// ObjectLiteral: "{" LT*! "}" | "{" LT*! PropertyNameAndValueList LT*! "}" | "{" LT*! PropertyNameAndValueList LT*! "," LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ObjectLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), g.Literal("}")), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), this.PropertyNameAndValueList()), c.Ignore(c.Any(this.LT()))), g.Literal("}"))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), this.PropertyNameAndValueList()), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), g.Literal("}")));
        }.bind(this), 'ObjectLiteral'));
    };
})();

// PropertyNameAndValueList: PropertyAssignment | PropertyNameAndValueList LT*! "," LT*! PropertyAssignment;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyNameAndValueList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.PropertyAssignment(), c.Seq(c.Seq(c.Seq(c.Seq(this.PropertyNameAndValueList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.PropertyAssignment()));
        }.bind(this), 'PropertyNameAndValueList'));
    };
})();

// PropertyAssignment: PropertyName LT*! ":" LT*! AssignmentExpression | "get" LT*! PropertyName LT*! "(" LT*! ")" LT*! "{" LT*! FunctionBody LT*! "}" | "set" LT*! PropertyName LT*! "(" LT*! PropertySetParameterList LT*! ")" LT*! "{" LT*! FunctionBody LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyAssignment = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(this.PropertyName(), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("get"), c.Ignore(c.Any(this.LT()))), this.PropertyName()), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), g.Literal("{")), c.Ignore(c.Any(this.LT()))), this.FunctionBody()), c.Ignore(c.Any(this.LT()))), g.Literal("}"))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("set"), c.Ignore(c.Any(this.LT()))), this.PropertyName()), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.PropertySetParameterList()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), g.Literal("{")), c.Ignore(c.Any(this.LT()))), this.FunctionBody()), c.Ignore(c.Any(this.LT()))), g.Literal("}")));
        }.bind(this), 'PropertyAssignment'));
    };
})();

// PropertyName: IdentifierName | StringLiteral | NumericLiteral;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyName = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.IdentifierName(), this.StringLiteral()), this.NumericLiteral());
        }.bind(this), 'PropertyName'));
    };
})();

// PropertySetParameterList: Identifier;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertySetParameterList = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.Identifier();
        }.bind(this), 'PropertySetParameterList'));
    };
})();

// MemberExpression: PrimaryExpression | FunctionExpression | MemberExpression LT*! "[" LT*! Expression LT*! "]" | MemberExpression LT*! "." LT*! IdentifierName | "new" LT*! MemberExpression LT*! Arguments;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.MemberExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.PrimaryExpression(), this.FunctionExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("[")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal("]"))), c.Seq(c.Seq(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(".")), c.Ignore(c.Any(this.LT()))), this.IdentifierName())), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("new"), c.Ignore(c.Any(this.LT()))), this.MemberExpression()), c.Ignore(c.Any(this.LT()))), this.Arguments()));
        }.bind(this), 'MemberExpression'));
    };
})();

// NewExpression: MemberExpression | "new" LT*! NewExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.NewExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.MemberExpression(), c.Seq(c.Seq(g.Literal("new"), c.Ignore(c.Any(this.LT()))), this.NewExpression()));
        }.bind(this), 'NewExpression'));
    };
})();

// CallExpression: MemberExpression LT*! Arguments | CallExpression LT*! Arguments | CallExpression LT*! "[" LT*! Expression LT*! "]" | CallExpression LT*! "." LT*! IdentifierName;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CallExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(this.LT()))), this.Arguments()), c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(this.LT()))), this.Arguments())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("[")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal("]"))), c.Seq(c.Seq(c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(".")), c.Ignore(c.Any(this.LT()))), this.IdentifierName()));
        }.bind(this), 'CallExpression'));
    };
})();

// Arguments: "(" LT*! ")" | "(" LT*! ArgumentList LT*! ")";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Arguments = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(g.Literal("("), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("("), c.Ignore(c.Any(this.LT()))), this.ArgumentList()), c.Ignore(c.Any(this.LT()))), g.Literal(")")));
        }.bind(this), 'Arguments'));
    };
})();

// ArgumentList: AssignmentExpression | ArgumentList LT*! "," LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ArgumentList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.AssignmentExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.ArgumentList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()));
        }.bind(this), 'ArgumentList'));
    };
})();

// LeftHandSideExpression: NewExpression | CallExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LeftHandSideExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.NewExpression(), this.CallExpression());
        }.bind(this), 'LeftHandSideExpression'));
    };
})();

// PostfixExpression: LeftHandSideExpression | LeftHandSideExpression (LT & ~ LineTerminator)*! "++" | LeftHandSideExpression (LT & ~ LineTerminator)*! "--";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PostfixExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.LeftHandSideExpression(), c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), g.Literal("++"))), c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), g.Literal("--")));
        }.bind(this), 'PostfixExpression'));
    };
})();

// UnaryExpression: PostfixExpression | "delete" LT*! UnaryExpression | "void" LT*! UnaryExpression | "typeof" LT*! UnaryExpression | "++" LT*! UnaryExpression | "--" LT*! UnaryExpression | "+" LT*! UnaryExpression | "-" LT*! UnaryExpression | "~" LT*! UnaryExpression | "!" LT*! UnaryExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.UnaryExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.PostfixExpression(), c.Seq(c.Seq(g.Literal("delete"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("void"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("typeof"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("++"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("--"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("+"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("-"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("~"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(g.Literal("!"), c.Ignore(c.Any(this.LT()))), this.UnaryExpression()));
        }.bind(this), 'UnaryExpression'));
    };
})();

// MultiplicativeExpression: UnaryExpression | MultiplicativeExpression LT*! "*" LT*! UnaryExpression | MultiplicativeExpression LT*! "/" LT*! UnaryExpression | MultiplicativeExpression LT*! "%" LT*! UnaryExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.MultiplicativeExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.UnaryExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("*")), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("/")), c.Ignore(c.Any(this.LT()))), this.UnaryExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("%")), c.Ignore(c.Any(this.LT()))), this.UnaryExpression()));
        }.bind(this), 'MultiplicativeExpression'));
    };
})();

// AdditiveExpression: MultiplicativeExpression | AdditiveExpression LT*! "+" LT*! MultiplicativeExpression | AdditiveExpression LT*! "-" LT*! MultiplicativeExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AdditiveExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.MultiplicativeExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.AdditiveExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("+")), c.Ignore(c.Any(this.LT()))), this.MultiplicativeExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.AdditiveExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("-")), c.Ignore(c.Any(this.LT()))), this.MultiplicativeExpression()));
        }.bind(this), 'AdditiveExpression'));
    };
})();

// ShiftExpression: AdditiveExpression | ShiftExpression LT*! "<<" LT*! AdditiveExpression | ShiftExpression LT*! ">>" LT*! AdditiveExpression | ShiftExpression LT*! ">>>" LT*! AdditiveExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ShiftExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(this.AdditiveExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("<<")), c.Ignore(c.Any(this.LT()))), this.AdditiveExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(">>")), c.Ignore(c.Any(this.LT()))), this.AdditiveExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(">>>")), c.Ignore(c.Any(this.LT()))), this.AdditiveExpression()));
        }.bind(this), 'ShiftExpression'));
    };
})();

// RelationalExpression: ShiftExpression | RelationalExpression LT*! "<" LT*! ShiftExpression | RelationalExpression LT*! ">" LT*! ShiftExpression | RelationalExpression LT*! "<=" LT*! ShiftExpression | RelationalExpression LT*! ">=" LT*! ShiftExpression | RelationalExpression LT*! "instanceof" LT*! ShiftExpression | RelationalExpression LT*! "in" LT*! ShiftExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.RelationalExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.ShiftExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("<")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(">")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("<=")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal(">=")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("instanceof")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("in")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression()));
        }.bind(this), 'RelationalExpression'));
    };
})();

// RelationalExpressionNoIn: ShiftExpression | RelationalExpressionNoIn LT*! "<" LT*! ShiftExpression | RelationalExpressionNoIn LT*! ">" LT*! ShiftExpression | RelationalExpressionNoIn LT*! "<=" LT*! ShiftExpression | RelationalExpressionNoIn LT*! ">=" LT*! ShiftExpression | RelationalExpressionNoIn LT*! "instanceof" LT*! ShiftExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.RelationalExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(this.ShiftExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("<")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal(">")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("<=")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal(">=")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("instanceof")), c.Ignore(c.Any(this.LT()))), this.ShiftExpression()));
        }.bind(this), 'RelationalExpressionNoIn'));
    };
})();

// EqualityExpression: RelationalExpression | EqualityExpression LT*! "==" LT*! RelationalExpression | EqualityExpression LT*! "!=" LT*! RelationalExpression | EqualityExpression LT*! "===" LT*! RelationalExpression | EqualityExpression LT*! "!==" LT*! RelationalExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EqualityExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.RelationalExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("==")), c.Ignore(c.Any(this.LT()))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("!=")), c.Ignore(c.Any(this.LT()))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("===")), c.Ignore(c.Any(this.LT()))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("!==")), c.Ignore(c.Any(this.LT()))), this.RelationalExpression()));
        }.bind(this), 'EqualityExpression'));
    };
})();

// EqualityExpressionNoIn: RelationalExpressionNoIn | EqualityExpressionNoIn LT*! "==" LT*! RelationalExpressionNoIn | EqualityExpressionNoIn LT*! "!=" LT*! RelationalExpressionNoIn | EqualityExpressionNoIn LT*! "===" LT*! RelationalExpressionNoIn | EqualityExpressionNoIn LT*! "!==" LT*! RelationalExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EqualityExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(this.RelationalExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("==")), c.Ignore(c.Any(this.LT()))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("!=")), c.Ignore(c.Any(this.LT()))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("===")), c.Ignore(c.Any(this.LT()))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("!==")), c.Ignore(c.Any(this.LT()))), this.RelationalExpressionNoIn()));
        }.bind(this), 'EqualityExpressionNoIn'));
    };
})();

// BitwiseANDExpression: EqualityExpression | BitwiseANDExpression LT*! "&" LT*! EqualityExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseANDExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.EqualityExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseANDExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("&")), c.Ignore(c.Any(this.LT()))), this.EqualityExpression()));
        }.bind(this), 'BitwiseANDExpression'));
    };
})();

// BitwiseANDExpressionNoIn: EqualityExpressionNoIn | BitwiseANDExpressionNoIn LT*! "&" LT*! EqualityExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseANDExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.EqualityExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseANDExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("&")), c.Ignore(c.Any(this.LT()))), this.EqualityExpressionNoIn()));
        }.bind(this), 'BitwiseANDExpressionNoIn'));
    };
})();

// BitwiseXORExpression: BitwiseANDExpression | BitwiseXORExpression LT*! "^" LT*! BitwiseANDExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseXORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseANDExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseXORExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("^")), c.Ignore(c.Any(this.LT()))), this.BitwiseANDExpression()));
        }.bind(this), 'BitwiseXORExpression'));
    };
})();

// BitwiseXORExpressionNoIn: BitwiseANDExpressionNoIn | BitwiseXORExpressionNoIn LT*! "^" LT*! BitwiseANDExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseXORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseANDExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseXORExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("^")), c.Ignore(c.Any(this.LT()))), this.BitwiseANDExpressionNoIn()));
        }.bind(this), 'BitwiseXORExpressionNoIn'));
    };
})();

// BitwiseORExpression: BitwiseXORExpression | BitwiseORExpression LT*! "|" LT*! BitwiseXORExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseXORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseORExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("|")), c.Ignore(c.Any(this.LT()))), this.BitwiseXORExpression()));
        }.bind(this), 'BitwiseORExpression'));
    };
})();

// BitwiseORExpressionNoIn: BitwiseXORExpressionNoIn | BitwiseORExpressionNoIn LT*! "|" LT*! BitwiseXORExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseXORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseORExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("|")), c.Ignore(c.Any(this.LT()))), this.BitwiseXORExpressionNoIn()));
        }.bind(this), 'BitwiseORExpressionNoIn'));
    };
})();

// LogicalANDExpression: BitwiseORExpression | LogicalANDExpression LT*! "&&" LT*! BitwiseORExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalANDExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalANDExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("&&")), c.Ignore(c.Any(this.LT()))), this.BitwiseORExpression()));
        }.bind(this), 'LogicalANDExpression'));
    };
})();

// LogicalANDExpressionNoIn: BitwiseORExpressionNoIn | LogicalANDExpressionNoIn LT*! "&&" LT*! BitwiseORExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalANDExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.BitwiseORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalANDExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("&&")), c.Ignore(c.Any(this.LT()))), this.BitwiseORExpressionNoIn()));
        }.bind(this), 'LogicalANDExpressionNoIn'));
    };
})();

// LogicalORExpression: LogicalANDExpression | LogicalORExpression LT*! "||" LT*! LogicalANDExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.LogicalANDExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("||")), c.Ignore(c.Any(this.LT()))), this.LogicalANDExpression()));
        }.bind(this), 'LogicalORExpression'));
    };
})();

// LogicalORExpressionNoIn: LogicalANDExpressionNoIn | LogicalORExpressionNoIn LT*! "||" LT*! LogicalANDExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.LogicalANDExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("||")), c.Ignore(c.Any(this.LT()))), this.LogicalANDExpressionNoIn()));
        }.bind(this), 'LogicalORExpressionNoIn'));
    };
})();

// ConditionalExpression: LogicalORExpression | LogicalORExpression LT*! "?" LT*! AssignmentExpression LT*! ":" LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ConditionalExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.LogicalORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpression(), c.Ignore(c.Any(this.LT()))), g.Literal("?")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()));
        }.bind(this), 'ConditionalExpression'));
    };
})();

// ConditionalExpressionNoIn: LogicalORExpressionNoIn | LogicalORExpressionNoIn LT*! "?" LT*! AssignmentExpressionNoIn LT*! ":" LT*! AssignmentExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ConditionalExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.LogicalORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal("?")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpressionNoIn()), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpressionNoIn()));
        }.bind(this), 'ConditionalExpressionNoIn'));
    };
})();

// AssignmentExpression: ConditionalExpression | LeftHandSideExpression LT*! AssignmentOperator LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.ConditionalExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(this.LT()))), this.AssignmentOperator()), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()));
        }.bind(this), 'AssignmentExpression'));
    };
})();

// AssignmentExpressionNoIn: ConditionalExpressionNoIn | LeftHandSideExpression LT*! AssignmentOperator LT*! AssignmentExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.ConditionalExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(this.LT()))), this.AssignmentOperator()), c.Ignore(c.Any(this.LT()))), this.AssignmentExpressionNoIn()));
        }.bind(this), 'AssignmentExpressionNoIn'));
    };
})();

// AssignmentOperator: "=" | "*=" | "/=" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentOperator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("="), g.Literal("*=")), g.Literal("/=")), g.Literal("%=")), g.Literal("+=")), g.Literal("-=")), g.Literal("<<=")), g.Literal(">>=")), g.Literal(">>>=")), g.Literal("&=")), g.Literal("^=")), g.Literal("|="));
        }.bind(this), 'AssignmentOperator'));
    };
})();

// Expression: AssignmentExpression | Expression LT*! "," LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Expression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.AssignmentExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.Expression(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression()));
        }.bind(this), 'Expression'));
    };
})();

// ExpressionNoIn: AssignmentExpressionNoIn | ExpressionNoIn LT*! "," LT*! AssignmentExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.AssignmentExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.ExpressionNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.AssignmentExpressionNoIn()));
        }.bind(this), 'ExpressionNoIn'));
    };
})();

// Statement: Block | VariableStatement | EmptyStatement | ExpressionStatement | IfStatement | IterationStatement | ContinueStatement | BreakStatement | ReturnStatement | WithStatement | LabelledStatement | SwitchStatement | ThrowStatement | TryStatement | DebuggerStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Statement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.Block(), this.VariableStatement()), this.EmptyStatement()), this.ExpressionStatement()), this.IfStatement()), this.IterationStatement()), this.ContinueStatement()), this.BreakStatement()), this.ReturnStatement()), this.WithStatement()), this.LabelledStatement()), this.SwitchStatement()), this.ThrowStatement()), this.TryStatement()), this.DebuggerStatement());
        }.bind(this), 'Statement'));
    };
})();

// Block: "{" LT*! StatementList? LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Block = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), c.Maybe(this.StatementList())), c.Ignore(c.Any(this.LT()))), g.Literal("}"));
        }.bind(this), 'Block'));
    };
})();

// StatementList: Statement | StatementList LT*! Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.StatementList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.Statement(), c.Seq(c.Seq(this.StatementList(), c.Ignore(c.Any(this.LT()))), this.Statement()));
        }.bind(this), 'StatementList'));
    };
})();

// VariableStatement: "var" LT*! VariableDeclarationList LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("var"), c.Ignore(c.Any(this.LT()))), this.VariableDeclarationList()), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'VariableStatement'));
    };
})();

// VariableDeclarationList: VariableDeclaration | VariableDeclarationList LT*! "," LT*! VariableDeclaration;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.VariableDeclaration(), c.Seq(c.Seq(c.Seq(c.Seq(this.VariableDeclarationList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.VariableDeclaration()));
        }.bind(this), 'VariableDeclarationList'));
    };
})();

// VariableDeclarationListNoIn: VariableDeclarationNoIn | VariableDeclarationListNoIn LT*! "," LT*! VariableDeclarationNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationListNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.VariableDeclarationNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.VariableDeclarationListNoIn(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.VariableDeclarationNoIn()));
        }.bind(this), 'VariableDeclarationListNoIn'));
    };
})();

// VariableDeclaration: Identifier LT*! Initialiser?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclaration = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(this.Identifier(), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Initialiser()));
        }.bind(this), 'VariableDeclaration'));
    };
})();

// VariableDeclarationNoIn: Identifier LT*! InitialiserNoIn?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(this.Identifier(), c.Ignore(c.Any(this.LT()))), c.Maybe(this.InitialiserNoIn()));
        }.bind(this), 'VariableDeclarationNoIn'));
    };
})();

// Initialiser: "=" LT*! AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Initialiser = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("="), c.Ignore(c.Any(this.LT()))), this.AssignmentExpression());
        }.bind(this), 'Initialiser'));
    };
})();

// InitialiserNoIn: "=" LT*! AssignmentExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.InitialiserNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("="), c.Ignore(c.Any(this.LT()))), this.AssignmentExpressionNoIn());
        }.bind(this), 'InitialiserNoIn'));
    };
})();

// EmptyStatement: ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EmptyStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Literal(";");
        }.bind(this), 'EmptyStatement'));
    };
})();

// ExpressionStatement: ?= ~ ("{" | "function") LT*! Expression LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ExpressionStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(l.Look(c.Not(c.Or(g.Literal("{"), g.Literal("function")))), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'ExpressionStatement'));
    };
})();

// IfStatement: "if" LT*! "(" LT*! Expression LT*! ")" LT*! Statement LT*! "else" LT*! Statement | "if" LT*! "(" LT*! Expression LT*! ")" LT*! Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.IfStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("if"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement()), c.Ignore(c.Any(this.LT()))), g.Literal("else")), c.Ignore(c.Any(this.LT()))), this.Statement()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("if"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement()));
        }.bind(this), 'IfStatement'));
    };
})();

// IterationStatement: "do" LT*! Statement LT*! "while" LT*! "(" LT*! Expression LT*! ");" | "while" LT*! "(" LT*! Expression LT*! ")" LT*! Statement | "for" LT*! "(" LT*! ExpressionNoIn? LT*! ";" LT*! Expression? LT*! ";" LT*! Expression? LT*! ")" LT*! Statement | "for" LT*! "(" LT*! "var" LT*! VariableDeclarationListNoIn LT*! ";" LT*! Expression? LT*! ";" LT*! Expression? LT*! ")" LT*! Statement | "for" LT*! "(" LT*! LeftHandSideExpression LT*! "in" LT*! Expression LT*! ")" LT*! Statement | "for" LT*! "(" LT*! "var" LT*! VariableDeclarationNoIn LT*! "in" LT*! Expression LT*! ")" LT*! Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.IterationStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("do"), c.Ignore(c.Any(this.LT()))), this.Statement()), c.Ignore(c.Any(this.LT()))), g.Literal("while")), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(");")), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("while"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("for"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.ExpressionNoIn())), c.Ignore(c.Any(this.LT()))), g.Literal(";")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Expression())), c.Ignore(c.Any(this.LT()))), g.Literal(";")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Expression())), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("for"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), g.Literal("var")), c.Ignore(c.Any(this.LT()))), this.VariableDeclarationListNoIn()), c.Ignore(c.Any(this.LT()))), g.Literal(";")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Expression())), c.Ignore(c.Any(this.LT()))), g.Literal(";")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Expression())), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("for"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.LeftHandSideExpression()), c.Ignore(c.Any(this.LT()))), g.Literal("in")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("for"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), g.Literal("var")), c.Ignore(c.Any(this.LT()))), this.VariableDeclarationNoIn()), c.Ignore(c.Any(this.LT()))), g.Literal("in")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement()));
        }.bind(this), 'IterationStatement'));
    };
})();

// ContinueStatement: "continue" (LT & ~ LineTerminator)*! Identifier? LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ContinueStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("continue"), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), c.Maybe(this.Identifier())), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'ContinueStatement'));
    };
})();

// BreakStatement: "break" (LT & ~ LineTerminator)*! Identifier? LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BreakStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("break"), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), c.Maybe(this.Identifier())), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'BreakStatement'));
    };
})();

// ReturnStatement: "return" (LT & ~ LineTerminator)*! Expression? LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ReturnStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("return"), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), c.Maybe(this.Expression())), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'ReturnStatement'));
    };
})();

// WithStatement: "with" LT*! "(" LT*! Expression LT*! ")" LT*! Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.WithStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("with"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Statement());
        }.bind(this), 'WithStatement'));
    };
})();

// SwitchStatement: "switch" LT*! "(" LT*! Expression LT*! ")" LT*! CaseBlock;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SwitchStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("switch"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.CaseBlock());
        }.bind(this), 'SwitchStatement'));
    };
})();

// CaseBlock: "{" LT*! CaseClauses? LT*! "}" | "{" LT*! CaseClauses? LT*! DefaultClause LT*! CaseClauses? LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseBlock = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(this.LT()))), g.Literal("}")), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(this.LT()))), this.DefaultClause()), c.Ignore(c.Any(this.LT()))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(this.LT()))), g.Literal("}")));
        }.bind(this), 'CaseBlock'));
    };
})();

// CaseClauses: CaseClause | CaseClauses LT*! CaseClause;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseClauses = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.CaseClause(), c.Seq(c.Seq(this.CaseClauses(), c.Ignore(c.Any(this.LT()))), this.CaseClause()));
        }.bind(this), 'CaseClauses'));
    };
})();

// CaseClause: "case" LT*! Expression LT*! ":" LT*! StatementList?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseClause = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("case"), c.Ignore(c.Any(this.LT()))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.StatementList()));
        }.bind(this), 'CaseClause'));
    };
})();

// DefaultClause: "default" LT*! ":" LT*! StatementList?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.DefaultClause = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("default"), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.StatementList()));
        }.bind(this), 'DefaultClause'));
    };
})();

// LabelledStatement: Identifier LT*! ":" LT*! Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LabelledStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(this.Identifier(), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), this.Statement());
        }.bind(this), 'LabelledStatement'));
    };
})();

// ThrowStatement: "throw" (LT & ~ LineTerminator)*! Expression LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ThrowStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("throw"), c.Ignore(c.Any(c.And(this.LT(), c.Not(this.LineTerminator()))))), this.Expression()), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'ThrowStatement'));
    };
})();

// TryStatement: "try" LT*! Block LT*! Catch | "try" LT*! Block LT*! Finally | "try" LT*! Block LT*! Catch LT*! Finally;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.TryStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("try"), c.Ignore(c.Any(this.LT()))), this.Block()), c.Ignore(c.Any(this.LT()))), this.Catch()), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("try"), c.Ignore(c.Any(this.LT()))), this.Block()), c.Ignore(c.Any(this.LT()))), this.Finally())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("try"), c.Ignore(c.Any(this.LT()))), this.Block()), c.Ignore(c.Any(this.LT()))), this.Catch()), c.Ignore(c.Any(this.LT()))), this.Finally()));
        }.bind(this), 'TryStatement'));
    };
})();

// Catch: "catch" LT*! "(" LT*! Identifier LT*! ")" LT*! Block;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Catch = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("catch"), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), this.Identifier()), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), this.Block());
        }.bind(this), 'Catch'));
    };
})();

// Finally: "finally" LT*! Block;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Finally = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("finally"), c.Ignore(c.Any(this.LT()))), this.Block());
        }.bind(this), 'Finally'));
    };
})();

// DebuggerStatement: "debugger" LT*! ";";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.DebuggerStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("debugger"), c.Ignore(c.Any(this.LT()))), g.Literal(";"));
        }.bind(this), 'DebuggerStatement'));
    };
})();

// FunctionDeclaration: "function" LT*! Identifier LT*! "(" LT*! FormalParameterList? LT*! ")" LT*! "{" LT*! FunctionBody LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionDeclaration = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("function"), c.Ignore(c.Any(this.LT()))), this.Identifier()), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.FormalParameterList())), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), g.Literal("{")), c.Ignore(c.Any(this.LT()))), this.FunctionBody()), c.Ignore(c.Any(this.LT()))), g.Literal("}"));
        }.bind(this), 'FunctionDeclaration'));
    };
})();

// FunctionExpression: "function" LT*! Identifier? LT*! "(" LT*! FormalParameterList? LT*! ")" LT*! "{" LT*! FunctionBody LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("function"), c.Ignore(c.Any(this.LT()))), c.Maybe(this.Identifier())), c.Ignore(c.Any(this.LT()))), g.Literal("(")), c.Ignore(c.Any(this.LT()))), c.Maybe(this.FormalParameterList())), c.Ignore(c.Any(this.LT()))), g.Literal(")")), c.Ignore(c.Any(this.LT()))), g.Literal("{")), c.Ignore(c.Any(this.LT()))), this.FunctionBody()), c.Ignore(c.Any(this.LT()))), g.Literal("}"));
        }.bind(this), 'FunctionExpression'));
    };
})();

// FormalParameterList: Identifier | FormalParameterList LT*! "," LT*! Identifier;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FormalParameterList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.Identifier(), c.Seq(c.Seq(c.Seq(c.Seq(this.FormalParameterList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.Identifier()));
        }.bind(this), 'FormalParameterList'));
    };
})();

// FunctionBody: SourceElements?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionBody = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Maybe(this.SourceElements());
        }.bind(this), 'FunctionBody'));
    };
})();

// Program: SourceElements?;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Program = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Maybe(this.SourceElements());
        }.bind(this), 'Program'));
    };
})();

// SourceElements: SourceElement | SourceElements LT*! SourceElement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SourceElements = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.SourceElement(), c.Seq(c.Seq(this.SourceElements(), c.Ignore(c.Any(this.LT()))), this.SourceElement()));
        }.bind(this), 'SourceElements'));
    };
})();

// SourceElement: Statement | FunctionDeclaration;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SourceElement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.Statement(), this.FunctionDeclaration());
        }.bind(this), 'SourceElement'));
    };
})();

// JSONText: JSONValue;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONText = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.JSONValue();
        }.bind(this), 'JSONText'));
    };
})();

// JSONValue: JSONNullLiteral | JSONBooleanLiteral | JSONObject | JSONArray | JSONString | JSONNumber;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONValue = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(this.JSONNullLiteral(), this.JSONBooleanLiteral()), this.JSONObject()), this.JSONArray()), this.JSONString()), this.JSONNumber());
        }.bind(this), 'JSONValue'));
    };
})();

// JSONObject: "{" LT*! "}" | "{" LT*! JSONMemberList LT*! "}";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONObject = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), g.Literal("}")), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("{"), c.Ignore(c.Any(this.LT()))), this.JSONMemberList()), c.Ignore(c.Any(this.LT()))), g.Literal("}")));
        }.bind(this), 'JSONObject'));
    };
})();

// JSONMember: JSONString LT*! ":" LT*! JSONValue;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONMember = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Seq(c.Seq(this.JSONString(), c.Ignore(c.Any(this.LT()))), g.Literal(":")), c.Ignore(c.Any(this.LT()))), this.JSONValue());
        }.bind(this), 'JSONMember'));
    };
})();

// JSONMemberList: JSONMember | JSONMemberList LT*! "," LT*! JSONMember;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONMemberList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.JSONMember(), c.Seq(c.Seq(c.Seq(c.Seq(this.JSONMemberList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.JSONMember()));
        }.bind(this), 'JSONMemberList'));
    };
})();

// JSONArray: "[" LT*! "]" | "[" LT*! JSONElementList LT*! "]";
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONArray = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Seq(c.Seq(g.Literal("["), c.Ignore(c.Any(this.LT()))), g.Literal("]")), c.Seq(c.Seq(c.Seq(c.Seq(g.Literal("["), c.Ignore(c.Any(this.LT()))), this.JSONElementList()), c.Ignore(c.Any(this.LT()))), g.Literal("]")));
        }.bind(this), 'JSONArray'));
    };
})();

// JSONElementList: JSONValue | JSONElementList LT*! "," LT*! JSONValue;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.JSONElementList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.JSONValue(), c.Seq(c.Seq(c.Seq(c.Seq(this.JSONElementList(), c.Ignore(c.Any(this.LT()))), g.Literal(",")), c.Ignore(c.Any(this.LT()))), this.JSONValue()));
        }.bind(this), 'JSONElementList'));
    };
})();

// export grammar String;
var String = exports.String = function() {};

// StringNumericLiteral: StrWhiteSpace? | StrWhiteSpace? StrNumericLiteral StrWhiteSpace?;
(function() {
    var $cache;
    
    exports.String.prototype.StringNumericLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Maybe(this.StrWhiteSpace()), c.Seq(c.Seq(c.Maybe(this.StrWhiteSpace()), this.StrNumericLiteral()), c.Maybe(this.StrWhiteSpace())));
        }.bind(this), 'StringNumericLiteral'));
    };
})();

// StrWhiteSpace: StrWhiteSpaceChar StrWhiteSpace?;
(function() {
    var $cache;
    
    exports.String.prototype.StrWhiteSpace = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.StrWhiteSpaceChar(), c.Maybe(this.StrWhiteSpace()));
        }.bind(this), 'StrWhiteSpace'));
    };
})();

// StrWhiteSpaceChar: WhiteSpace | LineTerminator;
(function() {
    var $cache;
    
    exports.String.prototype.StrWhiteSpaceChar = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.WhiteSpace(), this.LineTerminator());
        }.bind(this), 'StrWhiteSpaceChar'));
    };
})();

// StrNumericLiteral: StrDecimalLiteral | HexIntegerLiteral;
(function() {
    var $cache;
    
    exports.String.prototype.StrNumericLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.StrDecimalLiteral(), this.HexIntegerLiteral());
        }.bind(this), 'StrNumericLiteral'));
    };
})();

// StrDecimalLiteral: StrUnsignedDecimalLiteral | "+" StrUnsignedDecimalLiteral | "-" StrUnsignedDecimalLiteral;
(function() {
    var $cache;
    
    exports.String.prototype.StrDecimalLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.StrUnsignedDecimalLiteral(), c.Seq(g.Literal("+"), this.StrUnsignedDecimalLiteral())), c.Seq(g.Literal("-"), this.StrUnsignedDecimalLiteral()));
        }.bind(this), 'StrDecimalLiteral'));
    };
})();

// StrUnsignedDecimalLiteral: "Infinity" | DecimalDigits "." DecimalDigits? ExponentPart? | "." DecimalDigits ExponentPart? | DecimalDigits ExponentPart?;
(function() {
    var $cache;
    
    exports.String.prototype.StrUnsignedDecimalLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(g.Literal("Infinity"), c.Seq(c.Seq(c.Seq(this.DecimalDigits(), g.Literal(".")), c.Maybe(this.DecimalDigits())), c.Maybe(this.ExponentPart()))), c.Seq(c.Seq(g.Literal("."), this.DecimalDigits()), c.Maybe(this.ExponentPart()))), c.Seq(this.DecimalDigits(), c.Maybe(this.ExponentPart())));
        }.bind(this), 'StrUnsignedDecimalLiteral'));
    };
})();

// DecimalDigits: DecimalDigit | DecimalDigits DecimalDigit;
(function() {
    var $cache;
    
    exports.String.prototype.DecimalDigits = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(this.DecimalDigit(), c.Seq(this.DecimalDigits(), this.DecimalDigit()));
        }.bind(this), 'DecimalDigits'));
    };
})();

// DecimalDigit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
(function() {
    var $cache;
    
    exports.String.prototype.DecimalDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7")), g.Literal("8")), g.Literal("9"));
        }.bind(this), 'DecimalDigit'));
    };
})();

// ExponentPart: ExponentIndicator SignedInteger;
(function() {
    var $cache;
    
    exports.String.prototype.ExponentPart = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.ExponentIndicator(), this.SignedInteger());
        }.bind(this), 'ExponentPart'));
    };
})();

// ExponentIndicator: "e" | "E";
(function() {
    var $cache;
    
    exports.String.prototype.ExponentIndicator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Literal("e"), g.Literal("E"));
        }.bind(this), 'ExponentIndicator'));
    };
})();

// SignedInteger: DecimalDigits | "+" DecimalDigits | "-" DecimalDigits;
(function() {
    var $cache;
    
    exports.String.prototype.SignedInteger = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.DecimalDigits(), c.Seq(g.Literal("+"), this.DecimalDigits())), c.Seq(g.Literal("-"), this.DecimalDigits()));
        }.bind(this), 'SignedInteger'));
    };
})();

// HexIntegerLiteral: "0x" HexDigit | "0X" HexDigit | HexIntegerLiteral HexDigit;
(function() {
    var $cache;
    
    exports.String.prototype.HexIntegerLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Seq(g.Literal("0x"), this.HexDigit()), c.Seq(g.Literal("0X"), this.HexDigit())), c.Seq(this.HexIntegerLiteral(), this.HexDigit()));
        }.bind(this), 'HexIntegerLiteral'));
    };
})();

// HexDigit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
(function() {
    var $cache;
    
    exports.String.prototype.HexDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("0"), g.Literal("1")), g.Literal("2")), g.Literal("3")), g.Literal("4")), g.Literal("5")), g.Literal("6")), g.Literal("7")), g.Literal("8")), g.Literal("9")), g.Literal("a")), g.Literal("b")), g.Literal("c")), g.Literal("d")), g.Literal("e")), g.Literal("f")), g.Literal("A")), g.Literal("B")), g.Literal("C")), g.Literal("D")), g.Literal("E")), g.Literal("F"));
        }.bind(this), 'HexDigit'));
    };
})();

// uri: uriCharacters?;
(function() {
    var $cache;
    
    exports.String.prototype.uri = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Maybe(this.uriCharacters());
        }.bind(this), 'uri'));
    };
})();

// uriCharacters: uriCharacter uriCharacters?;
(function() {
    var $cache;
    
    exports.String.prototype.uriCharacters = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(this.uriCharacter(), c.Maybe(this.uriCharacters()));
        }.bind(this), 'uriCharacters'));
    };
})();

// uriCharacter: uriReserved | uriUnescaped | uriEscaped;
(function() {
    var $cache;
    
    exports.String.prototype.uriCharacter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.uriReserved(), this.uriUnescaped()), this.uriEscaped());
        }.bind(this), 'uriCharacter'));
    };
})();

// uriReserved: ";" | "/" | "?" | ":" | "@" | "&" | "=" | "+" | "$" | ",";
(function() {
    var $cache;
    
    exports.String.prototype.uriReserved = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal(";"), g.Literal("/")), g.Literal("?")), g.Literal(":")), g.Literal("@")), g.Literal("&")), g.Literal("=")), g.Literal("+")), g.Literal("$")), g.Literal(","));
        }.bind(this), 'uriReserved'));
    };
})();

// uriUnescaped: uriAlpha | DecimalDigit | uriMark;
(function() {
    var $cache;
    
    exports.String.prototype.uriUnescaped = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(this.uriAlpha(), this.DecimalDigit()), this.uriMark());
        }.bind(this), 'uriUnescaped'));
    };
})();

// uriEscaped: "%" HexDigit HexDigit;
(function() {
    var $cache;
    
    exports.String.prototype.uriEscaped = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(g.Literal("%"), this.HexDigit()), this.HexDigit());
        }.bind(this), 'uriEscaped'));
    };
})();

// uriAlpha: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
(function() {
    var $cache;
    
    exports.String.prototype.uriAlpha = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("a"), g.Literal("b")), g.Literal("c")), g.Literal("d")), g.Literal("e")), g.Literal("f")), g.Literal("g")), g.Literal("h")), g.Literal("i")), g.Literal("j")), g.Literal("k")), g.Literal("l")), g.Literal("m")), g.Literal("n")), g.Literal("o")), g.Literal("p")), g.Literal("q")), g.Literal("r")), g.Literal("s")), g.Literal("t")), g.Literal("u")), g.Literal("v")), g.Literal("w")), g.Literal("x")), g.Literal("y")), g.Literal("z")), g.Literal("A")), g.Literal("B")), g.Literal("C")), g.Literal("D")), g.Literal("E")), g.Literal("F")), g.Literal("G")), g.Literal("H")), g.Literal("I")), g.Literal("J")), g.Literal("K")), g.Literal("L")), g.Literal("M")), g.Literal("N")), g.Literal("O")), g.Literal("P")), g.Literal("Q")), g.Literal("R")), g.Literal("S")), g.Literal("T")), g.Literal("U")), g.Literal("V")), g.Literal("W")), g.Literal("X")), g.Literal("Y")), g.Literal("Z"));
        }.bind(this), 'uriAlpha'));
    };
})();

// uriMark: "-" | "_" | "." | "!" | "~" | "*" | "`" | "(" | ")";
(function() {
    var $cache;
    
    exports.String.prototype.uriMark = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("-"), g.Literal("_")), g.Literal(".")), g.Literal("!")), g.Literal("~")), g.Literal("*")), g.Literal("`")), g.Literal("(")), g.Literal(")"));
        }.bind(this), 'uriMark'));
    };
})();
