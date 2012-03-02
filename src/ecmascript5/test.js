var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// export grammar Lexical;
var Lexical = exports.Lexical = function() {};

// WhiteSpace: "\t" | "\v" | "\f" | " " | "\u00a0" | "\ufeff" | [\s^\t\n\r\v\f \u00a0\u2028\u2029];
(function() {
    var $cache;
    
    exports.Lexical.prototype.WhiteSpace = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Literal("\t"), g.Literal("\v")), g.Literal("\f")), g.Literal(" ")), g.Literal("\u00a0")), g.Literal("\ufeff")), c.And(g.Category("\\s"), c.Not(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(c.Or(g.Char("\\t"), g.Char("\\n")), g.Char("\\r")), g.Char("\\v")), g.Char("\\f")), g.Char(" ")), g.Char("\\u00a0")), g.Char("\\u2028")), g.Char("\\u2029")))));
        }.bind(this), 'WhiteSpace'));
    };
})();

// UnicodeLetter: [\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nl}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeLetter = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(c.Or(c.Or(c.Or(c.Or(g.Category("\\p{Lu}"), g.Category("\\p{Ll}")), g.Category("\\p{Lt}")), g.Category("\\p{Lm}")), g.Category("\\p{Lo}")), g.Category("\\p{Nl}"));
        }.bind(this), 'UnicodeLetter'));
    };
})();

// UnicodeCombiningMark: [\p{Mn}\p{Mc}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeCombiningMark = function() {
        return $cache || ($cache = g.Ref(function() {
            return c.Or(g.Category("\\p{Mn}"), g.Category("\\p{Mc}"));
        }.bind(this), 'UnicodeCombiningMark'));
    };
})();

// UnicodeDigit: [\p{Nd}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeDigit = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Category("\\p{Nd}");
        }.bind(this), 'UnicodeDigit'));
    };
})();

// UnicodeConnectorPunctuation: [\p{Pc}];
(function() {
    var $cache;
    
    exports.Lexical.prototype.UnicodeConnectorPunctuation = function() {
        return $cache || ($cache = g.Ref(function() {
            return g.Category("\\p{Pc}");
        }.bind(this), 'UnicodeConnectorPunctuation'));
    };
})();

// export grammar Syntactic;
var Syntactic = exports.Syntactic = function() {};



// export grammar String;
var String = exports.String = function() {};


