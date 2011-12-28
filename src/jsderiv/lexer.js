var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var Grammar = exports.Grammar = function() {};

// start (SPACE | ID | COMMENT | LITERAL | SYMBOL | CLASS | KEYWORD)*;
Grammar.prototype.start = function() {
    return new c.Any(new c.Or(new c.Or(new c.Or(new c.Or(new c.Or(new c.Or(
        this.SPACE(), this.ID()), this.COMMENT()), this.LITERAL()), this.SYMBOL()), this.CLASS()), this.KEYWORD())
    );
};

// NEWLINE: "\r\n" | "\n";
Grammar.prototype.NEWLINE = function() {
    return new g.Ref(function() {
        return new c.Or(g.Literal("\r\n"), new g.Literal("\n"));
    }.bind(this));
};

// SPACE:      (" " | "\t" | "\r" | "\n")+!;
Grammar.prototype.SPACE = function() {
    return new g.Ref(function() {
        return new c.Ignore(new c.Many(new c.Or(new c.Or(new c.Or(
            new g.Literal(" "), new g.Literal("\t")), new g.Literal("\r")), new g.Literal("\n"))
        ));
    }.bind(this));
};

//ID:         [A-Za-z]+ & ~KEYWORD -> ID;
Grammar.prototype.ID = function() {
    return new g.Ref(function() {
        return new c.Red(new c.And(
            new c.Or(new g.Range("A", "Z"), new g.Range("a", "z")),
            new c.Not(this.KEYWORD())
        ), ID);
    }.bind(this));
};

// COMMENT:    ("/*" ([^*] | "*" ?= ~"/")* "*/" | "//" ~NEWLINE ?= (NEWLINE | end))!;
Grammar.prototype.COMMENT = function() {
    return new g.Ref(function() {
        return new c.Ignore(new c.Or(
            new c.Seq(c.Seq(g.Literal("/*"), c.Any(
                c.Or(c.Not(g.Char("*")), c.Seq(g.Char("*"), l.Look(c.Not(g.Char("/")))))
            )), g.Literal("*/")),
            c.Seq(c.Seq(g.Literal("//"), c.Not(this.NEWLINE())), l.Look(c.Or(this.NEWLINE(), g.End())))
        ));
    }.bind(this));
};

/*
// LITERAL:    (
//                 "\"" ([^"] | "\\\\" | "\\\"")* "\""
//               | '\'' ([^'] | '\\\\' | '\\\'')* '\''
//             ) -> LITERAL;
Grammar.prototype.LITERAL = function() {
    return new g.Ref(function() {
        return new c.Red();
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
    return new g.Ref(function() {
        return new c.Red(, SYMBOL);
    }.bind(this));
};

// RANGE:      CHAR "-" CHAR;
Grammar.prototype.RANGE = function() {
    return new g.Ref(function() {
        return new c.Ignore();
    }.bind(this));
};

// CHAR:       [^\^\-\\] | "\\^" | "\\-" | "\\\\";
Grammar.prototype.CHAR = function() {
    return new g.Ref(function() {
        return new c.Ignore();
    }.bind(this));
};

// CLASS:      "[" (RANGE | CHAR)* ("^" (RANGE | CHAR)+)? "]" -> CLASS;
Grammar.prototype.CLASS = function() {
    return new g.Ref(function() {
        return new c.Red(, CLASS);
    }.bind(this));
};

// KEYWORD:    "grammar" | "start" | "end" | "import" | "from" | "constructor" -> KEYWORD;
Grammar.prototype.KEYWORD = function() {
    return new g.Ref(function() {
        return new c.Red(, KEYWORD);
    }.bind(this));
};
*/

// cons ID;
var ID = exports.ID = function(value, metadata) {
    if(this.constructor === ID) {
        g.Token.apply(this, ['ID', value, metadata]);
        
        return this;
    } else {
        return new ID(value, metadata);
    }
};

ID.prototype = Object.create(g.Token.prototype);
ID.prototype.constructor = ID;

// cons LITERAL;
var LITERAL = exports.LITERAL = function(value, metadata) {
    if(this.constructor === LITERAL) {
        g.Token.apply(this, ['LITERAL', value, metadata]);
        
        return this;
    } else {
        return new LITERAL(value, metadata);
    }
};

LITERAL.prototype = Object.create(g.Token.prototype);
LITERAL.prototype.constructor = LITERAL;

// cons SYMBOL;
var SYMBOL = exports.SYMBOL = function(value, metadata) {
    if(this.constructor === SYMBOL) {
        g.Token.apply(this, ['SYMBOL', value, metadata]);
        
        return this;
    } else {
        return new SYMBOL(value, metadata);
    }
};

SYMBOL.prototype = Object.create(g.Token.prototype);
SYMBOL.prototype.constructor = SYMBOL;

// cons CLASS;
var CLASS = exports.CLASS = function(value, metadata) {
    if(this.constructor === CLASS) {
        g.Token.apply(this, ['CLASS', value, metadata]);
        
        return this;
    } else {
        return new CLASS(value, metadata);
    }
};

CLASS.prototype = Object.create(g.Token.prototype);
CLASS.prototype.constructor = CLASS;

// cons KEYWORD;
var KEYWORD = exports.KEYWORD = function(value, metadata) {
    if(this.constructor === KEYWORD) {
        g.Token.apply(this, ['KEYWORD', value, metadata]);
        
        return this;
    } else {
        return new KEYWORD(value, metadata);
    }
};

KEYWORD.prototype = Object.create(g.Token.prototype);
KEYWORD.prototype.constructor = KEYWORD;
