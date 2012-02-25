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
    return this._NEWLINE = this._NEWLINE || g.Ref(function() {
        return c.Or(g.Literal("\r\n"), g.Literal("\n"));
    }.bind(this), 'NEWLINE');
};

// SPACE:      ((" " | "\t" | "\r" | "\n")+ ?= ~(" " | "\t" | "\r" | "\n"))!;
Lexer.prototype.SPACE = function() {
    return this._SPACE = this._SPACE || g.Ref(function() {
        return c.Ignore(c.Seq(
            c.Many(c.Or(c.Or(c.Or(
                g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))
            ),
            l.Look(c.Not(c.Or(c.Or(c.Or(
                g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))
            ))
        ));
    }.bind(this), 'SPACE');
};

// ID:         [A-Za-z]+ ?= ~[A-Za-z] & ~KEYWORD -> ID;
Lexer.prototype.ID = function() {
    return this._ID = this._ID || g.Ref(function() {
        return c.Red(c.And(
            c.Seq(
                c.Many(c.Or(g.Range("A", "Z"), g.Range("a", "z"))),
                l.Look(c.Not(c.Or(g.Range("A", "Z"), g.Range("a", "z"))))
            ),
            c.Not(this.KEYWORD())
        ), ID);
    }.bind(this), 'ID');
};

// // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
// // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ([^\r\n] | "\r" ?= ~"\n")* ?= NEWLINE)!;
// COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
// // COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" ~(.* NEWLINE .*) ?= NEWLINE)!;
Lexer.prototype.COMMENT = function() {
//    return this._COMMENT = this._COMMENT || g.Ref(function() {
//        return c.Ignore(c.Or(
//            c.Seq(c.Seq(g.Literal("/*"), c.Any(
//                c.Or(c.And(g.One(), c.Not(g.Char("*"))), c.Seq(g.Char("*"), l.Look(c.Not(g.Char("/")))))
//            )), g.Literal("*/")),
//            c.Seq(c.Seq(g.Literal("//"), c.Not(
//                c.Or(c.And(g.One(), c.Not(c.Or(g.Char("\r"), g.Char("\n")))), c.Seq(g.Char("\r"), l.Look(c.Not(g.Char("\n")))))
//            )), l.Look(this.NEWLINE()))
//        ));
//    }.bind(this), 'COMMENT');
//    return this._COMMENT = this._COMMENT || g.Ref(function() {
//        return c.Ignore(c.Or(
//            c.Seq(c.Seq(g.Literal("/*"), c.Not(
//                c.Seq(c.Seq(c.Any(g.One()), g.Literal("*/")), c.Any(g.One()))
//            )), g.Literal("*/")),
//            c.Seq(c.Seq(g.Literal("//"), c.Not(
//                c.Or(c.And(g.One(), c.Not(c.Or(g.Char("\r"), g.Char("\n")))), c.Seq(g.Char("\r"), l.Look(c.Not(g.Char("\n")))))
//            )), l.Look(this.NEWLINE()))
//        ));
//    }.bind(this), 'COMMENT');
    return this._COMMENT = this._COMMENT || g.Ref(function() {
        return c.Ignore(c.Or(
            c.Seq(c.Seq(g.Literal("/*"), c.Any(
                c.Or(c.And(g.One(), c.Not(g.Char("*"))), c.Seq(g.Char("*"), l.Look(c.Not(g.Char("/")))))
            )), g.Literal("*/")),
            c.Seq(c.Seq(g.Literal("//"), c.Not(
                c.Seq(c.Seq(c.Any(g.One()), this.NEWLINE()), c.Any(g.One()))
            )), l.Look(this.NEWLINE()))
        ));
    }.bind(this), 'COMMENT');
//    return this._COMMENT = this._COMMENT || g.Ref(function() {
//        return c.Ignore(c.Or(
//            c.Seq(c.Seq(g.Literal("/*"), c.Not(
//                c.Seq(c.Seq(c.Any(g.One()), g.Literal("*/")), c.Any(g.One()))
//            )), g.Literal("*/")),
//            c.Seq(c.Seq(g.Literal("//"), c.Not(
//                c.Seq(c.Seq(c.Any(g.One()), this.NEWLINE()), c.Any(g.One()))
//            )), l.Look(this.NEWLINE()))
//        ));
//    }.bind(this), 'COMMENT');
};

// LITERAL:    (
//                 "\"" ([^"\\] | "\\\\" | "\\\"" | "\\t" | "\\r" | "\\n")* "\""
//               | '\'' ([^'\\] | '\\\\' | '\\\'' | '\\t' | '\\r' | '\\n')* '\''
//             ) -> LITERAL;
Lexer.prototype.LITERAL = function() {
    return this._LITERAL = this._LITERAL || g.Ref(function() {
        return c.Red(c.Or(
            c.Seq(c.Seq(g.Literal("\""), c.Any(
                c.Or(c.Or(c.Or(c.Or(c.Or(
                    c.And(g.One(), c.Not(c.Or(g.Literal("\""), g.Literal("\\")))),
                    g.Literal("\\\\")),
                    g.Literal("\\\"")),
                    g.Literal("\\t")),
                    g.Literal("\\r")),
                    g.Literal("\\n")
                )
            )), g.Literal("\"")),
            c.Seq(c.Seq(g.Literal('\''), c.Any(
                c.Or(c.Or(c.Or(c.Or(c.Or(
                    c.And(g.One(), c.Not(c.Or(g.Literal('\''), g.Literal('\\')))),
                    g.Literal('\\\\')),
                    g.Literal('\\\'')),
                    g.Literal('\\t')),
                    g.Literal('\\r')),
                    g.Literal('\\n')
                )
            )), g.Literal('\''))
        ), LITERAL);
    }.bind(this), 'LITERAL');
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
    return this._SYMBOL = this._SYMBOL || g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
                g.Literal(":"), g.Literal(";")),
                g.Literal("(")), g.Literal(")")),
                g.Literal("*")), g.Literal("+")), g.Literal("?")),
                g.Literal("&")), g.Literal("|")), g.Literal("~")),
                g.Literal("?=")), g.Literal("!")), g.Literal("->")), g.Literal("@")),
                g.Literal("{")), g.Literal("}")), g.Literal(",")), g.Literal(".")
        ), SYMBOL);
    }.bind(this), 'SYMBOL');
};

