var fs     = require('fs'),
    sys    = require('sys'),
    g      = require('../../lib/generic'),
    Lexer  = require('./lexer').Lexer,
    Parser = require('./parser').Parser;

exports.tokenize = function(filename) {
    var string = fs.readFileSync(filename).toString();
    
    return g.parse(new Lexer().start(), string, true);
};

exports.parse = function(filename) {
    var tokens = exports.tokenize(filename);
    
    return g.parse(new Parser().start(), tokens, true);
};

exports.test = function(filename) {
    var tokens = exports.tokenize(filename);
    
    tokens.forEach(function(token) {
        sys.puts(token);
    });
};

exports.test2 = function(filename) {
    try {
        var tree = exports.parse(filename);
        
        sys.puts(tree.toString());
    } catch(error) {
        sys.puts(error.toString());
        
        if(error.result !== undefined) {
            error.result.forEach(function(tree) {
                sys.puts(tree);
            });
        }
    }
};

var parser = require('./parser');

parser.Literal.prototype.indent = false;
parser.Ref.prototype.indent = false;
parser.Class.prototype.indent = false;

parser.Any.prototype.indent = false;
parser.Ignore.prototype.indent = false;
parser.Or.prototype.indent = false;
parser.And.prototype.indent = false;
parser.Not.prototype.indent = false;
parser.Many.prototype.indent = false;
parser.Look.prototype.indent = false;
parser.Seq.prototype.indent = false;
parser.Red.prototype.indent = false;
parser.InstanceOf.prototype.indent = false;

parser.Constructor.prototype.indent = false;
parser.Import.prototype.indent = false;

exports.test2('lang/jsderiv/lexer.g');
exports.test2('lang/jsderiv/parser.g');
