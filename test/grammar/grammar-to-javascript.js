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
    Type       = require('../../src/grammar/grammar').Type,
    Value      = require('../../src/grammar/grammar').Value,
    Default    = require('../../src/grammar/grammar').Default,
    Super      = require('../../src/grammar/grammar').Super,
    Capture    = require('../../src/grammar/grammar').Capture;

require('../../src/grammar/grammar-to-javascript');
require('../../src/grammar/grammar-classes-to-javascript');

exports['test start'] = function(test) {
    test.equals("\
var c = require('./common');\n\
var g = require('./generic');\n\
var l = require('./lookahead');\n\
\n\
var List = g.List,\n\
    Text = g.Text;\n\
\n\
" + Import(["INT", "STRING"], ".common-lib").toJavascript() + "\n\n\
" + Export(Constructor("Statement", "Expression")).toJavascript() + "\n\n\
" + Export(Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))])).toJavascript() + "\n\
", Module(Import(["INT", "STRING"], ".common-lib"), Export(Constructor("Statement", "Expression")), Export(Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))]))).toJavascript('./'));
    
    test.done();
};

exports['test Import'] = function(test) {
    test.equals("\
// " + Import(["INT", "STRING"], ".common-lib").toSource() + "\n\
var INT    = require(\"./common-lib\").INT,\n\
    STRING = require(\"./common-lib\").STRING;\
", Import(["INT", "STRING"], ".common-lib").toJavascript());
    
    test.done();
};

exports['test Export'] = function(test) {
    test.equals("\
// " + Export(Constructor("Statement", "Expression")).toSource() + "\n\
var Statement  = exports.Statement  = g.Cons(\"Statement\");\n\
var Expression = exports.Expression = g.Cons(\"Expression\");\
", Export(Constructor("Statement", "Expression")).toJavascript());
    
    test.done();
};

exports['test Constructor'] = function(test) {
    test.equals("\
// " + Constructor("Statement", "Expression").toSource() + "\n\
var Statement  = g.Cons(\"Statement\");\n\
var Expression = g.Cons(\"Expression\");\
", Constructor("Statement", "Expression").toJavascript());
    
    test.done();
};

exports['test Grammar'] = function(test) {
    test.equals("\
var Example = function() {};\n\
\n\
" + Start(Ref("NEWLINE")).toJavascript("Example.prototype") + "\n\
\n\
" + Rule("NEWLINE", Literal("\"\\n\"")).toJavascript("Example.prototype") + "\
", Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))]).toJavascript());
    
    test.done();
};

exports['test Rule'] = function(test) {
    test.equals("\
// " + Start(Ref("NEWLINE")).toSource() + "\n\
(function() {\n\
    var $cache;\n\
    \n\
    Example.prototype.start = function() {\n\
        return $cache || ($cache = g.Ref(function() {\n\
            return this.NEWLINE();\n\
        }.bind(this), 'start'));\n\
    };\n\
})();\
", Start(Ref("NEWLINE")).toJavascript("Example.prototype"));
    test.equals("\
// " + Rule("NEWLINE", Literal("\"\\n\"")).toSource() + "\n\
(function() {\n\
    var $cache;\n\
    \n\
    Example.prototype.NEWLINE = function() {\n\
        return $cache || ($cache = g.Ref(function() {\n\
            return g.Literal(\"\\n\");\n\
        }.bind(this), 'NEWLINE'));\n\
    };\n\
})();\
", Rule("NEWLINE", Literal("\"\\n\"")).toJavascript("Example.prototype"));
    
    test.done();
};

