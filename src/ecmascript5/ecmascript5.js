var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// export constructor PrimaryExpression, ArrayLiteral, ElementList, Elision, ObjectLiteral, PropertyNameAndValueList, PropertyAssignment, PropertyName, PropertySetParameterList, MemberExpression, NewExpression, CallExpression, Arguments, ArgumentList, LeftHandSideExpression, PostfixExpression, UnaryExpression, MultiplicativeExpression, AdditiveExpression, ShiftExpression, RelationalExpression, RelationalExpressionNoIn, EqualityExpression, EqualityExpressionNoIn, BitwiseANDExpression, BitwiseANDExpressionNoIn, BitwiseXORExpression, BitwiseXORExpressionNoIn, BitwiseORExpression, BitwiseORExpressionNoIn, LogicalANDExpression, LogicalANDExpressionNoIn, LogicalORExpression, LogicalORExpressionNoIn, ConditionalExpression, ConditionalExpressionNoIn, AssignmentExpression, AssignmentExpressionNoIn, AssignmentOperator, Expression, ExpressionNoIn, Statement, Block, StatementList, VariableStatement, VariableDeclarationList, VariableDeclarationListNoIn, VariableDeclaration, VariableDeclarationNoIn, Initialiser, InitialiserNoIn, EmptyStatement, ExpressionStatement, IfStatement, IterationStatement, ContinueStatement, BreakStatement, ReturnStatement, WithStatement, SwitchStatement, CaseBlock, CaseClauses, CaseClause, DefaultClause, LabelledStatement, ThrowStatement, TryStatement, Catch, Finally, DebuggerStatement, FunctionDeclaration, FunctionExpression, FormalParameterList, FunctionBody, Program, SourceElements, SourceElement, JSONText, JSONValue, JSONObject, JSONMember, JSONMemberList, JSONArray, JSONElementList;
var PrimaryExpression           = exports.PrimaryExpression           = g.Cons("PrimaryExpression");
var ArrayLiteral                = exports.ArrayLiteral                = g.Cons("ArrayLiteral");
var ElementList                 = exports.ElementList                 = g.Cons("ElementList");
var Elision                     = exports.Elision                     = g.Cons("Elision");
var ObjectLiteral               = exports.ObjectLiteral               = g.Cons("ObjectLiteral");
var PropertyNameAndValueList    = exports.PropertyNameAndValueList    = g.Cons("PropertyNameAndValueList");
var PropertyAssignment          = exports.PropertyAssignment          = g.Cons("PropertyAssignment");
var PropertyName                = exports.PropertyName                = g.Cons("PropertyName");
var PropertySetParameterList    = exports.PropertySetParameterList    = g.Cons("PropertySetParameterList");
var MemberExpression            = exports.MemberExpression            = g.Cons("MemberExpression");
var NewExpression               = exports.NewExpression               = g.Cons("NewExpression");
var CallExpression              = exports.CallExpression              = g.Cons("CallExpression");
var Arguments                   = exports.Arguments                   = g.Cons("Arguments");
var ArgumentList                = exports.ArgumentList                = g.Cons("ArgumentList");
var LeftHandSideExpression      = exports.LeftHandSideExpression      = g.Cons("LeftHandSideExpression");
var PostfixExpression           = exports.PostfixExpression           = g.Cons("PostfixExpression");
var UnaryExpression             = exports.UnaryExpression             = g.Cons("UnaryExpression");
var MultiplicativeExpression    = exports.MultiplicativeExpression    = g.Cons("MultiplicativeExpression");
var AdditiveExpression          = exports.AdditiveExpression          = g.Cons("AdditiveExpression");
var ShiftExpression             = exports.ShiftExpression             = g.Cons("ShiftExpression");
var RelationalExpression        = exports.RelationalExpression        = g.Cons("RelationalExpression");
var RelationalExpressionNoIn    = exports.RelationalExpressionNoIn    = g.Cons("RelationalExpressionNoIn");
var EqualityExpression          = exports.EqualityExpression          = g.Cons("EqualityExpression");
var EqualityExpressionNoIn      = exports.EqualityExpressionNoIn      = g.Cons("EqualityExpressionNoIn");
var BitwiseANDExpression        = exports.BitwiseANDExpression        = g.Cons("BitwiseANDExpression");
var BitwiseANDExpressionNoIn    = exports.BitwiseANDExpressionNoIn    = g.Cons("BitwiseANDExpressionNoIn");
var BitwiseXORExpression        = exports.BitwiseXORExpression        = g.Cons("BitwiseXORExpression");
var BitwiseXORExpressionNoIn    = exports.BitwiseXORExpressionNoIn    = g.Cons("BitwiseXORExpressionNoIn");
var BitwiseORExpression         = exports.BitwiseORExpression         = g.Cons("BitwiseORExpression");
var BitwiseORExpressionNoIn     = exports.BitwiseORExpressionNoIn     = g.Cons("BitwiseORExpressionNoIn");
var LogicalANDExpression        = exports.LogicalANDExpression        = g.Cons("LogicalANDExpression");
var LogicalANDExpressionNoIn    = exports.LogicalANDExpressionNoIn    = g.Cons("LogicalANDExpressionNoIn");
var LogicalORExpression         = exports.LogicalORExpression         = g.Cons("LogicalORExpression");
var LogicalORExpressionNoIn     = exports.LogicalORExpressionNoIn     = g.Cons("LogicalORExpressionNoIn");
var ConditionalExpression       = exports.ConditionalExpression       = g.Cons("ConditionalExpression");
var ConditionalExpressionNoIn   = exports.ConditionalExpressionNoIn   = g.Cons("ConditionalExpressionNoIn");
var AssignmentExpression        = exports.AssignmentExpression        = g.Cons("AssignmentExpression");
var AssignmentExpressionNoIn    = exports.AssignmentExpressionNoIn    = g.Cons("AssignmentExpressionNoIn");
var AssignmentOperator          = exports.AssignmentOperator          = g.Cons("AssignmentOperator");
var Expression                  = exports.Expression                  = g.Cons("Expression");
var ExpressionNoIn              = exports.ExpressionNoIn              = g.Cons("ExpressionNoIn");
var Statement                   = exports.Statement                   = g.Cons("Statement");
var Block                       = exports.Block                       = g.Cons("Block");
var StatementList               = exports.StatementList               = g.Cons("StatementList");
var VariableStatement           = exports.VariableStatement           = g.Cons("VariableStatement");
var VariableDeclarationList     = exports.VariableDeclarationList     = g.Cons("VariableDeclarationList");
var VariableDeclarationListNoIn = exports.VariableDeclarationListNoIn = g.Cons("VariableDeclarationListNoIn");
var VariableDeclaration         = exports.VariableDeclaration         = g.Cons("VariableDeclaration");
var VariableDeclarationNoIn     = exports.VariableDeclarationNoIn     = g.Cons("VariableDeclarationNoIn");
var Initialiser                 = exports.Initialiser                 = g.Cons("Initialiser");
var InitialiserNoIn             = exports.InitialiserNoIn             = g.Cons("InitialiserNoIn");
var EmptyStatement              = exports.EmptyStatement              = g.Cons("EmptyStatement");
var ExpressionStatement         = exports.ExpressionStatement         = g.Cons("ExpressionStatement");
var IfStatement                 = exports.IfStatement                 = g.Cons("IfStatement");
var IterationStatement          = exports.IterationStatement          = g.Cons("IterationStatement");
var ContinueStatement           = exports.ContinueStatement           = g.Cons("ContinueStatement");
var BreakStatement              = exports.BreakStatement              = g.Cons("BreakStatement");
var ReturnStatement             = exports.ReturnStatement             = g.Cons("ReturnStatement");
var WithStatement               = exports.WithStatement               = g.Cons("WithStatement");
var SwitchStatement             = exports.SwitchStatement             = g.Cons("SwitchStatement");
var CaseBlock                   = exports.CaseBlock                   = g.Cons("CaseBlock");
var CaseClauses                 = exports.CaseClauses                 = g.Cons("CaseClauses");
var CaseClause                  = exports.CaseClause                  = g.Cons("CaseClause");
var DefaultClause               = exports.DefaultClause               = g.Cons("DefaultClause");
var LabelledStatement           = exports.LabelledStatement           = g.Cons("LabelledStatement");
var ThrowStatement              = exports.ThrowStatement              = g.Cons("ThrowStatement");
var TryStatement                = exports.TryStatement                = g.Cons("TryStatement");
var Catch                       = exports.Catch                       = g.Cons("Catch");
var Finally                     = exports.Finally                     = g.Cons("Finally");
var DebuggerStatement           = exports.DebuggerStatement           = g.Cons("DebuggerStatement");
var FunctionDeclaration         = exports.FunctionDeclaration         = g.Cons("FunctionDeclaration");
var FunctionExpression          = exports.FunctionExpression          = g.Cons("FunctionExpression");
var FormalParameterList         = exports.FormalParameterList         = g.Cons("FormalParameterList");
var FunctionBody                = exports.FunctionBody                = g.Cons("FunctionBody");
var Program                     = exports.Program                     = g.Cons("Program");
var SourceElements              = exports.SourceElements              = g.Cons("SourceElements");
var SourceElement               = exports.SourceElement               = g.Cons("SourceElement");
var JSONText                    = exports.JSONText                    = g.Cons("JSONText");
var JSONValue                   = exports.JSONValue                   = g.Cons("JSONValue");
var JSONObject                  = exports.JSONObject                  = g.Cons("JSONObject");
var JSONMember                  = exports.JSONMember                  = g.Cons("JSONMember");
var JSONMemberList              = exports.JSONMemberList              = g.Cons("JSONMemberList");
var JSONArray                   = exports.JSONArray                   = g.Cons("JSONArray");
var JSONElementList             = exports.JSONElementList             = g.Cons("JSONElementList");

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

