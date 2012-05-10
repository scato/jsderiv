var grammar  = require('./grammar');
var classes = require('./grammar-classes');
var generic = require('../jsderiv')

var Void = require('../jsderiv').Void;

require('./grammar-test');

require('./grammar-indent');
require('./grammar-to-source');
require('./grammar-to-javascript');
require('./grammar-classes-to-javascript');

require('./grammar-test-to-source');
require('./grammar-test-to-javascript');

exports.tokenize = function(string) {
    var expr = new grammar.Lexer().start();
    
    for(var i = 0; i < string.length; i++) {
        expr = expr.derive(string[i]);
        
        if(expr.equals(Void())) {
            throw new Error('Parse error: unexpected character ' + JSON.stringify(string[i]));
        }
    }
    
    var result = expr.parseNull();
    
    if(result.length === 0) {
        throw new Error('Parse error: unexpected end of file');
    } else if(result.length === 1) {
        return result[0];
    } else {
        throw new Error('Parse error: ambigious input; could mean one of (\n\t' + result.join(',\n\t') + ')');
    }
};

exports.parse = function(string) {
    var tokens = exports.tokenize(string);
    var expr = new grammar.Parser().start();
    
    for(var i = 0; i < tokens.length; i++) {
        expr = expr.derive(tokens[i]);
        
        if(expr.equals(Void())) {
            throw new Error('Parse error: unexpected token ' + tokens[i].toString());
        }
    }
    
    var result = expr.parseNull();
    
    if(result.length === 0) {
        throw new Error('Parse error: unexpected end of file');
    } else if(result.length === 1) {
        return result[0];
    } else {
        throw new Error('Parse error: ambigious input; could mean one of (' + result.join(', ') + ')');
    }
};

exports.parseClass = function(string) {
    return new classes.Scannerless().start().parse(string);
};

var fs      = require('fs'),
    sys     = require('sys');

exports.convert = function(source, target, libPath) {
    libPath = libPath || './jsderiv';
    
    sys.puts("Reading " + source + "...");
    
    var input  = fs.readFileSync(source).toString();
    
    sys.puts("Parsing...");
    
    var output = exports.parse(input)[0].toJavascript(libPath);
    
    sys.puts("Writing " + target + "...");
    
    fs.writeFileSync(target, output);
    
    sys.puts("Done.");
};
