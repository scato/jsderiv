var ebnf = require('./src/ebnf');

var source = "\n\
    Expression: Expression '|' Sequence | Sequence;\n\
    Sequence: Sequence Terminal | Terminal;\n\
    Terminal: ID | LITERAL;\n\
";

ebnf.Grammar.prototype.toString = function() {
    return this.tokens.map(function(token) {
        return token.toString() + '\n';
    }).join('');
};

ebnf.ParserRule.prototype.toString = function() {
    return 'exports["' + this.tokens[0].value + '"] = Def("' + this.tokens[0].value + '", ' + this.tokens[2].toString() + ');';
};

ebnf.Expression.prototype.toString = function() {
    if(this.tokens.length === 1) {
        return this.tokens[0].toString();
    } else {
        var cons = {
            '|': 'Or'
        }[this.tokens[1].value];
        
        return cons + '(' + this.tokens[0].toString() + ', ' + this.tokens[2].toString() + ')';
    }
};

ebnf.Sequence.prototype.toString = function() {
    if(this.tokens.length === 1) {
        return this.tokens[0].toString();
    } else {
        return 'Seq(' + this.tokens[0].toString() + ', ' + this.tokens[1].toString() + ')';
    }
};

ebnf.Terminal.prototype.toString = function() {
    if(this.tokens[0] instanceof ebnf.ID && this.tokens[0].value.match(/^[A-Z]*$/)) {
        return 'Token(' + this.tokens[0].value + ')';
    } else if(this.tokens[0] instanceof ebnf.ID) {
        return 'Ref("' + this.tokens[0].value + '")';
    } else {
        return 'Literal(' + this.tokens[0].value + ')';
    }
};

var stream = ebnf.tokenize(source).exclude(ebnf.LAYOUT);

if(stream instanceof Array) {
    console.log('ambiguous...');
    stream.forEach(function(stream) {
        console.log(stream.toString());
    });
} else {
    console.log(stream.toString());
    
    var forest = ebnf.parse(stream);
    
    forest.forEach(function(tree) {
        console.log(tree.toString());
    });
}