exports['test Expression'] = function(test) {
    test.equals("c.Seq(c.Or(this.r(), this.s()), this.t())", Seq(Or(Ref("r"), Ref("s")), Ref("t")).toJavascript());
    test.equals("c.Or(this.r(), c.Seq(this.s(), this.t()))", Or(Ref("r"), Seq(Ref("s"), Ref("t"))).toJavascript());
    
    test.equals("c.Or(c.Or(c.Red(c.Seq(c.Seq(c.Ignore(g.Literal(\"var\")), g.Capture(c.Seq(this.Identifier(), c.Any(c.Seq(c.Ignore(g.Literal(\",\")), this.Identifier()))))), c.Ignore(g.Literal(\";\"))), Variable), c.Red(c.Seq(c.Seq(c.Seq(c.Seq(c.Ignore(g.Literal(\"function\")), c.Maybe(this.Identifier())), c.Ignore(g.Literal(\"(\"))), c.Many(this.Param())), c.Ignore(g.Literal(\")\"))), Call)), c.Red(c.Or(g.Type(INT), c.And(g.Type(STRING), c.Not(g.Type(INT)))), Value))", Or(Or(Red(Seq(Seq(Ignore(Literal("\"var\"")), Capture(Seq(Ref("Identifier"), Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))))), Ignore(Literal("\";\""))), "Variable"), Red(Seq(Seq(Seq(Seq(Ignore(Literal("\"function\"")), Maybe(Ref("Identifier"))), Ignore(Literal("\"(\""))), Many(Ref("Param"))), Ignore(Literal("\")\""))), "Call")), Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value")).toJavascript());
    
    test.done();
};

exports['test OrExpr'] = function(test) {
    test.equal("c.Or(g.Type(INT), c.And(g.Type(STRING), c.Not(g.Type(INT))))", Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))).toJavascript());
    
    test.done();
};

exports['test RedExpr'] = function(test) {
    test.equal("c.Red(c.Or(g.Type(INT), c.And(g.Type(STRING), c.Not(g.Type(INT)))), Value)", Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value").toJavascript());
    
    test.done();
};

exports['test AndExpr'] = function(test) {
    test.equal("c.And(g.Type(STRING), c.Not(g.Type(INT)))", And(Type("STRING"), Not(Type("INT"))).toJavascript());
    
    test.done();
};

exports['test SeqExpr'] = function(test) {
    test.equal("c.Seq(c.Ignore(g.Literal(\",\")), this.Identifier())", Seq(Ignore(Literal("\",\"")), Ref("Identifier")).toJavascript());
    
    test.done();
};

exports['test RightExpr'] = function(test) {
    test.equal("c.Any(c.Seq(c.Ignore(g.Literal(\",\")), this.Identifier()))", Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier"))).toJavascript());
    test.equal("c.Many(this.Param())", Many(Ref("Param")).toJavascript());
    test.equal("c.Maybe(this.Identifier())", Maybe(Ref("Identifier")).toJavascript());
    test.equal("c.Ignore(g.Literal(\"(\"))", Ignore(Literal("\"(\"")).toJavascript());
    
    test.done();
};

exports['test LeftExpr'] = function(test) {
    test.equal("c.Not(g.Type(INT))", Not(Type("INT")).toJavascript());
    test.equal("l.Look(g.Type(INT))", Look(Type("INT")).toJavascript());
    
    test.done();
};

exports['test Terminal'] = function(test) {
    test.equals("g.Capture(this.id())", Capture(Ref("id")).toJavascript());
    test.equals("g.Type(STRING)", Type("STRING").toJavascript());
    test.equals("g.Value(\"literal\")", Value("\"literal\"").toJavascript());
    test.equals("g.One()", One().toJavascript());
    test.equals("this.id()", Ref("id").toJavascript());
    test.equals("g.Range(\"a\", \"z\")", Class("[a-z]").toJavascript());
    test.equals("g.Literal(\"literal\")", Literal("\"literal\"").toJavascript());
    test.equals("$default.apply(this, []).func()", Default().toJavascript());
    test.equals("Example.$super.prototype.NEWLINE.apply(this, []).func()", Super().toJavascript("Example", "NEWLINE"));
    
    test.done();
};

