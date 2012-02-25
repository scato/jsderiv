var lexer   = require('./jsderiv/lexer');
var parser  = require('./jsderiv/parser');
var generic = require('../lib/generic')

require('./jsderiv/parser-indent');
require('./jsderiv/parser-to-source');
require('./jsderiv/parser-to-javascript');

exports.parse = function(string) {
    var tokens = generic.parse(new lexer.Lexer().start(), string, true);
    
    return generic.parse(new parser.Parser().start(), tokens, true);
};