// export grammar Syntacticextends Lexical;
var Syntactic = exports.Syntactic = function() {};

exports.Syntactic.prototype = Object.create(Lexical.prototype);
Syntactic.$super = Lexical;
exports.Syntactic.prototype.constructor = Syntactic;

// start <LineTerminator>*! Program <LineTerminator>*!;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(c.Ignore(c.Any(g.Capture(this.LineTerminator()))), this.Program()), c.Ignore(c.Any(g.Capture(this.LineTerminator()))));
        }.bind(this), 'start'));
    };
})();

// PrimaryExpression: ("this" | <Identifier> -> Text | <Literal> -> Text | ArrayLiteral | ObjectLiteral | ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text)) -> PrimaryExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PrimaryExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("this"), c.Red(g.Capture(this.Identifier()), Text)), c.Red(g.Capture(this.Literal()), Text)), this.ArrayLiteral()), this.ObjectLiteral()), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("("), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text))), PrimaryExpression);
        }.bind(this), 'PrimaryExpression'));
    };
})();

// ArrayLiteral: (("[" -> Text) <LineTerminator>*! Elision? <LineTerminator>*! ("]" -> Text) | ("[" -> Text) <LineTerminator>*! ElementList <LineTerminator>*! ("]" -> Text) | ("[" -> Text) <LineTerminator>*! ElementList <LineTerminator>*! ("," -> Text) <LineTerminator>*! Elision? <LineTerminator>*! ("]" -> Text)) -> ArrayLiteral;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ArrayLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("["), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Elision())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("]"), Text)), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("["), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ElementList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("]"), Text))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("["), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ElementList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Elision())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("]"), Text))), ArrayLiteral);
        }.bind(this), 'ArrayLiteral'));
    };
})();

