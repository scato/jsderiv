var lexer   = require('./grammar');
var parser  = require('./grammar');
var classes = require('./grammar-classes');
var generic = require('../jsderiv')

require('./grammar-test');

require('./grammar-indent');
require('./grammar-to-source');
require('./grammar-to-javascript');
require('./grammar-classes-to-javascript');

require('./grammar-test-to-source');
require('./grammar-test-to-javascript');

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

exports.parseClass = function(string) {
    return new classes.Scannerless().start().parse(string);
};

var jsderiv = require('./index'),
    fs      = require('fs'),
    sys     = require('sys');

exports.convert = function(source, target, libPath) {
    libPath = libPath || './jsderiv';
    
    sys.puts("Reading " + source + "...");
    
    var input  = fs.readFileSync(source).toString();
    
    sys.puts("Parsing...");
    
    var output = jsderiv.parse(input)[0].toJavascript(libPath);
    
    sys.puts("Writing " + target + "...");
    
    fs.writeFileSync(target, output);
    
    sys.puts("Done.");
};
