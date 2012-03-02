require('./parser-to-source');

var jsderiv = require('./index');

var parser = require('./parser');
var helper = require('./parser-helper');

parser.Module.prototype.toJavascript = function(libPath) {
    return 'var c = require(\'' + libPath + 'common\');\n' +
        'var g = require(\'' + libPath + 'generic\');\n' +
        'var l = require(\'' + libPath + 'lookahead\');\n\n' +
        
        'var List = g.List,\n' +
        '    Text = g.Text;\n\n' + 
        
        this.value.map(function(definition) {
            return definition.toJavascript() + '\n';
        }).join('\n');
};

parser.Import.prototype.toJavascript = function() {
    var path = helper.moduleIdentifierToPath(this.value[1]);
    var padding = helper.padding(this.value[0]);
    
    return '// ' + this.toSource() + '\n' +
        'var ' + this.value[0].map(function(id) {
            return id + padding(id) + ' = require(\'' + path + '\').' + id;
        }).join(',\n    ') + ';';
};

parser.Export.prototype.toJavascript = function() {
    return '// ' + this.toSource(true).replace(/\n/g, '\n// ') + '\n' + this.value[0].toJavascript('exports');
};

parser.Constructor.prototype.toJavascript = function(exports) {
    var comment = exports === undefined ? '// ' + this.toSource() + '\n' : '';
    var padding = helper.padding(this.value);
    
    return comment + this.value.map(function(id) {
        var infix = exports === undefined ? '' : exports + '.' + id + padding(id) + ' = ';
        
        return 'var ' + id + padding(id) + ' = ' + infix + 'g.Cons("' + id + '");';
    }).join('\n');
};

parser.Grammar.prototype.toJavascript = function(exports) {
    var infix = exports === undefined ? '' : exports + '.' + this.value[0] + ' = ';
    var cons = exports === undefined ? this.value[0] : exports + '.' + this.value[0];
    var proto = cons + '.prototype';
    
    return 'var ' + this.value[0] + ' = ' + infix + 'function() {};\n\n' + 
        this.value[1].map(function(rule) {
            return rule.toJavascript(proto);
        }).join('\n\n');
};

parser.Augmentation.prototype.toJavascript = function() {
    var proto = this.value[0] + '.prototype';
    
    return this.value[1].map(function(rule) {
            return rule.toJavascript(proto, true);
        }).join('\n\n');
};

function exprToJavascript(id, expr, exports, augmentation) {
    var param = augmentation ? '$default' : '';
    var value = augmentation ? exports + '.' + id : '';
    
    return '(function(' + param + ') {\n' +
        '    var $cache;\n' +
        '    \n' +
        '    ' + exports + '.' + id + ' = function() {\n' +
        '        return $cache || ($cache = g.Ref(function() {\n' +
        '            return ' + expr.toJavascript() + ';\n' +
        '        }.bind(this), \'' + id + '\'));\n' +
        '    };\n' +
        '})(' + value + ');';
};

parser.Start.prototype.toJavascript = function(exports, augmentation) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript('start', this.value[0], exports, augmentation);
};

parser.Rule.prototype.toJavascript = function(exports, augmentation) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript(this.value[0], this.value[1], exports, augmentation);
};

parser.Or.prototype.toJavascript = function() {
    return 'c.Or(' + this.value[0].toJavascript() + ', ' + this.value[1].toJavascript() + ')';
};

parser.Red.prototype.toJavascript = function() {
    return 'c.Red(' + this.value[0].toJavascript() + ', ' + this.value[1] + ')';
};

parser.And.prototype.toJavascript = function() {
    return 'c.And(' + this.value[0].toJavascript() + ', ' + this.value[1].toJavascript() + ')';
};

parser.Seq.prototype.toJavascript = function() {
    return 'c.Seq(' + this.value[0].toJavascript() + ', ' + this.value[1].toJavascript() + ')';
};

parser.Any.prototype.toJavascript = function() {
    return 'c.Any(' + this.value[0].toJavascript() + ')';
};

parser.Many.prototype.toJavascript = function() {
    return 'c.Many(' + this.value[0].toJavascript() + ')';
};

parser.Maybe.prototype.toJavascript = function() {
    return 'c.Maybe(' + this.value[0].toJavascript() + ')';
};

parser.Ignore.prototype.toJavascript = function() {
    return 'c.Ignore(' + this.value[0].toJavascript() + ')';
};

parser.Not.prototype.toJavascript = function() {
    return 'c.Not(' + this.value[0].toJavascript() + ')';
};

parser.Look.prototype.toJavascript = function() {
    return 'l.Look(' + this.value[0].toJavascript() + ')';
};

parser.InstanceOf.prototype.toJavascript = function() {
    return 'g.InstanceOf(' + this.value[0] + ')';
};

parser.One.prototype.toJavascript = function() {
    return 'g.One()';
};

parser.Ref.prototype.toJavascript = function() {
    return 'this.' + this.value[0] + '()';
};

parser.Class.prototype.toJavascript = function() {
    try {
        return jsderiv.parseClass(this.value[0])[0].toJavascript();
    } catch(ex) {
        throw new Error("Error parsing class '" + this.value[0] + "': " + ex);
    }
};

parser.Literal.prototype.toJavascript = function() {
    return 'g.Literal(' + this.value[0] + ')';
};

parser.Default.prototype.toJavascript = function() {
    return '$default.apply(this, [])';
};