// ElementList: (Elision? <LineTerminator>*! AssignmentExpression | ElementList <LineTerminator>*! ("," -> Text) <LineTerminator>*! Elision? <LineTerminator>*! AssignmentExpression) -> ElementList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ElementList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(c.Maybe(this.Elision()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.ElementList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Elision())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression())), ElementList);
        }.bind(this), 'ElementList'));
    };
})();

// Elision: ("," | Elision <LineTerminator>*! ("," -> Text)) -> Elision;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Elision = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(g.Literal(","), c.Seq(c.Seq(this.Elision(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text))), Elision);
        }.bind(this), 'Elision'));
    };
})();

// ObjectLiteral: (("{" -> Text) <LineTerminator>*! ("}" -> Text) | ("{" -> Text) <LineTerminator>*! PropertyNameAndValueList <LineTerminator>*! ("}" -> Text) | ("{" -> Text) <LineTerminator>*! PropertyNameAndValueList <LineTerminator>*! ("," -> Text) <LineTerminator>*! ("}" -> Text)) -> ObjectLiteral;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ObjectLiteral = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text)), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertyNameAndValueList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertyNameAndValueList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text))), ObjectLiteral);
        }.bind(this), 'ObjectLiteral'));
    };
})();

// PropertyNameAndValueList: (PropertyAssignment | PropertyNameAndValueList <LineTerminator>*! ("," -> Text) <LineTerminator>*! PropertyAssignment) -> PropertyNameAndValueList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyNameAndValueList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.PropertyAssignment(), c.Seq(c.Seq(c.Seq(c.Seq(this.PropertyNameAndValueList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertyAssignment())), PropertyNameAndValueList);
        }.bind(this), 'PropertyNameAndValueList'));
    };
})();

// PropertyAssignment: (PropertyName <LineTerminator>*! (":" -> Text) <LineTerminator>*! AssignmentExpression | ("get" -> Text) <LineTerminator>*! PropertyName <LineTerminator>*! ("(" -> Text) <LineTerminator>*! (")" -> Text) <LineTerminator>*! ("{" -> Text) <LineTerminator>*! FunctionBody <LineTerminator>*! ("}" -> Text) | ("set" -> Text) <LineTerminator>*! PropertyName <LineTerminator>*! ("(" -> Text) <LineTerminator>*! PropertySetParameterList <LineTerminator>*! (")" -> Text) <LineTerminator>*! ("{" -> Text) <LineTerminator>*! FunctionBody <LineTerminator>*! ("}" -> Text)) -> PropertyAssignment;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyAssignment = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(this.PropertyName(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("get"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertyName()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("{"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.FunctionBody()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text))), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("set"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertyName()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.PropertySetParameterList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("{"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.FunctionBody()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text))), PropertyAssignment);
        }.bind(this), 'PropertyAssignment'));
    };
})();

// PropertyName: (<IdentifierName> -> Text | <StringLiteral> -> Text | <NumericLiteral> -> Text) -> PropertyName;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertyName = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Red(g.Capture(this.IdentifierName()), Text), c.Red(g.Capture(this.StringLiteral()), Text)), c.Red(g.Capture(this.NumericLiteral()), Text)), PropertyName);
        }.bind(this), 'PropertyName'));
    };
})();

// PropertySetParameterList: <Identifier> -> Text -> PropertySetParameterList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PropertySetParameterList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Red(g.Capture(this.Identifier()), Text), PropertySetParameterList);
        }.bind(this), 'PropertySetParameterList'));
    };
})();

// MemberExpression: (PrimaryExpression | FunctionExpression | MemberExpression <LineTerminator>*! ("[" -> Text) <LineTerminator>*! Expression <LineTerminator>*! ("]" -> Text) | MemberExpression <LineTerminator>*! ("." -> Text) <LineTerminator>*! (<IdentifierName> -> Text) | ("new" -> Text) <LineTerminator>*! MemberExpression <LineTerminator>*! Arguments) -> MemberExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.MemberExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(this.PrimaryExpression(), this.FunctionExpression()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("["), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("]"), Text))), c.Seq(c.Seq(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("."), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Capture(this.IdentifierName()), Text))), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("new"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.MemberExpression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Arguments())), MemberExpression);
        }.bind(this), 'MemberExpression'));
    };
})();

// NewExpression: (MemberExpression | ("new" -> Text) <LineTerminator>*! NewExpression) -> NewExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.NewExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.MemberExpression(), c.Seq(c.Seq(c.Red(g.Literal("new"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.NewExpression())), NewExpression);
        }.bind(this), 'NewExpression'));
    };
})();

// CallExpression: (MemberExpression <LineTerminator>*! Arguments | CallExpression <LineTerminator>*! Arguments | CallExpression <LineTerminator>*! ("[" -> Text) <LineTerminator>*! Expression <LineTerminator>*! ("]" -> Text) | CallExpression <LineTerminator>*! ("." -> Text) <LineTerminator>*! (<IdentifierName> -> Text)) -> CallExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CallExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Seq(c.Seq(this.MemberExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Arguments()), c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Arguments())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("["), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("]"), Text))), c.Seq(c.Seq(c.Seq(c.Seq(this.CallExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("."), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Capture(this.IdentifierName()), Text))), CallExpression);
        }.bind(this), 'CallExpression'));
    };
})();

