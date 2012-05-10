var c = require('../../../src/jsderivcommon');
var g = require('../../../src/jsderivgeneric');
var l = require('../../../src/jsderivlookahead');

var List = g.List,
    Text = g.Text;

// export constructor Var, Lit;
var Var = exports.Var = g.Cons("Var");
var Lit = exports.Lit = g.Cons("Lit");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// Var: "var"! <ID> ("="! Expr)? ";"! -> Var;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Var = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal("var")), g.Capture(this.ID())), c.Maybe(c.Seq(c.Ignore(g.Literal("=")), this.Expr()))), c.Ignore(g.Literal(";"))), Var);
        }.bind(this), 'Var'));
    };
})();

// Expr: Lit;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Expr = function() {
        return $cache || ($cache = g.Ref(function() {
            return this.Lit();
        }.bind(this), 'Expr'));
    };
})();

// Lit: [a-z]+ & ~ KEYWORD -> Lit;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Lit = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Red(c.And(c.Many(g.Range("a", "z")), c.Not(this.KEYWORD())), Lit);
        }.bind(this), 'Lit'));
    };
})();

// KEYWORD: "var";
(function() {
    var $cache;
    
    exports.Scannerless.prototype.KEYWORD = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Literal("var");
        }.bind(this), 'KEYWORD'));
    };
})();
