//var jsderiv = require('../grammar/jsderiv'),
var jsderiv = require('./jsderiv'),
    fs      = require('fs'),
    sys     = require('sys');

var source = process.argv[2],
    target = process.argv[3];

sys.puts("Reading " + source + "...");

var input  = fs.readFileSync(source).toString();

sys.puts("Parsing...");

var output = jsderiv.parse(input)[0].toJavascript('../../../lib/');

sys.puts("Writing " + target + "...");

fs.writeFileSync(target, output);

sys.puts("Done.");





//var fs     = require('fs'),
//    sys    = require('sys'),
//    g      = require('../../lib/generic'),
//    Lexer  = require('./lexer').Lexer,
//    Parser = require('./parser').Parser;
//
//exports.tokenize = function(filename) {
//    var string = fs.readFileSync(filename).toString();
//    
//    return g.parse(new Lexer().start(), string, true);
//};
//
//exports.parse = function(filename) {
//    var tokens = exports.tokenize(filename);
//    
//    return g.parse(new Parser().start(), tokens, true);
//};
//
//exports.test = function(filename) {
//    var tokens = exports.tokenize(filename);
//    
//    tokens.forEach(function(token) {
//        sys.puts(token);
//    });
//};
//
//exports.test2 = function(filename) {
//    try {
//        var tree = exports.parse(filename);
//        
//        sys.puts(tree.toString());
//    } catch(error) {
//        sys.puts(error.toString());
//        
//        if(error.result !== undefined) {
//            error.result.forEach(function(tree) {
//                sys.puts(tree);
//            });
//        }
//    }
//};
//
//exports.test2('lang/jsderiv/lexer.g');
//exports.test2('lang/jsderiv/parser.g');
