var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {Lexical, Syntactic} from ..ecmascript5.ecmascript5;
var Lexical   = require("./../ecmascript5/ecmascript5").Lexical,
    Syntactic = require("./../ecmascript5/ecmascript5").Syntactic;

// import {LogicalORExpression} from ..ecmascript5.ecmascript5;
var LogicalORExpression = require("./../ecmascript5/ecmascript5").LogicalORExpression;

// Punctuator: default | "?:";
(function($default) {
    var $cache;
    
    Lexical.prototype.Punctuator = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or($default.apply(this, []).func(), g.Literal("?:"));
        }.bind(this), 'Punctuator'));
    };
})(Lexical.prototype.Punctuator);

// LogicalORExpression: default | LogicalORExpression <LineTerminator>*! ("?:" -> Text) <LineTerminator>*! LogicalANDExpression -> LogicalORExpression;
(function($default) {
    var $cache;
    
    Syntactic.prototype.LogicalORExpression = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or($default.apply(this, []).func(), c.Red(c.Seq(c.Seq(c.Seq(c.Seq(this.LogicalORExpression(), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), c.Red(g.Literal("?:"), Text)), c.Ignore(c.Any(g.Capture(this.LineTerminator())))), this.LogicalANDExpression()), LogicalORExpression));
        }.bind(this), 'LogicalORExpression'));
    };
})(Syntactic.prototype.LogicalORExpression);
