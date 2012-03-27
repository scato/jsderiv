var ecma = require('./ecma');

ecma.Grammar.prototype.toJsderiv = function(strict) {
    var lexicalRules = this.value.filter(function(rule) {
            return rule instanceof ecma.LexicalRule && !rule.value[0].match(/^JSON/);
        });
    
    var syntacticRules = this.value.filter(function(rule) {
            return rule instanceof ecma.SyntacticRule && !rule.value[0].match(/^JSON/);
        });
    
    var jsonRules = this.value.filter(function(rule) {
            return rule instanceof ecma.LexicalRule && rule.value[0].match(/^JSON/)
                || rule instanceof ecma.SyntacticRule && rule.value[0].match(/^JSON/);
        });
    
    var stringRules = this.value.filter(function(rule) {
            return rule instanceof ecma.StringRule;
        });
    
    var capture = this.value.filter(function(rule) {
            return rule instanceof ecma.LexicalRule;
        }).map(function(rule) {
            return rule.value[0];
        });
    
    var constructors = 'export constructor ' + this.value.filter(function(rule) {
            return rule instanceof ecma.SyntacticRule;
        }).map(function(rule) {
            return rule.value[0];
        }).join(', ') + ';';
    
    var lexicalGrammar = 'export grammar Lexical {\n' +
        lexicalRules.map(function(rule) {
            return '    ' + rule.toJsderiv(strict) + '\n';
        }).join('') + '}';
    
    var syntacticGrammar = 'export grammar Syntactic extends Lexical {\n' +
        '    start <LineTerminator>*! Program <LineTerminator>*!;\n\n' +
        syntacticRules.map(function(rule) {
            return '    ' + rule.toJsderiv(strict, '<LineTerminator>', capture, true) + '\n';
        }).join('') + '}';
    
    var jsonGrammar = 'export grammar JSON {\n' +
        jsonRules.map(function(rule) {
            if(rule instanceof ecma.LexicalRule) {
                return '    ' + rule.toJsderiv(strict) + '\n';
            } else {
                return '    ' + rule.toJsderiv(strict, '<JSONWhiteSpace>', capture, true) + '\n';
            }
        }).join('') + '}';
    
    var stringGrammar = 'export grammar String {\n' +
        stringRules.map(function(rule) {
            return '    ' + rule.toJsderiv(strict) + '\n';
        }).join('') + '}';
    
//    return lexicalGrammar + '\n\n' + syntacticGrammar + '\n\n' + jsonGrammar + '\n\n' + stringGrammar + '\n';
    return constructors + '\n\n' + lexicalGrammar + '\n\n' + syntacticGrammar + '\n';
};

function Rule(cons) {
    cons.prototype.toJsderiv = function(strict, insert, capture, ignore) {
        if(this instanceof ecma.SyntacticRule) {
            return this.value[0] + ': (' + this.value[1].toJsderiv(strict, insert, capture, ignore) + ') -> ' + this.value[0] + ';';
        } else {
            return this.value[0] + ': ' + this.value[1].toJsderiv(strict, insert, capture, ignore) + ';';
        }
    };
}

Rule(ecma.LexicalRule);
Rule(ecma.SyntacticRule);
Rule(ecma.StringRule);

ecma.Alt.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value.map(function(expr) {
        return expr.toJsderiv(strict, insert, capture, ignore);
    }).join(' | ');
};

ecma.Seq.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    var left  = this.value[0].toJsderiv(strict, insert, capture, ignore),
        right = this.value[1].toJsderiv(strict, insert, capture, ignore);
    
    if(!!ignore && this.value[0] instanceof ecma.Lit) {
        left = '(' + left + ' -> Text)';
    }
    
    if(!!ignore && this.value[1] instanceof ecma.Lit) {
        right = '(' + right + ' -> Text)';
    }
    
    if(insert === undefined) {
        return left + ' ' + right;
    } else {
        return left + ' ' + insert + '*! ' + right;
    }
};

ecma.Opt.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value[0].toJsderiv(strict, insert, capture, ignore) + '?';
};

ecma.NonInsertSeq.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    var left  = this.value[0].toJsderiv(strict, insert, capture, ignore),
        right = this.value[2].toJsderiv(strict, insert, capture, ignore);
    
    if(!!ignore && this.value[0] instanceof ecma.Lit) {
        left = '(' + left + ' -> Text)';
    }
    
    if(!!ignore && this.value[2] instanceof ecma.Lit) {
        right = '(' + right + ' -> Text)';
    }
    
    return left + ' ' + right;
};

ecma.LookNot.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return '?= ~(' + this.value[0].toJsderiv(strict, insert, capture, ignore) + ')';
};

ecma.Id.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value[0];
};

ecma.Lit.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value[0];
};

ecma.Ref.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    switch(this.value[0]) {
        case "any Unicode code unit":
            return ".";
        case "any character in the Unicode categories \"Uppercase letter (Lu)\", \"Lowercase letter (Ll)\", \"Titlecase letter (Lt)\", \"Modifier letter (Lm)\", \"Other letter (Lo)\", or \"Letter number (Nl)\".":
            return "[\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}]";
        case "any character in the Unicode categories \"Non-spacing mark (Mn)\" or \"Combining spacing mark (Mc)\"":
            return "[\\p{Mn}\\p{Mc}]";
        case "any character in the Unicode category \"Decimal number (Nd)\"":
            return "[\\p{Nd}]";
        case "any character in the Unicode category \"Connector punctuation (Pc)\"":
            return "[\\p{Pc}]";
        case "any character in the Unicode range U+0000 thru U+001F":
            return "[\\u0000-\\u001f]";
        case "TAB":
            return "\"\\t\"";
        case "LF":
            return "\"\\n\"";
        case "CR":
            return "\"\\r\"";
        case "VT":
            return "\"\\v\"";
        case "FF":
            return "\"\\f\"";
        case "SP":
            return "\" \"";
        case "NBSP":
            return "\"\\u00a0\"";
        case "BOM":
            return "\"\\ufeff\"";
        case "USP":
            return "[\\s^\\t\\n\\r\\v\\f \\u00a0\\u2028\\u2029]";
        case "LS":
            return "\"\\u2028\"";
        case "PS":
            return "\"\\u2029\"";
        case "ZWNJ":
            return "\"\\u200c\"";
        case "ZWJ":
            return "\"\\u200d\"";
        default:
            if(capture === undefined || capture.indexOf(this.value[0]) === -1) {
                return this.value[0];
            } else {
                return "(<" + this.value[0] + "> -> Text)";
            }
    }
};

ecma.Empty.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return '""';
};

ecma.ButNot.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value[0] + ' & ~(' + this.value[1].toJsderiv(strict, insert, capture, ignore) + ')';
};

ecma.ExclOr.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value[0].toJsderiv(strict, insert, capture, ignore) + ' | ' + this.value[1].toJsderiv(strict, insert, capture, ignore);
};

ecma.Set.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value.map(function(str) {
        return '"' + str + '"';
    }).join(' | ');
};

ecma.OneOf.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    return this.value.map(function(lit) {
        return lit.toJsderiv(strict, insert, capture, ignore);
    }).join(' | ');
};

ecma.Strict.prototype.toJsderiv = function(strict, insert, capture, ignore) {
    if(strict) {
        return this.value[0].toJsderiv(strict, insert, capture, ignore);
    } else {
        return '[]';
    }
};