// Arguments: (("(" -> Text) <LineTerminator>*! (")" -> Text) | ("(" -> Text) <LineTerminator>*! ArgumentList <LineTerminator>*! (")" -> Text)) -> Arguments;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Arguments = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(c.Red(g.Literal("("), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("("), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ArgumentList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text))), Arguments);
        }.bind(this), 'Arguments'));
    };
})();

// ArgumentList: (AssignmentExpression | ArgumentList <LineTerminator>*! ("," -> Text) <LineTerminator>*! AssignmentExpression) -> ArgumentList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ArgumentList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.AssignmentExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.ArgumentList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression())), ArgumentList);
        }.bind(this), 'ArgumentList'));
    };
})();

// LeftHandSideExpression: (NewExpression | CallExpression) -> LeftHandSideExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LeftHandSideExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.NewExpression(), this.CallExpression()), LeftHandSideExpression);
        }.bind(this), 'LeftHandSideExpression'));
    };
})();

// PostfixExpression: (LeftHandSideExpression | LeftHandSideExpression ("++" -> Text) | LeftHandSideExpression ("--" -> Text)) -> PostfixExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.PostfixExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(this.LeftHandSideExpression(), c.Seq(this.LeftHandSideExpression(), c.Red(g.Literal("++"), Text))), c.Seq(this.LeftHandSideExpression(), c.Red(g.Literal("--"), Text))), PostfixExpression);
        }.bind(this), 'PostfixExpression'));
    };
})();

// UnaryExpression: (PostfixExpression | ("delete" -> Text) <LineTerminator>*! UnaryExpression | ("void" -> Text) <LineTerminator>*! UnaryExpression | ("typeof" -> Text) <LineTerminator>*! UnaryExpression | ("++" -> Text) <LineTerminator>*! UnaryExpression | ("--" -> Text) <LineTerminator>*! UnaryExpression | ("+" -> Text) <LineTerminator>*! UnaryExpression | ("-" -> Text) <LineTerminator>*! UnaryExpression | ("~" -> Text) <LineTerminator>*! UnaryExpression | ("!" -> Text) <LineTerminator>*! UnaryExpression) -> UnaryExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.UnaryExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.PostfixExpression(), c.Seq(c.Seq(c.Red(g.Literal("delete"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("void"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("typeof"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("++"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("--"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("+"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("-"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("~"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Red(g.Literal("!"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), UnaryExpression);
        }.bind(this), 'UnaryExpression'));
    };
})();

// MultiplicativeExpression: (UnaryExpression | MultiplicativeExpression <LineTerminator>*! ("*" -> Text) <LineTerminator>*! UnaryExpression | MultiplicativeExpression <LineTerminator>*! ("/" -> Text) <LineTerminator>*! UnaryExpression | MultiplicativeExpression <LineTerminator>*! ("%" -> Text) <LineTerminator>*! UnaryExpression) -> MultiplicativeExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.MultiplicativeExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(this.UnaryExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("*"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("/"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.MultiplicativeExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("%"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.UnaryExpression())), MultiplicativeExpression);
        }.bind(this), 'MultiplicativeExpression'));
    };
})();

// AdditiveExpression: (MultiplicativeExpression | AdditiveExpression <LineTerminator>*! ("+" -> Text) <LineTerminator>*! MultiplicativeExpression | AdditiveExpression <LineTerminator>*! ("-" -> Text) <LineTerminator>*! MultiplicativeExpression) -> AdditiveExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AdditiveExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(this.MultiplicativeExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.AdditiveExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("+"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.MultiplicativeExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.AdditiveExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("-"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.MultiplicativeExpression())), AdditiveExpression);
        }.bind(this), 'AdditiveExpression'));
    };
})();

// ShiftExpression: (AdditiveExpression | ShiftExpression <LineTerminator>*! ("<<" -> Text) <LineTerminator>*! AdditiveExpression | ShiftExpression <LineTerminator>*! (">>" -> Text) <LineTerminator>*! AdditiveExpression | ShiftExpression <LineTerminator>*! (">>>" -> Text) <LineTerminator>*! AdditiveExpression) -> ShiftExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ShiftExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(this.AdditiveExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("<<"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AdditiveExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">>"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AdditiveExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.ShiftExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">>>"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AdditiveExpression())), ShiftExpression);
        }.bind(this), 'ShiftExpression'));
    };
})();

// RelationalExpression: (ShiftExpression | RelationalExpression <LineTerminator>*! ("<" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpression <LineTerminator>*! (">" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpression <LineTerminator>*! ("<=" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpression <LineTerminator>*! (">=" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpression <LineTerminator>*! ("instanceof" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpression <LineTerminator>*! ("in" -> Text) <LineTerminator>*! ShiftExpression) -> RelationalExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.RelationalExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.ShiftExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("<"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("<="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("instanceof"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("in"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), RelationalExpression);
        }.bind(this), 'RelationalExpression'));
    };
})();

// RelationalExpressionNoIn: (ShiftExpression | RelationalExpressionNoIn <LineTerminator>*! ("<" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpressionNoIn <LineTerminator>*! (">" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpressionNoIn <LineTerminator>*! ("<=" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpressionNoIn <LineTerminator>*! (">=" -> Text) <LineTerminator>*! ShiftExpression | RelationalExpressionNoIn <LineTerminator>*! ("instanceof" -> Text) <LineTerminator>*! ShiftExpression) -> RelationalExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.RelationalExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(this.ShiftExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("<"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("<="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(">="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.RelationalExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("instanceof"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.ShiftExpression())), RelationalExpressionNoIn);
        }.bind(this), 'RelationalExpressionNoIn'));
    };
})();

