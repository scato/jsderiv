var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// export constructor Grammar, LexicalRule, SyntacticRule, StringRule;
var Grammar       = exports.Grammar       = g.Cons("Grammar");
var LexicalRule   = exports.LexicalRule   = g.Cons("LexicalRule");
var SyntacticRule = exports.SyntacticRule = g.Cons("SyntacticRule");
var StringRule    = exports.StringRule    = g.Cons("StringRule");

// export constructor Alt, Seq, Opt, NonInsertSeq, LookNot, Id, Lit, Ref, Empty, ButNot, ExclOr, Set, OneOf, Strict;
var Alt          = exports.Alt          = g.Cons("Alt");
var Seq          = exports.Seq          = g.Cons("Seq");
var Opt          = exports.Opt          = g.Cons("Opt");
var NonInsertSeq = exports.NonInsertSeq = g.Cons("NonInsertSeq");
var LookNot      = exports.LookNot      = g.Cons("LookNot");
var Id           = exports.Id           = g.Cons("Id");
var Lit          = exports.Lit          = g.Cons("Lit");
var Ref          = exports.Ref          = g.Cons("Ref");
var Empty        = exports.Empty        = g.Cons("Empty");
var ButNot       = exports.ButNot       = g.Cons("ButNot");
var ExclOr       = exports.ExclOr       = g.Cons("ExclOr");
var Set          = exports.Set          = g.Cons("Set");
var OneOf        = exports.OneOf        = g.Cons("OneOf");
var Strict       = exports.Strict       = g.Cons("Strict");

// export grammar ECMA;
var ECMA = exports.ECMA = function() {};

// start NEWLINE* (Rule NEWLINE*)* -> Grammar;
(function() {
    var $cache;
    
    exports.ECMA.prototype.start = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Any(this.NEWLINE()), c.Any(c.Seq(this.Rule(), c.Any(this.NEWLINE())))), Grammar);
        }.bind(this), 'start'));
    };
})();

// NEWLINE: ("\n" | "\r\n")!;
(function() {
    var $cache;
    
    exports.ECMA.prototype.NEWLINE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(c.Or(g.Literal("\n"), g.Literal("\r\n")));
        }.bind(this), 'NEWLINE'));
    };
})();

// COMMENT: ("/*" ~ (.* "*/" .*) "*/")!;
(function() {
    var $cache;
    
    exports.ECMA.prototype.COMMENT = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(c.Seq(c.Seq(g.Literal("/*"), c.Not(c.Seq(c.Seq(c.Any(g.One()), g.Literal("*/")), c.Any(g.One())))), g.Literal("*/")));
        }.bind(this), 'COMMENT'));
    };
})();

// SPACE: " "!;
(function() {
    var $cache;
    
    exports.ECMA.prototype.SPACE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Ignore(g.Literal(" "));
        }.bind(this), 'SPACE'));
    };
})();

// Rule: (COMMENT NEWLINE*)? (LexicalRule | SyntacticRule | StringRule);
(function() {
    var $cache;
    
    exports.ECMA.prototype.Rule = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Maybe(c.Seq(this.COMMENT(), c.Any(this.NEWLINE()))), c.Or(c.Or(this.LexicalRule(), this.SyntacticRule()), this.StringRule()));
        }.bind(this), 'Rule'));
    };
})();

// LexicalRule: REFERENCE SPACE "::"! Expression -> LexicalRule;
(function() {
    var $cache;
    
    exports.ECMA.prototype.LexicalRule = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(this.REFERENCE(), this.SPACE()), c.Ignore(g.Literal("::"))), this.Expression()), LexicalRule);
        }.bind(this), 'LexicalRule'));
    };
})();

// SyntacticRule: REFERENCE SPACE ":"! Expression -> SyntacticRule;
(function() {
    var $cache;
    
    exports.ECMA.prototype.SyntacticRule = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(this.REFERENCE(), this.SPACE()), c.Ignore(g.Literal(":"))), this.Expression()), SyntacticRule);
        }.bind(this), 'SyntacticRule'));
    };
})();

