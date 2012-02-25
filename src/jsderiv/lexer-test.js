var c = require('../../lib/common');
var g = require('../../lib/generic');
var l = require('../../lib/lookahead');

var List = g.List,
    Text = g.Text;

// import {Lexer, KEYWORD} from .lexer;
var Lexer   = require('./lexer').Lexer,
    KEYWORD = require('./lexer').KEYWORD;

// KEYWORD: default | ("test" | "assert") -> KEYWORD;
(function($default) {
    var $cache;
    
    Lexer.prototype.KEYWORD = function() {
        return $cache = $cache || g.Ref(function() {
            return c.Or($default.apply(this, []), c.Red(c.Or(g.Literal("test"), g.Literal("assert")), KEYWORD));
        }.bind(this), 'KEYWORD');
    };
})(Lexer.prototype.KEYWORD);
