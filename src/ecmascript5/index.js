var ecmascript5 = require('./ecmascript5');
var generic     = require('../../lib/generic');
var common      = require('../../lib/common');

require('./ecmascript5-to-ast');

var sys = require('sys');

var Void = common.Void;

exports.parse = function(string) {
    var tokens = [];
    var lexer = new ecmascript5.Lexical();
    var parser = new ecmascript5.Syntactic();
    var expr = parser.start();
    
    sys.puts('start: ' + expr);
    
    while(string !== "") {
        var token = undefined;
        var next;
        
        if(!expr.derive(["/"]).equals(Void()) || !expr.derive(["/="]).equals(Void())) {
            next = lexer.InputElementDiv();
            sys.puts('next: InputElementDiv');
        } else {
            next = lexer.InputElementRegExp();
            sys.puts('next: InputElementRegExp');
        }
        
        for(var i = 1; i <= string.length; i++) {
            var input = generic.parse(next, string.substr(0, i));
            
            if(input.length === 1) {
                token = input[0];
            } else if(token !== undefined) {
                break;
            }
        }
        
        if(token === undefined) {
            throw new Error('parse error, unexpected character ' + JSON.stringify(string[0]));
        } else {
            string = string.substr(token.length);
        }
        
        sys.puts('token: ' + JSON.stringify(token.join('')));
        
        if(generic.match(lexer.Token(), token) || generic.match(lexer.DivPunctuator(), token) || generic.match(lexer.LineTerminator(), token)) {
            expr = expr.derive(token);
        } else {
            sys.puts('[ignore]');
        }
        
        if(expr.equals(Void())) {
            throw new Error('parse error, unexpected token ' + JSON.stringify(token.join('')));
        }
        
        sys.puts('');
        sys.puts('continue: ' + expr);
    }
    
    var result = expr.parseNull();
    
    return result;
};

// debug
//var result = exports.parse("\
//var ecmascript5 = require('./ecmascript5', 2);\r\n\
//var ecmascript5 = new Test();\r\n\
//var a, b = a++;\
//a = ~!1 % 2 ^ 3 & 4 && 5 * (6 - 7 + 8[9] ? 10 : 11 | 12 || 13 / 14 <= b.x), 15;\
//");
//sys.puts(result[0][0].toAST());