// StringRule: REFERENCE SPACE ":::"! Expression -> StringRule;
(function() {
    var $cache;
    
    exports.ECMA.prototype.StringRule = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(this.REFERENCE(), this.SPACE()), c.Ignore(g.Literal(":::"))), this.Expression()), StringRule);
        }.bind(this), 'StringRule'));
    };
})();

// REFERENCE: "<"! [^>]* ">"! -> Text;
(function() {
    var $cache;
    
    exports.ECMA.prototype.REFERENCE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("<")), c.Any(c.And(g.One(), c.Not(g.Char(">"))))), c.Ignore(g.Literal(">"))), Text);
        }.bind(this), 'REFERENCE'));
    };
})();

// IDENTIFIER: [A-Za-z]+ -> Text;
(function() {
    var $cache;
    
    exports.ECMA.prototype.IDENTIFIER = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Many(c.Or(g.Range("A", "Z"), g.Range("a", "z"))), Text);
        }.bind(this), 'IDENTIFIER'));
    };
})();

// LITERAL: "\"" ([^"\\] | "\\\\" | "\\\"" | "\\t" | "\\r" | "\\n")* "\"" -> Text;
(function() {
    var $cache;
    
    exports.ECMA.prototype.LITERAL = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(g.Literal("\""), c.Any(c.Or(c.Or(c.Or(c.Or(c.Or(c.And(g.One(), c.Not(c.Or(g.Char("\""), g.Char("\\")))), g.Literal("\\\\")), g.Literal("\\\"")), g.Literal("\\t")), g.Literal("\\r")), g.Literal("\\n")))), g.Literal("\"")), Text);
        }.bind(this), 'LITERAL'));
    };
})();

// INLINE: [{\^a-z]+ -> Text;
(function() {
    var $cache;
    
    exports.ECMA.prototype.INLINE = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Many(c.Or(c.Or(g.Char("{"), g.Char("^")), g.Range("a", "z"))), Text);
        }.bind(this), 'INLINE'));
    };
})();

// Expression: AltExpr+ -> Alt | OneOfExpr | ButNotAnyOfExpr;
(function() {
    var $cache;
    
    exports.ECMA.prototype.Expression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Red(c.Many(this.AltExpr()), Alt), this.OneOfExpr()), this.ButNotAnyOfExpr());
        }.bind(this), 'Expression'));
    };
})();

// AltExpr: NEWLINE SPACE+ (SeqExpr | ButNotExpr);
(function() {
    var $cache;
    
    exports.ECMA.prototype.AltExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(this.NEWLINE(), c.Many(this.SPACE())), c.Or(this.SeqExpr(), this.ButNotExpr()));
        }.bind(this), 'AltExpr'));
    };
})();

// SeqExpr: SeqExpr SPACE RightExpr -> Seq | SeqExpr SPACE "[no "! ExclExpr " here]"! SPACE RightExpr -> NonInsertSeq | RightExpr;
(function() {
    var $cache;
    
    exports.ECMA.prototype.SeqExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Red(c.Seq(c.Seq(this.SeqExpr(), this.SPACE()), this.RightExpr()), Seq), c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.SeqExpr(), this.SPACE()), c.Ignore(g.Literal("[no "))), this.ExclExpr()), c.Ignore(g.Literal(" here]"))), this.SPACE()), this.RightExpr()), NonInsertSeq)), this.RightExpr());
        }.bind(this), 'SeqExpr'));
    };
})();

// RightExpr: RightExpr SPACE "[opt]"! -> Opt | Terminal;
(function() {
    var $cache;
    
    exports.ECMA.prototype.RightExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Red(c.Seq(c.Seq(this.RightExpr(), this.SPACE()), c.Ignore(g.Literal("[opt]"))), Opt), this.Terminal());
        }.bind(this), 'RightExpr'));
    };
})();

