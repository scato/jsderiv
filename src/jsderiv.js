var lexer   = require('./jsderiv/lexer');
var parser  = require('./jsderiv/parser');
var generic = require('../lib/generic')

require('./jsderiv/lexer-test');
require('./jsderiv/parser-test');

require('./jsderiv/parser-indent');
require('./jsderiv/parser-to-source');
require('./jsderiv/parser-to-javascript');

require('./jsderiv/parser-test-to-source');
require('./jsderiv/parser-test-to-javascript');

exports.parse = function(string) {
    try {
        var tokens = generic.parse(new lexer.Lexer().start(), string, true);
        
        return generic.parse(new parser.Parser().start(), tokens, true);
    } catch(ex) {
        if(ex.result !== undefined) {
            require('sys').puts('Ambigious grammar, document could mean any of...');
            require('sys').puts(ex.result.join('\n'));
        } else {
            throw ex;
        }
    }
};
