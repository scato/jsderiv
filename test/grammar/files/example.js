var $ = require('../../../src/jsderiv');

// export constructor Var, Lit;
var Var = exports.Var = $.Node.define("Var");
var Lit = exports.Lit = $.Node.define("Lit");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// Var: "var"! '\s'!* <ID> '\s'!* ("="! '\s'!* Expr '\s'!*)? ";"! -> Var;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Var = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Literal("var")), $.Any($.Ignore($.Cat("s")))), $.Capture(this.ID())), $.Any($.Ignore($.Cat("s")))), $.Maybe($.Seq($.Seq($.Seq($.Ignore($.Literal("=")), $.Any($.Ignore($.Cat("s")))), this.Expr()), $.Any($.Ignore($.Cat("s")))))), $.Ignore($.Literal(";"))), Var);
        }.bind(this), 'Var'));
    };
})();

// Expr: Lit;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Expr = function() {
        return $cache || ($cache = $.Ref(function() {
            return this.Lit();
        }.bind(this), 'Expr'));
    };
})();

// Lit: <"'" [a-z]+ "'"> -> Lit;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.Lit = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Literal("'"), $.Many($.Range("a", "z"))), $.Literal("'"))), Lit);
        }.bind(this), 'Lit'));
    };
})();

// ID: '\w'+ & ~ KEYWORD;
(function() {
    var $cache;
    
    exports.Scannerless.prototype.ID = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.And($.Many($.Cat("w")), $.Not(this.KEYWORD()));
        }.bind(this), 'ID'));
    };
})();

// KEYWORD: "var";
(function() {
    var $cache;
    
    exports.Scannerless.prototype.KEYWORD = function() {
        return $cache || ($cache = $.Ref(function() {
            return $.Literal("var");
        }.bind(this), 'KEYWORD'));
    };
})();
