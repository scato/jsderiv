var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var Lexer = exports.Lexer = function() {};

// start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
Lexer.prototype.start = function() {
    return c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
        this.SPACE(), this.ID()), this.COMMENT()), this.LITERAL()), this.SYMBOL()), this.CLASS()), this.KEYWORD())
    );
};

// NEWLINE: "\r\n" | "\n";
Lexer.prototype.NEWLINE = function() {
    return g.Ref(function() {
        return c.Or(g.Literal("\r\n"), g.Literal("\n"));
    }.bind(this));
};

// SPACE:      (" " | "\t" | "\r" | "\n")+!;
Lexer.prototype.SPACE = function() {
    return g.Ref(function() {
        return c.Ignore(c.Many(c.Or(c.Or(c.Or(
            g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))
        ));
    }.bind(this));
};

// ID:         [A-Za-z]+ ?= ~[A-Za-z] & ~KEYWORD -> ID;
Lexer.prototype.ID = function() {
    return g.Ref(function() {
        return c.Red(c.And(
            c.Seq(
                c.Many(c.Or(g.Range("A", "Z"), g.Range("a", "z"))),
                l.Look(c.Not(c.Or(g.Range("A", "Z"), g.Range("a", "z"))))
            ),
            c.Not(this.KEYWORD())
        ), function(x) { return ID(x); });
    }.bind(this));
};

// // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" (~NEWLINE)* ?= NEWLINE)!;
// COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" (~NEWLINE)* ?= NEWLINE)!
Lexer.prototype.COMMENT = function() {
//    return g.Ref(function() {
//        return c.Ignore(c.Or(
//            c.Seq(c.Seq(g.Literal("/*"), c.Any(
//                c.Or(c.And(g.One(), c.Not(g.Char("*"))), c.Seq(g.Char("*"), l.Look(c.Not(g.Char("/")))))
//            )), g.Literal("*/")),
//            c.Seq(c.Seq(g.Literal("//"), c.Any(c.Not(this.NEWLINE()))), l.Look(this.NEWLINE()))
//        ));
//    }.bind(this));
    return g.Ref(function() {
        return c.Ignore(c.Or(
            c.Seq(c.Seq(g.Literal("/*"), c.Not(
                c.Seq(c.Seq(c.Any(g.One()), g.Literal("*/")), c.Any(g.One()))
            )), g.Literal("*/")),
            c.Seq(c.Seq(g.Literal("//"), c.Any(c.Not(this.NEWLINE()))), l.Look(this.NEWLINE()))
        ));
    }.bind(this));
};

// LITERAL:    (
//                 "\"" ([^"] | "\\\\" | "\\\"")* "\""
//               | '\'' ([^'] | '\\\\' | '\\\'')* '\''
//             ) -> LITERAL;
Lexer.prototype.LITERAL = function() {
    return g.Ref(function() {
        return c.Red(c.Or(
            c.Seq(c.Seq(g.Literal("\""), c.Any(
                c.Or(c.Or(c.And(g.One(), c.Not(g.Literal("\""))), g.Literal("\\\\")), g.Literal("\\\""))
            )), g.Literal("\"")),
            c.Seq(c.Seq(g.Literal('\''), c.Any(
                c.Or(c.Or(c.And(g.One(), c.Not(g.Literal('\''))), g.Literal('\\\\')), g.Literal('\\\''))
            )), g.Literal('\''))
        ), function(x) { return LITERAL(x); });
    }.bind(this));
};

// SYMBOL:     (
//                 ":" | ";"
//               | "(" | ")"
//               | "*" | "+" | "?"
//               | "&" | "|" | "~"
//               | "?=" | "!" | "->" | "@"
//               | "{" | "}" | "," | "."
//             ) -> SYMBOL;
Lexer.prototype.SYMBOL = function() {
    return g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
                g.Literal(":"), g.Literal(";")),
                g.Literal("(")), g.Literal(")")),
                g.Literal("*")), g.Literal("+")), g.Literal("?")),
                g.Literal("&")), g.Literal("|")), g.Literal("~")),
                g.Literal("?=")), g.Literal("!")), g.Literal("->")), g.Literal("@")),
                g.Literal("{")), g.Literal("}")), g.Literal(",")), g.Literal(".")
        ), function(x) { return SYMBOL(x); });
    }.bind(this));
};

// RANGE:      CHAR "-" CHAR;
Lexer.prototype.RANGE = function() {
    return g.Ref(function() {
        return c.Seq(c.Seq(this.CHAR(), g.Literal("-")), this.CHAR());
    }.bind(this));
};

// CHAR:       [^\^\-\\] | "\\^" | "\\-" | "\\\\";
Lexer.prototype.CHAR = function() {
    return g.Ref(function() {
        return c.Or(c.Or(c.Or(
            c.And(g.One(), c.Not(c.Or(c.Or(g.Literal("^"), g.Literal("-")), g.Literal("\\")))),
            g.Literal("\\^")),
            g.Literal("\\-")),
            g.Literal("\\\\")
        );
    }.bind(this));
};

// CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
Lexer.prototype.CLASS = function() {
    return g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(
            g.Literal("["),
            c.Any(c.Or(this.RANGE(), this.CHAR()))),
            c.Maybe(c.Seq(g.Literal("^"), c.Many(c.Or(this.RANGE(), this.CHAR()))))),
            g.Literal("]")
        ), function(x) { return CLASS(x); });
    }.bind(this));
};

// KEYWORD:    "grammar" | "start" | "end" | "import" | "from" | "constructor" -> KEYWORD;
Lexer.prototype.KEYWORD = function() {
    return g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(
            g.Literal("grammar"),
            g.Literal("start")),
            g.Literal("end")),
            g.Literal("import")),
            g.Literal("from")),
            g.Literal("constructor")
        ), function(x) { return KEYWORD(x); });
    }.bind(this));
};

// export constructor ID;
var ID = exports.ID = g.Cons("ID");

// export constructor LITERAL;
var LITERAL = exports.LITERAL = g.Cons("LITERAL");

// export constructor SYMBOL;
var SYMBOL = exports.SYMBOL = g.Cons("SYMBOL");

// export constructor CLASS;
var CLASS = exports.CLASS = g.Cons("CLASS");

// export constructor KEYWORD;
var KEYWORD = exports.KEYWORD = g.Cons("KEYWORD");