// EqualityExpression: (RelationalExpression | EqualityExpression <LineTerminator>*! ("==" -> Text) <LineTerminator>*! RelationalExpression | EqualityExpression <LineTerminator>*! ("!=" -> Text) <LineTerminator>*! RelationalExpression | EqualityExpression <LineTerminator>*! ("===" -> Text) <LineTerminator>*! RelationalExpression | EqualityExpression <LineTerminator>*! ("!==" -> Text) <LineTerminator>*! RelationalExpression) -> EqualityExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EqualityExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(this.RelationalExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("=="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("!="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("==="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpression())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("!=="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpression())), EqualityExpression);
        }.bind(this), 'EqualityExpression'));
    };
})();

// EqualityExpressionNoIn: (RelationalExpressionNoIn | EqualityExpressionNoIn <LineTerminator>*! ("==" -> Text) <LineTerminator>*! RelationalExpressionNoIn | EqualityExpressionNoIn <LineTerminator>*! ("!=" -> Text) <LineTerminator>*! RelationalExpressionNoIn | EqualityExpressionNoIn <LineTerminator>*! ("===" -> Text) <LineTerminator>*! RelationalExpressionNoIn | EqualityExpressionNoIn <LineTerminator>*! ("!==" -> Text) <LineTerminator>*! RelationalExpressionNoIn) -> EqualityExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EqualityExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(this.RelationalExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("=="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("!="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("==="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpressionNoIn())), c.Seq(c.Seq(c.Seq(c.Seq(this.EqualityExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("!=="), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.RelationalExpressionNoIn())), EqualityExpressionNoIn);
        }.bind(this), 'EqualityExpressionNoIn'));
    };
})();

// BitwiseANDExpression: (EqualityExpression | BitwiseANDExpression <LineTerminator>*! ("&" -> Text) <LineTerminator>*! EqualityExpression) -> BitwiseANDExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseANDExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.EqualityExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseANDExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("&"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.EqualityExpression())), BitwiseANDExpression);
        }.bind(this), 'BitwiseANDExpression'));
    };
})();

// BitwiseANDExpressionNoIn: (EqualityExpressionNoIn | BitwiseANDExpressionNoIn <LineTerminator>*! ("&" -> Text) <LineTerminator>*! EqualityExpressionNoIn) -> BitwiseANDExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseANDExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.EqualityExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseANDExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("&"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.EqualityExpressionNoIn())), BitwiseANDExpressionNoIn);
        }.bind(this), 'BitwiseANDExpressionNoIn'));
    };
})();

// BitwiseXORExpression: (BitwiseANDExpression | BitwiseXORExpression <LineTerminator>*! ("^" -> Text) <LineTerminator>*! BitwiseANDExpression) -> BitwiseXORExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseXORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseANDExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseXORExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("^"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseANDExpression())), BitwiseXORExpression);
        }.bind(this), 'BitwiseXORExpression'));
    };
})();

// BitwiseXORExpressionNoIn: (BitwiseANDExpressionNoIn | BitwiseXORExpressionNoIn <LineTerminator>*! ("^" -> Text) <LineTerminator>*! BitwiseANDExpressionNoIn) -> BitwiseXORExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseXORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseANDExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseXORExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("^"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseANDExpressionNoIn())), BitwiseXORExpressionNoIn);
        }.bind(this), 'BitwiseXORExpressionNoIn'));
    };
})();

// BitwiseORExpression: (BitwiseXORExpression | BitwiseORExpression <LineTerminator>*! ("|" -> Text) <LineTerminator>*! BitwiseXORExpression) -> BitwiseORExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseXORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseORExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("|"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseXORExpression())), BitwiseORExpression);
        }.bind(this), 'BitwiseORExpression'));
    };
})();

// BitwiseORExpressionNoIn: (BitwiseXORExpressionNoIn | BitwiseORExpressionNoIn <LineTerminator>*! ("|" -> Text) <LineTerminator>*! BitwiseXORExpressionNoIn) -> BitwiseORExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BitwiseORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseXORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.BitwiseORExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("|"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseXORExpressionNoIn())), BitwiseORExpressionNoIn);
        }.bind(this), 'BitwiseORExpressionNoIn'));
    };
})();

// LogicalANDExpression: (BitwiseORExpression | LogicalANDExpression <LineTerminator>*! ("&&" -> Text) <LineTerminator>*! BitwiseORExpression) -> LogicalANDExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalANDExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalANDExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("&&"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseORExpression())), LogicalANDExpression);
        }.bind(this), 'LogicalANDExpression'));
    };
})();

// LogicalANDExpressionNoIn: (BitwiseORExpressionNoIn | LogicalANDExpressionNoIn <LineTerminator>*! ("&&" -> Text) <LineTerminator>*! BitwiseORExpressionNoIn) -> LogicalANDExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalANDExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.BitwiseORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalANDExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("&&"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.BitwiseORExpressionNoIn())), LogicalANDExpressionNoIn);
        }.bind(this), 'LogicalANDExpressionNoIn'));
    };
})();

// LogicalORExpression: (LogicalANDExpression | LogicalORExpression <LineTerminator>*! ("||" -> Text) <LineTerminator>*! LogicalANDExpression) -> LogicalORExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.LogicalANDExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("||"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.LogicalANDExpression())), LogicalORExpression);
        }.bind(this), 'LogicalORExpression'));
    };
})();

