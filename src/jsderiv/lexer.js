var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

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

// SPACE: ((" " | "\t" | "\r" | "\n")+ ?= ~ (" " | "\t" | "\r" | "\n"))!;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SPACE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(c.Seq(c.Many(c.Or(c.Or(c.Or(g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))), l.Look(c.Not(c.Or(c.Or(c.Or(g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))))));
        }.bind(this), 'SPACE'));
    };
})();

// ID: [A-Za-z]+ ?= ~ [A-Za-z] & ~ KEYWORD -> ID;
(function() {
    var $cache;
    
    exports.Lexer.prototype.ID = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.And(c.Seq(c.Many(c.Or(g.Range("A", "Z"), g.Range("a", "z"))), l.Look(c.Not(c.Or(g.Range("A", "Z"), g.Range("a", "z"))))), c.Not(this.KEYWORD())), ID);
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

// LITERAL: ("\"" ([^"\\] | "\\\\" | "\\\"" | "\\t" | "\\r" | "\\n")* "\"" | '\'' ([^'\\] | '\\\\' | '\\\'' | '\\t' | '\\r' | '\\n')* '\'') -> LITERAL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.LITERAL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Seq(c.Seq(g.Literal("\""), c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(g.Char("\""), g.Char("\\")))), g.Literal("\\\\")), g.Literal("\\\"")), g.Literal("\\t")), g.Literal("\\r")), g.Literal("\\n")))), g.Literal("\"")), c.Seq(c.Seq(g.Literal('\''), c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(g.Char("'"), g.Char("\\")))), g.Literal('\\\\')), g.Literal('\\\'')), g.Literal('\\t')), g.Literal('\\r')), g.Literal('\\n')))), g.Literal('\''))), LITERAL);
        }.bind(this), 'LITERAL'));
    };
})();

// SYMBOL: (":" | ";" | "(" | ")" | "*" | "+" | "?" | "&" | "|" | "~" | "?=" | "!" | "->" | "@" | "{" | "}" | "," | ".") -> SYMBOL;
(function() {
    var $cache;
    
    exports.Lexer.prototype.SYMBOL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal(":"), g.Literal(";")), g.Literal("(")), g.Literal(")")), g.Literal("*")), g.Literal("+")), g.Literal("?")), g.Literal("&")), g.Literal("|")), g.Literal("~")), g.Literal("?=")), g.Literal("!")), g.Literal("->")), g.Literal("@")), g.Literal("{")), g.Literal("}")), g.Literal(",")), g.Literal(".")), SYMBOL);
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

// CHAR: [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\t" | "\\r" | "\\n" | "\\]";
(function() {
    var $cache;
    
    exports.Lexer.prototype.CHAR = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(c.Or(c.Or(g.Char("^"), g.Char("-")), g.Char("\\")), g.Char("]")))), g.Literal("\\^")), g.Literal("\\-")), g.Literal("\\\\")), g.Literal("\\t")), g.Literal("\\r")), g.Literal("\\n")), g.Literal("\\]"));
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

// KEYWORD: ("grammar" | "start" | "import" | "from" | "export" | "constructor" | "augment" | "default") -> KEYWORD;
(function() {
    var $cache;
    
    exports.Lexer.prototype.KEYWORD = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("grammar"), g.Literal("start")), g.Literal("import")), g.Literal("from")), g.Literal("export")), g.Literal("constructor")), g.Literal("augment")), g.Literal("default")), KEYWORD);
        }.bind(this), 'KEYWORD'));
    };
})();
