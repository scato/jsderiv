var lexer   = require('./lexer'),
    parser  = require('./parser'),
    generic = require('../../lib/generic');

exports.parse = function(string) {
    var tokens = generic.parse(new lexer.Lexer().start(), string, true);
    
    return generic.parse(new parser.Parser().start(), tokens, true);
};


require('./parser-indent');
require('./parser-to-source');
require('./parser-to-javascript');