// LogicalORExpressionNoIn: (LogicalANDExpressionNoIn | LogicalORExpressionNoIn <LineTerminator>*! ("||" -> Text) <LineTerminator>*! LogicalANDExpressionNoIn) -> LogicalORExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LogicalORExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.LogicalANDExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("||"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.LogicalANDExpressionNoIn())), LogicalORExpressionNoIn);
        }.bind(this), 'LogicalORExpressionNoIn'));
    };
})();

// ConditionalExpression: (LogicalORExpression | LogicalORExpression <LineTerminator>*! ("?" -> Text) <LineTerminator>*! AssignmentExpression <LineTerminator>*! (":" -> Text) <LineTerminator>*! AssignmentExpression) -> ConditionalExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ConditionalExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.LogicalORExpression(), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("?"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression())), ConditionalExpression);
        }.bind(this), 'ConditionalExpression'));
    };
})();

// ConditionalExpressionNoIn: (LogicalORExpressionNoIn | LogicalORExpressionNoIn <LineTerminator>*! ("?" -> Text) <LineTerminator>*! AssignmentExpressionNoIn <LineTerminator>*! (":" -> Text) <LineTerminator>*! AssignmentExpressionNoIn) -> ConditionalExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ConditionalExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.LogicalORExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("?"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpressionNoIn()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpressionNoIn())), ConditionalExpressionNoIn);
        }.bind(this), 'ConditionalExpressionNoIn'));
    };
})();

// AssignmentExpression: (ConditionalExpression | LeftHandSideExpression <LineTerminator>*! AssignmentOperator <LineTerminator>*! AssignmentExpression) -> AssignmentExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.ConditionalExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentOperator()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression())), AssignmentExpression);
        }.bind(this), 'AssignmentExpression'));
    };
})();

// AssignmentExpressionNoIn: (ConditionalExpressionNoIn | LeftHandSideExpression <LineTerminator>*! AssignmentOperator <LineTerminator>*! AssignmentExpressionNoIn) -> AssignmentExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.ConditionalExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.LeftHandSideExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentOperator()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpressionNoIn())), AssignmentExpressionNoIn);
        }.bind(this), 'AssignmentExpressionNoIn'));
    };
})();

// AssignmentOperator: ("=" | "*=" | "/=" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=") -> AssignmentOperator;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.AssignmentOperator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("="), g.Literal("*=")), g.Literal("/=")), g.Literal("%=")), g.Literal("+=")), g.Literal("-=")), g.Literal("<<=")), g.Literal(">>=")), g.Literal(">>>=")), g.Literal("&=")), g.Literal("^=")), g.Literal("|=")), AssignmentOperator);
        }.bind(this), 'AssignmentOperator'));
    };
})();

// Expression: (AssignmentExpression | Expression <LineTerminator>*! ("," -> Text) <LineTerminator>*! AssignmentExpression) -> Expression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Expression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.AssignmentExpression(), c.Seq(c.Seq(c.Seq(c.Seq(this.Expression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression())), Expression);
        }.bind(this), 'Expression'));
    };
})();

// ExpressionNoIn: (AssignmentExpressionNoIn | ExpressionNoIn <LineTerminator>*! ("," -> Text) <LineTerminator>*! AssignmentExpressionNoIn) -> ExpressionNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ExpressionNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.AssignmentExpressionNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.ExpressionNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpressionNoIn())), ExpressionNoIn);
        }.bind(this), 'ExpressionNoIn'));
    };
})();

// Statement: (Block | VariableStatement | EmptyStatement | ExpressionStatement | IfStatement | IterationStatement | ContinueStatement | BreakStatement | ReturnStatement | WithStatement | LabelledStatement | SwitchStatement | ThrowStatement | TryStatement | DebuggerStatement) -> Statement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Statement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(this.Block(), this.VariableStatement()), this.EmptyStatement()), this.ExpressionStatement()), this.IfStatement()), this.IterationStatement()), this.ContinueStatement()), this.BreakStatement()), this.ReturnStatement()), this.WithStatement()), this.LabelledStatement()), this.SwitchStatement()), this.ThrowStatement()), this.TryStatement()), this.DebuggerStatement()), Statement);
        }.bind(this), 'Statement'));
    };
})();

// Block: ("{" -> Text) <LineTerminator>*! StatementList? <LineTerminator>*! ("}" -> Text) -> Block;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Block = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.StatementList())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text)), Block);
        }.bind(this), 'Block'));
    };
})();

// StatementList: (Statement | StatementList <LineTerminator>*! Statement) -> StatementList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.StatementList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.Statement(), c.Seq(c.Seq(this.StatementList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), StatementList);
        }.bind(this), 'StatementList'));
    };
})();

// VariableStatement: ("var" -> Text) <LineTerminator>*! VariableDeclarationList <LineTerminator>*! (";" -> Text) -> VariableStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("var"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.VariableDeclarationList()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), VariableStatement);
        }.bind(this), 'VariableStatement'));
    };
})();

// VariableDeclarationList: (VariableDeclaration | VariableDeclarationList <LineTerminator>*! ("," -> Text) <LineTerminator>*! VariableDeclaration) -> VariableDeclarationList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.VariableDeclaration(), c.Seq(c.Seq(c.Seq(c.Seq(this.VariableDeclarationList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.VariableDeclaration())), VariableDeclarationList);
        }.bind(this), 'VariableDeclarationList'));
    };
})();

