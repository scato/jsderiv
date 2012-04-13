var Char    = require('../../src/jsderiv').Char,
    One     = require('../../src/jsderiv').One,
    Any     = require('../../src/jsderiv').Any,
    Red     = require('../../src/jsderiv').Red,
    Capture = require('../../src/jsderiv').Capture,
    Defer   = require('../../src/jsderiv').Defer;

function lower(string) {
    return string.toLowerCase();
}

function upper(string) {
    return string.toUpperCase();
}

exports['test Red'] = function(test) {
    // r -> upper renders as "Red(Char("r"))"
    test.equals('Red(Char("r"), [Function])', Red(Char('r'), upper).toString());
    
    // parsing "rrr" with <r*> -> upper yields "RRR"
    test.deepEqual(Red(Capture(Any(Char('r'))), upper).parse("rrr"), ["RRR"]);
    
    test.done();
};

exports['test Capture'] = function(test) {
    // <r> upper renders as "Capture(Char("r"))"
    test.equals('Capture(Char("r"))', Capture(Char('r')).toString());
    
    // parsing "rrr" with <r*> yields ("rrr")
    test.deepEqual(Capture(Any(Char('r'))).parse('rrr'), [["rrr"]]);
    
    // parsing "rrr" with <r>* yields ("r", "r", "r")
    test.deepEqual(Any(Capture(Char('r'))).parse('rrr'), [["r", "r", "r"]]);
    
    // parsing "rrr" with <<r>*> yields (("r", "r", "r"))
    test.deepEqual(Capture(Any(Capture(Char('r')))).parse('rrr'), [[["r", "r", "r"]]]);
    
    test.done();
};

exports['test Defer'] = function(test) {
    // r &> s renders as "Defer(Char("r"), Char("s"))"
    test.equals('Defer(Char("r"), Char("s"))', Defer(Char('r'), Char('s')).toString());
    
    // parsing "rrr" with <r*> &> (<.*> -> upper) yields "RRR"
    test.deepEqual(Defer(Capture(Any(Char('r'))), Red(Capture(Any(One())), upper)).parse("rrr"), ["RRR"]);
    
    test.done();
};

