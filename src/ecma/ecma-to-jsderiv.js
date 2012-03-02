var ecma = require('./ecma');

ecma.Grammar.prototype.toJsderiv = function(strict) {
    var lexicalGrammar = 'export grammar Lexical {\n' +
        this.value.filter(function(rule) {
            return rule instanceof ecma.LexicalRule;
        }).map(function(rule) {
            return '    ' + rule.toJsderiv(strict) + '\n';
        }).join('') + '}';
    
    var syntacticGrammar = 'export grammar Syntactic {\n' +
        this.value.filter(function(rule) {
            return rule instanceof ecma.SyntacticRule;
        }).map(function(rule) {
            return '    ' + rule.toJsderiv(strict, 'LT') + '\n';
        }).join('') + '}';
    
    var stringGrammar = 'export grammar String {\n' +
        this.value.filter(function(rule) {
            return rule instanceof ecma.StringRule;
        }).map(function(rule) {
            return '    ' + rule.toJsderiv(strict) + '\n';
        }).join('') + '}';
    
    return lexicalGrammar + '\n\n' + syntacticGrammar + '\n\n' + stringGrammar + '\n';
};

function Rule(cons) {
    cons.prototype.toJsderiv = function(strict, insert) {
        return this.value[0] + ': ' + this.value[1].toJsderiv(strict, insert) + ';';
    };
}

Rule(ecma.LexicalRule);
Rule(ecma.SyntacticRule);
Rule(ecma.StringRule);

ecma.Alt.prototype.toJsderiv = function(strict, insert) {
    return this.value.map(function(expr) {
        return expr.toJsderiv(strict, insert);
    }).join(' | ');
};

ecma.Seq.prototype.toJsderiv = function(strict, insert) {
    if(insert === undefined) {
        return this.value[0].toJsderiv(strict, insert) + ' ' + this.value[1].toJsderiv(strict, insert);
    } else {
        return this.value[0].toJsderiv(strict, insert) + ' ' + insert + '*! ' + this.value[1].toJsderiv(strict, insert);
    }
};

ecma.Opt.prototype.toJsderiv = function(strict, insert) {
    return this.value[0].toJsderiv(strict, insert) + '?';
};

ecma.NonInsertSeq.prototype.toJsderiv = function(strict, insert) {
    return this.value[0].toJsderiv(strict, insert) + ' (' + insert + ' & ~' + this.value[1].toJsderiv(strict, insert) + ')*! ' + this.value[2].toJsderiv(strict, insert);
};

ecma.LookNot.prototype.toJsderiv = function(strict, insert) {
    return '?= ~(' + this.value[0].toJsderiv(strict, insert) + ')';
};

ecma.Id.prototype.toJsderiv = function(strict, insert) {
    return this.value[0];
};

ecma.Lit.prototype.toJsderiv = function(strict, insert) {
    return this.value[0];
};

ecma.Ref.prototype.toJsderiv = function(strict, insert) {
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
            return this.value[0];
    }
};

ecma.Empty.prototype.toJsderiv = function(strict, insert) {
    return '""';
};

ecma.ButNot.prototype.toJsderiv = function(strict, insert) {
    return this.value[0] + ' & ~(' + this.value[1].toJsderiv(strict, insert) + ')';
};

ecma.ExclOr.prototype.toJsderiv = function(strict, insert) {
    return this.value[0].toJsderiv(strict, insert) + ' | ' + this.value[1].toJsderiv(strict, insert);
};

ecma.Set.prototype.toJsderiv = function(strict, insert) {
    return this.value.map(function(str) {
        return '"' + str + '"';
    }).join(' | ');
};

ecma.OneOf.prototype.toJsderiv = function(strict, insert) {
    return this.value.map(function(lit) {
        return lit.toJsderiv(strict, insert);
    }).join(' | ');
};

ecma.Strict.prototype.toJsderiv = function(strict, insert) {
    if(strict) {
        return this.value[0].toJsderiv(strict, insert);
    } else {
        return '[]';
    }
};
