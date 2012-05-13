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
    Char       = require('../../src/grammar/grammar').Char,
    Category   = require('../../src/grammar/grammar').Category,
    Type       = require('../../src/grammar/grammar').Type,
    Value      = require('../../src/grammar/grammar').Value,
    Default    = require('../../src/grammar/grammar').Default,
    Super      = require('../../src/grammar/grammar').Super,
    Capture    = require('../../src/grammar/grammar').Capture;

require('../../src/grammar/grammar-to-javascript');
require('../../src/grammar/grammar-classes-to-javascript');

exports['test start'] = function(test) {
    test.equals("\
var $ = require('./jsderiv');\n\
\n\
" + Import(["INT", "STRING"], ".common-lib").toJavascript() + "\n\n\
" + Export(Constructor("Statement", "Expression")).toJavascript() + "\n\n\
" + Export(Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))])).toJavascript() + "\n\
", Module(Import(["INT", "STRING"], ".common-lib"), Export(Constructor("Statement", "Expression")), Export(Grammar("Example", [Start(Ref("NEWLINE")), Rule("NEWLINE", Literal("\"\\n\""))]))).toJavascript('./jsderiv'));
    
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
var Statement  = exports.Statement  = $.Node.define(\"Statement\");\n\
var Expression = exports.Expression = $.Node.define(\"Expression\");\
", Export(Constructor("Statement", "Expression")).toJavascript());
    
    test.done();
};

exports['test Constructor'] = function(test) {
    test.equals("\
// " + Constructor("Statement", "Expression").toSource() + "\n\
var Statement  = $.Node.define(\"Statement\");\n\
var Expression = $.Node.define(\"Expression\");\
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
    var startHashCode = Ref("NEWLINE").toSource().hashCode();
    var NEWLINEHashCode = Literal("\"\\n\"").toSource().hashCode();
    
    test.equals("\
// " + Start(Ref("NEWLINE")).toSource() + "\n\
(function() {\n\
    Example.prototype.start = function() {\n\
        return this._start_" + startHashCode + " || (this._start_" + startHashCode + " = $.Ref(function() {\n\
            return this.NEWLINE();\n\
        }.bind(this), 'start'));\n\
    };\n\
})();\
", Start(Ref("NEWLINE")).toJavascript("Example.prototype"));
    test.equals("\
// " + Rule("NEWLINE", Literal("\"\\n\"")).toSource() + "\n\
(function() {\n\
    Example.prototype.NEWLINE = function() {\n\
        return this._NEWLINE_" + NEWLINEHashCode + " || (this._NEWLINE_" + NEWLINEHashCode + " = $.Ref(function() {\n\
            return $.Literal(\"\\n\");\n\
        }.bind(this), 'NEWLINE'));\n\
    };\n\
})();\
", Rule("NEWLINE", Literal("\"\\n\"")).toJavascript("Example.prototype"));
    
    test.done();
};

exports['test Expression'] = function(test) {
    test.equals("$.Seq($.Or(this.r(), this.s()), this.t())", Seq(Or(Ref("r"), Ref("s")), Ref("t")).toJavascript());
    test.equals("$.Or(this.r(), $.Seq(this.s(), this.t()))", Or(Ref("r"), Seq(Ref("s"), Ref("t"))).toJavascript());
    
    test.equals("$.Or($.Or($.Red($.Seq($.Seq($.Ignore($.Literal(\"var\")), $.Capture($.Seq(this.Identifier(), $.Any($.Seq($.Ignore($.Literal(\",\")), this.Identifier()))))), $.Ignore($.Literal(\";\"))), Variable), $.Red($.Seq($.Seq($.Seq($.Seq($.Ignore($.Literal(\"function\")), $.Maybe(this.Identifier())), $.Ignore($.Literal(\"(\"))), $.Many(this.Param())), $.Ignore($.Literal(\")\"))), Call)), $.Red($.Or($.Type(INT), $.And($.Type(STRING), $.Not($.Type(INT)))), Value))", Or(Or(Red(Seq(Seq(Ignore(Literal("\"var\"")), Capture(Seq(Ref("Identifier"), Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))))), Ignore(Literal("\";\""))), "Variable"), Red(Seq(Seq(Seq(Seq(Ignore(Literal("\"function\"")), Maybe(Ref("Identifier"))), Ignore(Literal("\"(\""))), Many(Ref("Param"))), Ignore(Literal("\")\""))), "Call")), Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value")).toJavascript());
    
    test.done();
};

exports['test OrExpr'] = function(test) {
    test.equal("$.Or($.Type(INT), $.And($.Type(STRING), $.Not($.Type(INT))))", Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))).toJavascript());
    
    test.done();
};

exports['test RedExpr'] = function(test) {
    test.equal("$.Red($.Or($.Type(INT), $.And($.Type(STRING), $.Not($.Type(INT)))), Value)", Red(Or(Type("INT"), And(Type("STRING"), Not(Type("INT")))), "Value").toJavascript());
    
    test.done();
};

exports['test AndExpr'] = function(test) {
    test.equal("$.And($.Type(STRING), $.Not($.Type(INT)))", And(Type("STRING"), Not(Type("INT"))).toJavascript());
    
    test.done();
};

exports['test SeqExpr'] = function(test) {
    test.equal("$.Seq($.Ignore($.Literal(\",\")), this.Identifier())", Seq(Ignore(Literal("\",\"")), Ref("Identifier")).toJavascript());
    
    test.done();
};

exports['test RightExpr'] = function(test) {
    test.equal("$.Any($.Seq($.Ignore($.Literal(\",\")), this.Identifier()))", Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier"))).toJavascript());
    test.equal("$.Many(this.Param())", Many(Ref("Param")).toJavascript());
    test.equal("$.Maybe(this.Identifier())", Maybe(Ref("Identifier")).toJavascript());
    test.equal("$.Ignore($.Literal(\"(\"))", Ignore(Literal("\"(\"")).toJavascript());
    
    test.done();
};

exports['test LeftExpr'] = function(test) {
    test.equal("$.Not($.Type(INT))", Not(Type("INT")).toJavascript());
    test.equal("$.Look($.Type(INT))", Look(Type("INT")).toJavascript());
    
    test.done();
};

exports['test Terminal'] = function(test) {
    test.equals("$.Capture(this.id())", Capture(Ref("id")).toJavascript());
    test.equals("$.Type(STRING)", Type("STRING").toJavascript());
    test.equals("$.Value(\"literal\")", Value("\"literal\"").toJavascript());
    test.equals("$.One()", One().toJavascript());
    test.equals("this.id()", Ref("id").toJavascript());
    test.equals("$.Range(\"a\", \"z\")", Class("[a-z]").toJavascript());
    test.equals("$.Literal(\"literal\")", Literal("\"literal\"").toJavascript());
    test.equals("$.Char(\"a\")", Char("'a'").toJavascript());
    test.equals("$.Char(\"\\t\")", Char("'\\t'").toJavascript());
    test.equals("$.Cat(\"w\")", Category("'\\w'").toJavascript());
    test.equals("$default.apply(this, []).resolve()", Default().toJavascript());
    test.equals("Example.$super.prototype.NEWLINE.apply(this, []).resolve()", Super().toJavascript("Example", "NEWLINE"));
    
    test.done();
};