// VariableDeclarationListNoIn: (VariableDeclarationNoIn | VariableDeclarationListNoIn <LineTerminator>*! ("," -> Text) <LineTerminator>*! VariableDeclarationNoIn) -> VariableDeclarationListNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationListNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.VariableDeclarationNoIn(), c.Seq(c.Seq(c.Seq(c.Seq(this.VariableDeclarationListNoIn(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.VariableDeclarationNoIn())), VariableDeclarationListNoIn);
        }.bind(this), 'VariableDeclarationListNoIn'));
    };
})();

// VariableDeclaration: (<Identifier> -> Text) <LineTerminator>*! Initialiser? -> VariableDeclaration;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclaration = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Capture(this.Identifier()), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Initialiser())), VariableDeclaration);
        }.bind(this), 'VariableDeclaration'));
    };
})();

// VariableDeclarationNoIn: (<Identifier> -> Text) <LineTerminator>*! InitialiserNoIn? -> VariableDeclarationNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.VariableDeclarationNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Capture(this.Identifier()), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.InitialiserNoIn())), VariableDeclarationNoIn);
        }.bind(this), 'VariableDeclarationNoIn'));
    };
})();

// Initialiser: ("=" -> Text) <LineTerminator>*! AssignmentExpression -> Initialiser;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Initialiser = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Literal("="), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpression()), Initialiser);
        }.bind(this), 'Initialiser'));
    };
})();

// InitialiserNoIn: ("=" -> Text) <LineTerminator>*! AssignmentExpressionNoIn -> InitialiserNoIn;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.InitialiserNoIn = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Literal("="), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.AssignmentExpressionNoIn()), InitialiserNoIn);
        }.bind(this), 'InitialiserNoIn'));
    };
})();

// EmptyStatement: ";" -> EmptyStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.EmptyStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(g.Literal(";"), EmptyStatement);
        }.bind(this), 'EmptyStatement'));
    };
})();

// ExpressionStatement: ?= ~ ("{" | "function") <LineTerminator>*! Expression <LineTerminator>*! (";" -> Text) -> ExpressionStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ExpressionStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(l.Look(c.Not(c.Or(g.Literal("{"), g.Literal("function")))), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), ExpressionStatement);
        }.bind(this), 'ExpressionStatement'));
    };
})();

// IfStatement: (("if" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement <LineTerminator>*! ("else" -> Text) <LineTerminator>*! Statement | ("if" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement) -> IfStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.IfStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("if"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("else"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement()), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("if"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), IfStatement);
        }.bind(this), 'IfStatement'));
    };
})();

// IterationStatement: (("do" -> Text) <LineTerminator>*! Statement <LineTerminator>*! ("while" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (");" -> Text) | ("while" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement | ("for" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! ExpressionNoIn? <LineTerminator>*! (";" -> Text) <LineTerminator>*! Expression? <LineTerminator>*! (";" -> Text) <LineTerminator>*! Expression? <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement | ("for" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! ("var" -> Text) <LineTerminator>*! VariableDeclarationListNoIn <LineTerminator>*! (";" -> Text) <LineTerminator>*! Expression? <LineTerminator>*! (";" -> Text) <LineTerminator>*! Expression? <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement | ("for" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! LeftHandSideExpression <LineTerminator>*! ("in" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement | ("for" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! ("var" -> Text) <LineTerminator>*! VariableDeclarationNoIn <LineTerminator>*! ("in" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement) -> IterationStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.IterationStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("do"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("while"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(");"), Text)), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("while"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("for"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.ExpressionNoIn())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Expression())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Expression())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("for"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("var"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.VariableDeclarationListNoIn()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Expression())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.Expression())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("for"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.LeftHandSideExpression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("in"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("for"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("var"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.VariableDeclarationNoIn()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("in"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement())), IterationStatement);
        }.bind(this), 'IterationStatement'));
    };
})();

// ContinueStatement: ("continue" -> Text) (<Identifier> -> Text)? <LineTerminator>*! (";" -> Text) -> ContinueStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ContinueStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("continue"), Text), c.Maybe(c.Red(g.Capture(this.Identifier()), Text))), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), ContinueStatement);
        }.bind(this), 'ContinueStatement'));
    };
})();

// BreakStatement: ("break" -> Text) (<Identifier> -> Text)? <LineTerminator>*! (";" -> Text) -> BreakStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.BreakStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("break"), Text), c.Maybe(c.Red(g.Capture(this.Identifier()), Text))), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), BreakStatement);
        }.bind(this), 'BreakStatement'));
    };
})();

// ReturnStatement: ("return" -> Text) Expression? <LineTerminator>*! (";" -> Text) -> ReturnStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ReturnStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("return"), Text), c.Maybe(this.Expression())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), ReturnStatement);
        }.bind(this), 'ReturnStatement'));
    };
})();

// WithStatement: ("with" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! Statement -> WithStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.WithStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("with"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement()), WithStatement);
        }.bind(this), 'WithStatement'));
    };
})();

// SwitchStatement: ("switch" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (")" -> Text) <LineTerminator>*! CaseBlock -> SwitchStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SwitchStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("switch"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.CaseBlock()), SwitchStatement);
        }.bind(this), 'SwitchStatement'));
    };
})();

// CaseBlock: (("{" -> Text) <LineTerminator>*! CaseClauses? <LineTerminator>*! ("}" -> Text) | ("{" -> Text) <LineTerminator>*! CaseClauses? <LineTerminator>*! DefaultClause <LineTerminator>*! CaseClauses? <LineTerminator>*! ("}" -> Text)) -> CaseBlock;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseBlock = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text)), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("{"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.DefaultClause()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.CaseClauses())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text))), CaseBlock);
        }.bind(this), 'CaseBlock'));
    };
})();

