require('./grammar-to-source');

var jsderiv = require('./index');

var parser = require('./grammar');
var helper = require('./grammar-helper');

parser.Module.prototype.toJavascript = function(libPath) {
    return 'var $ = require(\'' + libPath + '\');\n\n' +
        
        this.childNodes.map(function(definition) {
            return definition.toJavascript() + '\n';
        }).join('\n');
};

parser.Import.prototype.toJavascript = function() {
    var path = helper.moduleIdentifierToPath(this.childNodes[1]);
    var padding = helper.padding(this.childNodes[0]);
    
    return '// ' + this.toSource() + '\n' +
        'var ' + this.childNodes[0].map(function(id) {
            return id + padding(id) + ' = require(' + JSON.stringify(path) + ').' + id;
        }).join(',\n    ') + ';';
};

parser.Export.prototype.toJavascript = function() {
    return '// ' + this.toSource(true).replace(/\n/g, '\n// ') + '\n' + this.childNodes[0].toJavascript('exports');
};

parser.Constructor.prototype.toJavascript = function(exports) {
    var comment = exports === undefined ? '// ' + this.toSource() + '\n' : '';
    var padding = helper.padding(this.childNodes);
    
    return comment + this.childNodes.map(function(id) {
        var infix = exports === undefined ? '' : exports + '.' + id + padding(id) + ' = ';
        
        return 'var ' + id + padding(id) + ' = ' + infix + '$.Node.define("' + id + '");';
    }).join('\n');
};

parser.Grammar.prototype.toJavascript = function(exports) {
    var id, parent, rules;
    
    if(this.childNodes.length === 3) {
        id = this.childNodes[0];
        parent = this.childNodes[1];
        rules = this.childNodes[2];
    } else {
        id = this.childNodes[0];
        parent = null;
        rules = this.childNodes[1];
    }
    
    var infix = exports === undefined ? '' : exports + '.' + id + ' = ';
    var cons = exports === undefined ? id : exports + '.' + id;
    var proto = cons + '.prototype';
    var extend = parent !== null ? proto + ' = Object.create(' + parent + '.prototype);\n'
                                 + id + '.$super = ' + parent + ';\n'
                                 + proto + '.constructor = ' + id + ';\n\n' : '';
    
    return 'var ' + id + ' = ' + infix + 'function() {};\n\n' +
        extend + 
        rules.map(function(rule) {
            return rule.toJavascript(proto, undefined, this.childNodes[0]);
        }.bind(this)).join('\n\n');
};

parser.Augmentation.prototype.toJavascript = function() {
    var proto = this.childNodes[0] + '.prototype';
    
    return this.childNodes[1].map(function(rule) {
            return rule.toJavascript(proto, true, this.childNodes[0]);
        }.bind(this)).join('\n\n');
};

function exprToJavascript(id, expr, exports, augmentation, grammar, rule) {
    var param = augmentation ? '$default' : '';
    var childNodes = augmentation ? exports + '.' + id : '';
    var hashCode = expr.toSource().hashCode();
    var cache = 'this._' + rule + '_' + hashCode;
    
    return '(function(' + param + ') {\n' +
        '    ' + exports + '.' + id + ' = function() {\n' +
        '        return ' + cache + ' || (' + cache + ' = $.Ref(function() {\n' +
        '            return ' + expr.toJavascript(grammar, rule) + ';\n' +
        '        }.bind(this), \'' + id + '\'));\n' +
        '    };\n' +
        '})(' + childNodes + ');';
};

parser.Start.prototype.toJavascript = function(exports, augmentation, grammar) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript('start', this.childNodes[0], exports, augmentation, grammar, 'start');
};

parser.Rule.prototype.toJavascript = function(exports, augmentation, grammar) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript(this.childNodes[0], this.childNodes[1], exports, augmentation, grammar, this.childNodes[0]);
};

parser.Or.prototype.toJavascript = function(grammar, rule) {
    return '$.Or(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Red.prototype.toJavascript = function(grammar, rule) {
    return '$.Red(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1] + ')';
};

parser.And.prototype.toJavascript = function(grammar, rule) {
    return '$.And(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Seq.prototype.toJavascript = function(grammar, rule) {
    return '$.Seq(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Any.prototype.toJavascript = function(grammar, rule) {
    return '$.Any(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Many.prototype.toJavascript = function(grammar, rule) {
    return '$.Many(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Maybe.prototype.toJavascript = function(grammar, rule) {
    return '$.Maybe(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Ignore.prototype.toJavascript = function(grammar, rule) {
    return '$.Ignore(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Not.prototype.toJavascript = function(grammar, rule) {
    return '$.Not(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Look.prototype.toJavascript = function(grammar, rule) {
    return '$.Look(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Type.prototype.toJavascript = function(grammar, rule) {
    return '$.Type(' + this.childNodes[0] + ')';
};

parser.Value.prototype.toJavascript = function(grammar, rule) {
    return '$.Value(' + this.childNodes[0] + ')';
};

parser.One.prototype.toJavascript = function(grammar, rule) {
    return '$.One()';
};

parser.Ref.prototype.toJavascript = function(grammar, rule) {
    return 'this.' + this.childNodes[0] + '()';
};

parser.Class.prototype.toJavascript = function(grammar, rule) {
    var result;
    
    try {
        result = jsderiv.parseClass(this.childNodes[0]);
    } catch(ex) {
        throw new Error("Error parsing class '" + this.childNodes[0] + "': " + ex);
    }
    
    return result[0][0].toJavascript(grammar, rule);
};

parser.Literal.prototype.toJavascript = function(grammar, rule) {
    return '$.Literal(' + this.childNodes[0] + ')';
};

parser.Char.prototype.toJavascript = function() {
    return '$.Char(' + this.childNodes[0].replace(/^'/, '"').replace(/'$/, '"') + ')';
};

parser.Category.prototype.toJavascript = function() {
    return '$.Cat(' + JSON.stringify(this.childNodes[0].replace(/^'\\/, '').replace(/'$/, '')) + ')';
};

parser.Default.prototype.toJavascript = function(grammar, rule) {
    return '$default.apply(this, []).resolve()';
};

parser.Super.prototype.toJavascript = function(grammar, rule) {
    return grammar + '.$super.prototype.' + rule + '.apply(this, []).resolve()';
};

parser.Capture.prototype.toJavascript = function(grammar, rule) {
    return '$.Capture(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