// RANGE:      CHAR "-" CHAR;
Lexer.prototype.RANGE = function() {
    return this._RANGE = this._RANGE || g.Ref(function() {
        return c.Seq(c.Seq(this.CHAR(), g.Literal("-")), this.CHAR());
    }.bind(this), 'RANGE');
};

// CHAR:       [^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\t" | "\\r" | "\\n" | "\\]";
Lexer.prototype.CHAR = function() {
    return this._CHAR = this._CHAR || g.Ref(function() {
        return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
            c.And(g.One(), c.Not(c.Or(c.Or(c.Or(g.Literal("^"), g.Literal("-")), g.Literal("\\")), g.Literal("]")))),
            g.Literal("\\^")),
            g.Literal("\\-")),
            g.Literal("\\\\")),
            g.Literal("\\t")),
            g.Literal("\\r")),
            g.Literal("\\n")),
            g.Literal("\\]")
        );
    }.bind(this), 'CHAR');
};

// CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
Lexer.prototype.CLASS = function() {
    return this._CLASS = this._CLASS || g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(
            g.Literal("["),
            c.Any(c.Or(this.RANGE(), this.CHAR()))),
            c.Maybe(c.Seq(g.Literal("^"), c.Many(c.Or(this.RANGE(), this.CHAR()))))),
            g.Literal("]")
        ), CLASS);
    }.bind(this), 'CLASS');
};

// KEYWORD:    "grammar" | "start" | "end" | "import" | "from" | "constructor" -> KEYWORD;
Lexer.prototype.KEYWORD = function() {
    return this._KEYWORD = this._KEYWORD || g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(
            g.Literal("grammar"),
            g.Literal("start")),
            g.Literal("end")),
            g.Literal("import")),
            g.Literal("from")),
            g.Literal("constructor")
        ), KEYWORD);
    }.bind(this), 'KEYWORD');
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
