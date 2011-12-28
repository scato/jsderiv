var ebnf = require('./src/ebnf');

var source = "\n\
    Expression: Expression '|' Sequence | Sequence;\n\
    Sequence: Sequence Terminal | Terminal;\n\
    Terminal: ID | LITERAL;\n\
";

var mapper = {
    map: function(token) {
        return this['map' + token.type].apply(this, [token]);
    },
    
    mapGrammar: function(grammar) {
        return grammar.tokens.map(function(token) {
            return this.map(token) + '\n';
        }.bind(this)).join('');
    },
    
    mapParserRule: function(rule) {
        return 'exports["' + rule.tokens[0].value + '"] = Def("' + rule.tokens[0].value + '", ' + this.map(rule.tokens[2]) + ');';
    },
    
    mapExpression: function(expr) {
        if(expr.tokens.length === 1) {
            return expr.tokens[0].toString();
        } else {
            var cons = {
                '|': 'Or'
            }[expr.tokens[1].value];
            
            return cons + '(' + expr.tokens[0].toString() + ', ' + expr.tokens[2].toString() + ')';
        }
    },
    
    mapSequence: function() {
        if(this.tokens.length === 1) {
            return this.tokens[0].toString();
        } else {
            return 'Seq(' + this.tokens[0].toString() + ', ' + this.tokens[1].toString() + ')';
        }
    },
    
    mapTerminal: function() {
        if(this.tokens[0] instanceof ebnf.ID && this.tokens[0].value.match(/^[A-Z]*$/)) {
            return 'Token(' + this.tokens[0].value + ')';
        } else if(this.tokens[0] instanceof ebnf.ID) {
            return 'Ref("' + this.tokens[0].value + '")';
        } else {
            return 'Literal(' + this.tokens[0].value + ')';
        }
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
        console.log(mapper.map(tree));
    });
}

