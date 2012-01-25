var common    = require('../lib/common'),
    lookahead = require('../lib/lookahead'),
    lexer     = require('../lib/lexer');

var Void    = common.Void,
    Null    = common.Null,
    Seq     = common.Seq,
    Any     = common.Any,
    Or      = common.Or,
    And     = common.And,
    Not     = common.Not,
    Red     = common.Red,
    Many    = common.Many,
    Opt     = common.Opt,
    Look    = lookahead.Look,
    Char    = lexer.Char,
    One     = lexer.One,
    No      = lexer.No,
    Literal = lexer.Literal,
    Range   = lexer.Range;

var a = Char("a");
var f = function(x) { return {f: x}; };
var g = function(x) { return {g: x}; };

exports['test "a* -> f"'] = function(test) {
    var expr = Red(Any(a), f);
    
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"])]]);
    
    test.done();
};

exports['test "a* -> f . a* -> g"'] = function(test) {
    var expr = Or(Red(Any(a), f), Red(Any(a), g));
    
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"])], [g(["a"])]]);
    
    test.done();
};

exports['test "(a* . ?!a) -> f . a* -> g"'] = function(test) {
    var r = Look(Not(a));
    var s = Red(Seq(Any(a), r), f);
    var t = Red(Any(a), g);
    
    var expr = Seq(s, t);
    
    // "a* -> g" will not match
    test.ok(!r.isNullable("a"));
    test.ok(!s.isNullable("a"));
    
    // "(a* . ?!a) -> f" will match
    test.deepEqual(s.derive("a").parseNull(), [[f(["a"])]]);
    
    // "a* -> g" resolves to g("")
    test.deepEqual(t.parseNull(), [[g([])]]);
    
    // "?!a" resolves to ""
    test.deepEqual(r.parseNull(), [[]]);
    
    // "(a* . ?!a) -> f" resolves to f("a")
    test.deepEqual(s.derive("a").parseNull(), [[f(["a"])]]);
    
    // "(a* . ?!a) -> f . a* -> g" resolves to f("a") x g("")
    test.deepEqual(expr.derive("a").parseNull(), [[f(["a"]), g([])]]);
    
    test.done();
};
