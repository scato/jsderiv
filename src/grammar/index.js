var lexer   = require('./lexer');
var parser  = require('./parser');
var classes = require('./classes');
var generic = require('../../lib/generic')

require('./lexer-test');
require('./parser-test');

require('./parser-indent');
require('./parser-to-source');
require('./parser-to-javascript');
require('./classes-to-javascript');

require('./parser-test-to-source');
require('./parser-test-to-javascript');

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
    try {
        return generic.parse(new classes.Scannerless().start(), string, true);
    } catch(ex) {
        if(ex.result !== undefined) {
            require('sys').puts('Ambigious grammar, document could mean any of...');
            require('sys').puts(ex.result.join('\n'));
        } else {
            throw ex;
        }
    }
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