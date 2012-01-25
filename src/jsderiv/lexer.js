var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var Grammar = exports.Grammar = function() {};

// start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
Grammar.prototype.start = function() {
    return c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
        this.SPACE(), this.ID()), this.COMMENT()), this.LITERAL()), this.SYMBOL()), this.CLASS()), this.KEYWORD())
    );
};

// NEWLINE: "\r\n" | "\n";
Grammar.prototype.NEWLINE = function() {
    return g.Ref(function() {
        return c.Or(g.Literal("\r\n"), g.Literal("\n"));
    }.bind(this));
};

// SPACE:      (" " | "\t" | "\r" | "\n")+!;
Grammar.prototype.SPACE = function() {
    return g.Ref(function() {
        return c.Ignore(c.Many(c.Or(c.Or(c.Or(
            g.Literal(" "), g.Literal("\t")), g.Literal("\r")), g.Literal("\n"))
        ));
    }.bind(this));
};

// ID:         [A-Za-z]+ ?= ~[A-Za-z] & ~KEYWORD -> ID;
Grammar.prototype.ID = function() {
    return g.Ref(function() {
        return c.Red(c.And(
            c.Seq(
                c.Many(c.Or(g.Range("A", "Z"), g.Range("a", "z"))),
                l.Look(c.Not(c.Or(g.Range("A", "Z"), g.Range("a", "z"))))
            ),
            c.Not(this.KEYWORD())
        ), function(x) { return [ID(x)]; });
    }.bind(this));
};

// // COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" (~NEWLINE)* ?= NEWLINE)!;
// COMMENT:    ("/*" ~(.* "*/" .*) "*/" | "//" (~NEWLINE)* ?= NEWLINE)!
Grammar.prototype.COMMENT = function() {
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
Grammar.prototype.LITERAL = function() {
    return g.Ref(function() {
        return c.Red(c.Or(
            c.Seq(c.Seq(g.Literal("\""), c.Any(
                c.Or(c.Or(c.And(g.One(), c.Not(g.Literal("\""))), g.Literal("\\\\")), g.Literal("\\\""))
            )), g.Literal("\"")),
            c.Seq(c.Seq(g.Literal('\''), c.Any(
                c.Or(c.Or(c.And(g.One(), c.Not(g.Literal('\''))), g.Literal('\\\\')), g.Literal('\\\''))
            )), g.Literal('\''))
        ), function(x) { return [LITERAL(x)]; });
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
Grammar.prototype.SYMBOL = function() {
    return g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(
                g.Literal(":"), g.Literal(";")),
                g.Literal("(")), g.Literal(")")),
                g.Literal("*")), g.Literal("+")), g.Literal("?")),
                g.Literal("&")), g.Literal("|")), g.Literal("~")),
                g.Literal("?=")), g.Literal("!")), g.Literal("->")), g.Literal("@")),
                g.Literal("{")), g.Literal("}")), g.Literal(",")), g.Literal(".")
        ), function(x) { return [SYMBOL(x)]; });
    }.bind(this));
};

// RANGE:      CHAR "-" CHAR;
Grammar.prototype.RANGE = function() {
    return g.Ref(function() {
        return c.Seq(c.Seq(this.CHAR(), g.Literal("-")), this.CHAR());
    }.bind(this));
};

// CHAR:       [^\^\-\\] | "\\^" | "\\-" | "\\\\";
Grammar.prototype.CHAR = function() {
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
Grammar.prototype.CLASS = function() {
    return g.Ref(function() {
        return c.Red(c.Seq(c.Seq(c.Seq(
            g.Literal("["),
            c.Any(c.Or(this.RANGE(), this.CHAR()))),
            c.Maybe(c.Seq(g.Literal("^"), c.Many(c.Or(this.RANGE(), this.CHAR()))))),
            g.Literal("]")
        ), function(x) { return [CLASS(x)]; });
    }.bind(this));
};

// KEYWORD:    "grammar" | "start" | "end" | "import" | "from" | "constructor" -> KEYWORD;
Grammar.prototype.KEYWORD = function() {
    return g.Ref(function() {
        return c.Red(c.Or(c.Or(c.Or(c.Or(c.Or(
            g.Literal("grammar"),
            g.Literal("start")),
            g.Literal("end")),
            g.Literal("import")),
            g.Literal("from")),
            g.Literal("constructor")
        ), function(x) { return [KEYWORD(x)]; });
    }.bind(this));
};

// cons ID;
var ID = exports.ID = function(value, metadata) {
    if(this.constructor === ID) {
        g.Node.apply(this, ['ID', value, metadata]);
        
        return this;
    } else {
        return new ID(value, metadata);
    }
};

ID.prototype = Object.create(g.Node.prototype);
ID.prototype.constructor = ID;

// cons LITERAL;
var LITERAL = exports.LITERAL = function(value, metadata) {
    if(this.constructor === LITERAL) {
        g.Node.apply(this, ['LITERAL', value, metadata]);
        
        return this;
    } else {
        return new LITERAL(value, metadata);
    }
};

LITERAL.prototype = Object.create(g.Node.prototype);
LITERAL.prototype.constructor = LITERAL;

// cons SYMBOL;
var SYMBOL = exports.SYMBOL = function(value, metadata) {
    if(this.constructor === SYMBOL) {
        g.Node.apply(this, ['SYMBOL', value, metadata]);
        
        return this;
    } else {
        return new SYMBOL(value, metadata);
    }
};

SYMBOL.prototype = Object.create(g.Node.prototype);
SYMBOL.prototype.constructor = SYMBOL;

// cons CLASS;
var CLASS = exports.CLASS = function(value, metadata) {
    if(this.constructor === CLASS) {
        g.Node.apply(this, ['CLASS', value, metadata]);
        
        return this;
    } else {
        return new CLASS(value, metadata);
    }
};

CLASS.prototype = Object.create(g.Node.prototype);
CLASS.prototype.constructor = CLASS;

// cons KEYWORD;
var KEYWORD = exports.KEYWORD = function(value, metadata) {
    if(this.constructor === KEYWORD) {
        g.Node.apply(this, ['KEYWORD', value, metadata]);
        
        return this;
    } else {
        return new KEYWORD(value, metadata);
    }
};

KEYWORD.prototype = Object.create(g.Node.prototype);
KEYWORD.prototype.constructor = KEYWORD;