// CaseClauses: (CaseClause | CaseClauses <LineTerminator>*! CaseClause) -> CaseClauses;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseClauses = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.CaseClause(), c.Seq(c.Seq(this.CaseClauses(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.CaseClause())), CaseClauses);
        }.bind(this), 'CaseClauses'));
    };
})();

// CaseClause: ("case" -> Text) <LineTerminator>*! Expression <LineTerminator>*! (":" -> Text) <LineTerminator>*! StatementList? -> CaseClause;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.CaseClause = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("case"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.StatementList())), CaseClause);
        }.bind(this), 'CaseClause'));
    };
})();

// DefaultClause: ("default" -> Text) <LineTerminator>*! (":" -> Text) <LineTerminator>*! StatementList? -> DefaultClause;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.DefaultClause = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("default"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.StatementList())), DefaultClause);
        }.bind(this), 'DefaultClause'));
    };
})();

// LabelledStatement: (<Identifier> -> Text) <LineTerminator>*! (":" -> Text) <LineTerminator>*! Statement -> LabelledStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.LabelledStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Capture(this.Identifier()), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(":"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Statement()), LabelledStatement);
        }.bind(this), 'LabelledStatement'));
    };
})();

// ThrowStatement: ("throw" -> Text) Expression <LineTerminator>*! (";" -> Text) -> ThrowStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.ThrowStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("throw"), Text), this.Expression()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), ThrowStatement);
        }.bind(this), 'ThrowStatement'));
    };
})();

// TryStatement: (("try" -> Text) <LineTerminator>*! Block <LineTerminator>*! Catch | ("try" -> Text) <LineTerminator>*! Block <LineTerminator>*! Finally | ("try" -> Text) <LineTerminator>*! Block <LineTerminator>*! Catch <LineTerminator>*! Finally) -> TryStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.TryStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("try"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Block()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Catch()), c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("try"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Block()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Finally())), c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("try"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Block()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Catch()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Finally())), TryStatement);
        }.bind(this), 'TryStatement'));
    };
})();

// Catch: ("catch" -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! (<Identifier> -> Text) <LineTerminator>*! (")" -> Text) <LineTerminator>*! Block -> Catch;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Catch = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("catch"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Capture(this.Identifier()), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Block()), Catch);
        }.bind(this), 'Catch'));
    };
})();

// Finally: ("finally" -> Text) <LineTerminator>*! Block -> Finally;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Finally = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Literal("finally"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.Block()), Finally);
        }.bind(this), 'Finally'));
    };
})();

// DebuggerStatement: ("debugger" -> Text) <LineTerminator>*! (";" -> Text) -> DebuggerStatement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.DebuggerStatement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Red(g.Literal("debugger"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(";"), Text)), DebuggerStatement);
        }.bind(this), 'DebuggerStatement'));
    };
})();

// FunctionDeclaration: ("function" -> Text) <LineTerminator>*! (<Identifier> -> Text) <LineTerminator>*! ("(" -> Text) <LineTerminator>*! FormalParameterList? <LineTerminator>*! (")" -> Text) <LineTerminator>*! ("{" -> Text) <LineTerminator>*! FunctionBody <LineTerminator>*! ("}" -> Text) -> FunctionDeclaration;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionDeclaration = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("function"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Capture(this.Identifier()), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.FormalParameterList())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("{"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.FunctionBody()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text)), FunctionDeclaration);
        }.bind(this), 'FunctionDeclaration'));
    };
})();

// FunctionExpression: ("function" -> Text) <LineTerminator>*! (<Identifier> -> Text)? <LineTerminator>*! ("(" -> Text) <LineTerminator>*! FormalParameterList? <LineTerminator>*! (")" -> Text) <LineTerminator>*! ("{" -> Text) <LineTerminator>*! FunctionBody <LineTerminator>*! ("}" -> Text) -> FunctionExpression;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Red(g.Literal("function"), Text), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(c.Red(g.Capture(this.Identifier()), Text))), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("("), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Maybe(this.FormalParameterList())), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(")"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("{"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.FunctionBody()), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("}"), Text)), FunctionExpression);
        }.bind(this), 'FunctionExpression'));
    };
})();

// FormalParameterList: (<Identifier> -> Text | FormalParameterList <LineTerminator>*! ("," -> Text) <LineTerminator>*! (<Identifier> -> Text)) -> FormalParameterList;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FormalParameterList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Red(g.Capture(this.Identifier()), Text), c.Seq(c.Seq(c.Seq(c.Seq(this.FormalParameterList(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal(","), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Capture(this.Identifier()), Text))), FormalParameterList);
        }.bind(this), 'FormalParameterList'));
    };
})();

// FunctionBody: SourceElements? -> FunctionBody;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.FunctionBody = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Maybe(this.SourceElements()), FunctionBody);
        }.bind(this), 'FunctionBody'));
    };
})();

// Program: SourceElements? -> Program;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.Program = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Maybe(this.SourceElements()), Program);
        }.bind(this), 'Program'));
    };
})();

// SourceElements: (SourceElement | SourceElements <LineTerminator>*! SourceElement) -> SourceElements;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SourceElements = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.SourceElement(), c.Seq(c.Seq(this.SourceElements(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.SourceElement())), SourceElements);
        }.bind(this), 'SourceElements'));
    };
})();

// SourceElement: (Statement | FunctionDeclaration) -> SourceElement;
(function() {
    var $cache;
    
    exports.Syntactic.prototype.SourceElement = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(this.Statement(), this.FunctionDeclaration()), SourceElement);
        }.bind(this), 'SourceElement'));
    };
})();
