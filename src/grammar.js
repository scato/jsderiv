var deriv = require('../../lib/deriv.js');

var def    = deriv.def,
    ref    = deriv.ref,
    seq    = deriv.seq,
    or     = deriv.or,
    string = deriv.string,
    lt     = deriv.lt,
    look   = deriv.look,
    expr   = deriv.expr,
    cons   = deriv.cons,
    and    = deriv.and,
    not    = deriv.not,
    any    = deriv.any,
    many   = deriv.many,
    red    = deriv.red;

var constructors = {
    "grammar"       : cons('Grammar'),
    "lexicalRule"   : cons('LexicalRule'),
    "syntacticRule" : cons('SyntacticRule')
};

def('SPACE',   expr("\\s"));
def('COMMENT', seq(seq(string("(*"), or(expr("^*"), and(string("*"), look(not(string(")")))))), string("*)")));
def('LAYOUT',  many(or(ref('SPACE'), ref('COMMENT'))));

def('start',         seq(lt(), ref('grammar')));
def('grammar',       red(any(ref('rule')), constructors['grammar']));
def('rule',          or(ref('lexicalRule'), ref('syntacticRule')));
def('lexicalRule',   red(seq(seq(seq(seq(ref('ID'), lt()), string("::")), lt()), ref('expression')), constructors['lexicalRule']));
def('syntacticRule', red(seq(seq(seq(seq(ref('ID'), lt()), string(":")), lt()), ref('expression')), constructors['syntacticRule']));

def('expression', ref('ID'));

exports.parser = ref('start');

