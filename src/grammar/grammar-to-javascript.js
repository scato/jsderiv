require('./grammar-to-source');

var jsderiv = require('./index');

var parser = require('./grammar');
var helper = require('./grammar-helper');

parser.Module.prototype.toJavascript = function(libPath) {
    return 'var c = require(\'' + libPath + 'common\');\n' +
        'var g = require(\'' + libPath + 'generic\');\n' +
        'var l = require(\'' + libPath + 'lookahead\');\n\n' +
        
        'var List = g.List,\n' +
        '    Text = g.Text;\n\n' + 
        
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
        
        return 'var ' + id + padding(id) + ' = ' + infix + 'g.Cons("' + id + '");';
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
    
    return '(function(' + param + ') {\n' +
        '    var $cache;\n' +
        '    \n' +
        '    ' + exports + '.' + id + ' = function() {\n' +
        '        return $cache || ($cache = g.Ref(function() {\n' +
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
    return 'c.Or(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Red.prototype.toJavascript = function(grammar, rule) {
    return 'c.Red(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1] + ')';
};

parser.And.prototype.toJavascript = function(grammar, rule) {
    return 'c.And(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Seq.prototype.toJavascript = function(grammar, rule) {
    return 'c.Seq(' + this.childNodes[0].toJavascript(grammar, rule) + ', ' + this.childNodes[1].toJavascript(grammar, rule) + ')';
};

parser.Any.prototype.toJavascript = function(grammar, rule) {
    return 'c.Any(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Many.prototype.toJavascript = function(grammar, rule) {
    return 'c.Many(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Maybe.prototype.toJavascript = function(grammar, rule) {
    return 'c.Maybe(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Ignore.prototype.toJavascript = function(grammar, rule) {
    return 'c.Ignore(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Not.prototype.toJavascript = function(grammar, rule) {
    return 'c.Not(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Look.prototype.toJavascript = function(grammar, rule) {
    return 'l.Look(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

parser.Type.prototype.toJavascript = function(grammar, rule) {
    return 'g.Type(' + this.childNodes[0] + ')';
};

parser.Value.prototype.toJavascript = function(grammar, rule) {
    return 'g.Value(' + this.childNodes[0] + ')';
};

parser.One.prototype.toJavascript = function(grammar, rule) {
    return 'g.One()';
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
    return 'g.Literal(' + this.childNodes[0] + ')';
};

parser.Default.prototype.toJavascript = function(grammar, rule) {
    return '$default.apply(this, []).func()';
};

parser.Super.prototype.toJavascript = function(grammar, rule) {
    return grammar + '.$super.prototype.' + rule + '.apply(this, []).func()';
};

parser.Capture.prototype.toJavascript = function(grammar, rule) {
    return 'g.Capture(' + this.childNodes[0].toJavascript(grammar, rule) + ')';
};

