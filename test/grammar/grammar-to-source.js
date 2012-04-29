var Module      = require('../../src/grammar/grammar').Module,
    Import      = require('../../src/grammar/grammar').Import,
    Export      = require('../../src/grammar/grammar').Export,
    Constructor = require('../../src/grammar/grammar').Constructor,
    Grammar     = require('../../src/grammar/grammar').Grammar,
    Start       = require('../../src/grammar/grammar').Start,
    Rule        = require('../../src/grammar/grammar').Rule;

var Or         = require('../../src/grammar/grammar').Or,
    Red        = require('../../src/grammar/grammar').Red,
    And        = require('../../src/grammar/grammar').And,
    Seq        = require('../../src/grammar/grammar').Seq,
    Any        = require('../../src/grammar/grammar').Any,
    Many       = require('../../src/grammar/grammar').Many,
    Maybe      = require('../../src/grammar/grammar').Maybe,
    Ignore     = require('../../src/grammar/grammar').Ignore,
    Not        = require('../../src/grammar/grammar').Not,
    Look       = require('../../src/grammar/grammar').Look,
    Token      = require('../../src/grammar/grammar').Token,
    One        = require('../../src/grammar/grammar').One,
    Ref        = require('../../src/grammar/grammar').Ref,
    Class      = require('../../src/grammar/grammar').Class,
    Literal    = require('../../src/grammar/grammar').Literal,
    InstanceOf = require('../../src/grammar/grammar').InstanceOf,
    Default    = require('../../src/grammar/grammar').Default,
    Super      = require('../../src/grammar/grammar').Super,
    Capture    = require('../../src/grammar/grammar').Capture;

require('../../src/grammar/grammar-to-source');

exports['test start'] = function(test) {
    test.equals("\
import {INT, STRING} from .common-lib;\n\
\n\
export constructor Statement, Expression;\n\
\n\
export grammar Example {\n\
    start    NEWLINE;\n\
    NEWLINE: \"\\n\";\n\
}\n\
", Module([Import([["INT", "STRING"], ".common-lib"]), Export([Constructor(["Statement", "Expression"])]), Export([Grammar(["Example", [Start([Ref(["NEWLINE"])]), Rule(["NEWLINE", Literal(["\"\\n\""])])]])])]).toSource());
    
    test.done();
};

exports['test Import'] = function(test) {
    test.equals("import {INT, STRING} from .common-lib;", Import([["INT", "STRING"], ".common-lib"]).toSource());
    
    test.done();
};

exports['test Export'] = function(test) {
    test.equals("export constructor Statement, Expression;", Export([Constructor(["Statement", "Expression"])]).toSource());
    
    test.done();
};

exports['test Constructor'] = function(test) {
    test.equals("constructor Statement, Expression;", Constructor(["Statement", "Expression"]).toSource());
    
    test.done();
};

exports['test Grammar'] = function(test) {
    test.equals("\
grammar Example {\n\
    start    NEWLINE;\n\
    NEWLINE: \"\\n\";\n\
}\
", Grammar(["Example", [Start([Ref(["NEWLINE"])]), Rule(["NEWLINE", Literal(["\"\\n\""])])]]).toSource());
    
    test.done();
};

exports['test Rule'] = function(test) {
    test.equals("start NEWLINE;", Start([Ref(["NEWLINE"])]).toSource());
    test.equals("NEWLINE: \"\\n\";", Rule(["NEWLINE", Literal(["\"\\n\""])]).toSource());
    
    test.done();
};

exports['test Expression'] = function(test) {
    test.equals("(r | s) t", Seq([Or([Ref(["r"]), Ref(["s"])]), Ref(["t"])]).toSource());
    test.equals("r | s t", Or([Ref(["r"]), Seq([Ref(["s"]), Ref(["t"])])]).toSource());
    
    test.equals("\"var\"! <Identifier (\",\"! Identifier)*> \";\"! -> Variable | \"function\"! Identifier? \"(\"! Param+ \")\"! -> Call | (@INT | @STRING & ~ @INT) -> Value", Or([Or([Red([Seq([Seq([Ignore([Literal(["\"var\""])]), Capture([Seq([Ref(["Identifier"]), Any([Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])])])])]), Ignore([Literal(["\";\""])])]), "Variable"]), Red([Seq([Seq([Seq([Seq([Ignore([Literal(["\"function\""])]), Maybe([Ref(["Identifier"])])]), Ignore([Literal(["\"(\""])])]), Many([Ref(["Param"])])]), Ignore([Literal(["\")\""])])]), "Call"])]), Red([Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]), "Value"])]).toSource());
    
    test.done();
};

exports['test OrExpr'] = function(test) {
    test.equal("@INT | @STRING & ~ @INT", Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]).toSource());
    
    test.done();
};

exports['test RedExpr'] = function(test) {
    test.equal("(@INT | @STRING & ~ @INT) -> Value", Red([Or([InstanceOf(["INT"]), And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])])]), "Value"]).toSource());
    
    test.done();
};

exports['test AndExpr'] = function(test) {
    test.equal("@STRING & ~ @INT", And([InstanceOf(["STRING"]), Not([InstanceOf(["INT"])])]).toSource());
    
    test.done();
};

exports['test SeqExpr'] = function(test) {
    test.equal("\",\"! Identifier", Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])]).toSource());
    
    test.done();
};

exports['test RightExpr'] = function(test) {
    test.equal("(\",\"! Identifier)*", Any([Seq([Ignore([Literal(["\",\""])]), Ref(["Identifier"])])]).toSource());
    test.equal("Param+", Many([Ref(["Param"])]).toSource());
    test.equal("Identifier?", Maybe([Ref(["Identifier"])]).toSource());
    test.equal("\"(\"!", Ignore([Literal(["\"(\""])]).toSource());
    
    test.done();
};

exports['test LeftExpr'] = function(test) {
    test.equal("~ @INT", Not([InstanceOf(["INT"])]).toSource());
    test.equal("?= @INT", Look([InstanceOf(["INT"])]).toSource());
    
    test.done();
};

exports['test Terminal'] = function(test) {
    test.equals("<id>", Capture([Ref(["id"])]).toSource());
    test.equals("@STRING", InstanceOf(["STRING"]).toSource());
    test.equals(".", One().toSource());
    test.equals("id", Ref(["id"]).toSource());
    test.equals("[a-z]", Class(["[a-z]"]).toSource());
    test.equals("\"literal\"", Literal(["\"literal\""]).toSource());
    test.equals("default", Default().toSource());
    test.equals("super", Super().toSource());
    
    test.done();
};

