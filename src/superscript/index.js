require('./superscript');

var ecmascript5 = require('../ecmascript5');

var sys = require('sys');

exports.parse = function(string) {
    return ecmascript5.parse(string);
};

// debug
var result = exports.parse("\
var a = b || c;\r\n\
var e = f ?: g;\r\n\
");
sys.puts(result[0][0].toAST());
