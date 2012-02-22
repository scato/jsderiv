var lexer = require('./jseriv/lexer.g');
var parser = require('./jseriv/parser.g');

require('./jsderiv/parser-indent');
require('./jsderiv/parser-to-source');
require('./jsderiv/parser-to-javascript');

exports.parse = function(string) {
    var tokens = generic.parse(new lexer.Lexer().start(), string, true);
    
    return generic.parse(new parser.Parser().start(), tokens, true);
};
