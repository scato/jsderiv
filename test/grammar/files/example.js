var $ = require('../../../src/jsderiv');

// export constructor Var, Lit;
var Var = exports.Var = $.Node.define("Var");
var Lit = exports.Lit = $.Node.define("Lit");

// export grammar Scannerless;
var Scannerless = exports.Scannerless = function() {};

// Var: "var"! '\s'!* <ID> '\s'!* ("="! '\s'!* Expr '\s'!*)? ";"! -> Var;
(function() {
    exports.Scannerless.prototype.Var = function() {
        return this._Var_8102d6 || (this._Var_8102d6 = $.Ref(function() {
            return $.Red($.Seq($.Seq($.Seq($.Seq($.Seq($.Ignore($.Literal("var")), $.Any($.Ignore($.Cat("s")))), $.Capture(this.ID())), $.Any($.Ignore($.Cat("s")))), $.Maybe($.Seq($.Seq($.Seq($.Ignore($.Literal("=")), $.Any($.Ignore($.Cat("s")))), this.Expr()), $.Any($.Ignore($.Cat("s")))))), $.Ignore($.Literal(";"))), Var);
        }.bind(this), 'Var'));
    };
})();

// Expr: Lit;
(function() {
    exports.Scannerless.prototype.Expr = function() {
        return this._Expr_12a77 || (this._Expr_12a77 = $.Ref(function() {
            return this.Lit();
        }.bind(this), 'Expr'));
    };
})();

// Lit: <"'" [a-z]+ "'"> -> Lit;
(function() {
    exports.Scannerless.prototype.Lit = function() {
        return this._Lit_66eb69c7 || (this._Lit_66eb69c7 = $.Ref(function() {
            return $.Red($.Capture($.Seq($.Seq($.Literal("'"), $.Many($.Range("a", "z"))), $.Literal("'"))), Lit);
        }.bind(this), 'Lit'));
    };
})();

// ID: '\w'+ & ~ KEYWORD;
(function() {
    exports.Scannerless.prototype.ID = function() {
        return this._ID_218101f3 || (this._ID_218101f3 = $.Ref(function() {
            return $.And($.Many($.Cat("w")), $.Not(this.KEYWORD()));
        }.bind(this), 'ID'));
    };
})();

// KEYWORD: "var";
(function() {
    exports.Scannerless.prototype.KEYWORD = function() {
        return this._KEYWORD_2163cfd || (this._KEYWORD_2163cfd = $.Ref(function() {
            return $.Literal("var");
        }.bind(this), 'KEYWORD'));
    };
})();