// Terminal: REFERENCE -> Ref | LITERAL -> Lit | "[lookahead not in "! ExclExpr "]"! -> LookNot | "[empty]"! -> Empty | "{"! INLINE (", "! INLINE)* "}"! -> Set;
(function() {
    var $cache;
    
    exports.ECMA.prototype.Terminal = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Red(this.REFERENCE(), Ref), c.Red(this.LITERAL(), Lit)), c.Red(c.Seq(c.Seq(c.Ignore(g.Literal("[lookahead not in ")), this.ExclExpr()), c.Ignore(g.Literal("]"))), LookNot)), c.Red(c.Ignore(g.Literal("[empty]")), Empty)), c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("{")), this.INLINE()), c.Any(c.Seq(c.Ignore(g.Literal(", ")), this.INLINE()))), c.Ignore(g.Literal("}"))), Set));
        }.bind(this), 'Terminal'));
    };
})();

// ButNotExpr: REFERENCE SPACE ("but not" | "but not one of")! SPACE ExclExpr -> ButNot;
(function() {
    var $cache;
    
    exports.ECMA.prototype.ButNotExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(this.REFERENCE(), this.SPACE()), c.Ignore(c.Or(g.Literal("but not"), g.Literal("but not one of")))), this.SPACE()), this.ExclExpr()), ButNot);
        }.bind(this), 'ButNotExpr'));
    };
})();

// ExclExpr: ExclExpr SPACE "or"! SPACE (COMMENT SPACE)? Terminal -> ExclOr | (COMMENT SPACE)? Terminal | IDENTIFIER -> Id;
(function() {
    var $cache;
    
    exports.ECMA.prototype.ExclExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Seq(this.ExclExpr(), this.SPACE()), c.Ignore(g.Literal("or"))), this.SPACE()), c.Maybe(c.Seq(this.COMMENT(), this.SPACE()))), this.Terminal()), ExclOr), c.Seq(c.Maybe(c.Seq(this.COMMENT(), this.SPACE())), this.Terminal())), c.Red(this.IDENTIFIER(), Id));
        }.bind(this), 'ExclExpr'));
    };
})();

// OneOfExpr: SPACE "one of"! OneOfList;
(function() {
    var $cache;
    
    exports.ECMA.prototype.OneOfExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Seq(this.SPACE(), c.Ignore(g.Literal("one of"))), this.OneOfList());
        }.bind(this), 'OneOfExpr'));
    };
})();

// OneOfList: (NEWLINE SPACE+ LitList)+ (NEWLINE SPACE+ StrictExpr)? -> OneOf;
(function() {
    var $cache;
    
    exports.ECMA.prototype.OneOfList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Many(c.Seq(c.Seq(this.NEWLINE(), c.Many(this.SPACE())), this.LitList())), c.Maybe(c.Seq(c.Seq(this.NEWLINE(), c.Many(this.SPACE())), this.StrictExpr()))), OneOf);
        }.bind(this), 'OneOfList'));
    };
})();

// LitList: ((LITERAL -> Lit) SPACE)* (LITERAL -> Lit);
(function() {
    var $cache;
    
    exports.ECMA.prototype.LitList = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Seq(c.Any(c.Seq(c.Red(this.LITERAL(), Lit), this.SPACE())), c.Red(this.LITERAL(), Lit));
        }.bind(this), 'LitList'));
    };
})();

// StrictExpr: "<or in strict mode code>"! OneOfExpr -> Strict;
(function() {
    var $cache;
    
    exports.ECMA.prototype.StrictExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Ignore(g.Literal("<or in strict mode code>")), this.OneOfExpr()), Strict);
        }.bind(this), 'StrictExpr'));
    };
})();

// ButNotAnyOfExpr: SPACE REFERENCE SPACE "but not any of:"! OneOfList -> ButNot;
(function() {
    var $cache;
    
    exports.ECMA.prototype.ButNotAnyOfExpr = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Seq(this.SPACE(), this.REFERENCE()), this.SPACE()), c.Ignore(g.Literal("but not any of:"))), this.OneOfList()), ButNot);
        }.bind(this), 'ButNotAnyOfExpr'));
    };
})();
