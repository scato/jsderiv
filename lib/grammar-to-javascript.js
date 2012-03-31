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
            return id + padding(id) + ' = require(' + JSON.stringify(path) + ').' + id;
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
    var id, parent, rules;
    
    if(this.value.length === 3) {
        id = this.value[0];
        parent = this.value[1];
        rules = this.value[2];
    } else {
        id = this.value[0];
        parent = null;
        rules = this.value[1];
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
            return rule.toJavascript(proto, undefined, this.value[0]);
        }.bind(this)).join('\n\n');
};

parser.Augmentation.prototype.toJavascript = function() {
    var proto = this.value[0] + '.prototype';
    
    return this.value[1].map(function(rule) {
            return rule.toJavascript(proto, true, this.value[0]);
        }.bind(this)).join('\n\n');
};

function exprToJavascript(id, expr, exports, augmentation, grammar, rule) {
    var param = augmentation ? '$default' : '';
    var value = augmentation ? exports + '.' + id : '';
    
    return '(function(' + param + ') {\n' +
        '    var $cache;\n' +
        '    \n' +
        '    ' + exports + '.' + id + ' = function() {\n' +
        '        return $cache || ($cache = g.Ref(function() {\n' +
        '            return ' + expr.toJavascript(grammar, rule) + ';\n' +
        '        }.bind(this), \'' + id + '\'));\n' +
        '    };\n' +
        '})(' + value + ');';
};

parser.Start.prototype.toJavascript = function(exports, augmentation, grammar) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript('start', this.value[0], exports, augmentation, grammar, 'start');
};

parser.Rule.prototype.toJavascript = function(exports, augmentation, grammar) {
    return '// ' + this.toSource() + '\n' +
        exprToJavascript(this.value[0], this.value[1], exports, augmentation, grammar, this.value[0]);
};

parser.Or.prototype.toJavascript = function(grammar, rule) {
    return 'c.Or(' + this.value[0].toJavascript(grammar, rule) + ', ' + this.value[1].toJavascript(grammar, rule) + ')';
};

parser.Red.prototype.toJavascript = function(grammar, rule) {
    return 'c.Red(' + this.value[0].toJavascript(grammar, rule) + ', ' + this.value[1] + ')';
};

parser.And.prototype.toJavascript = function(grammar, rule) {
    return 'c.And(' + this.value[0].toJavascript(grammar, rule) + ', ' + this.value[1].toJavascript(grammar, rule) + ')';
};

parser.Seq.prototype.toJavascript = function(grammar, rule) {
    return 'c.Seq(' + this.value[0].toJavascript(grammar, rule) + ', ' + this.value[1].toJavascript(grammar, rule) + ')';
};

parser.Any.prototype.toJavascript = function(grammar, rule) {
    return 'c.Any(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.Many.prototype.toJavascript = function(grammar, rule) {
    return 'c.Many(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.Maybe.prototype.toJavascript = function(grammar, rule) {
    return 'c.Maybe(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.Ignore.prototype.toJavascript = function(grammar, rule) {
    return 'c.Ignore(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.Not.prototype.toJavascript = function(grammar, rule) {
    return 'c.Not(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.Look.prototype.toJavascript = function(grammar, rule) {
    return 'l.Look(' + this.value[0].toJavascript(grammar, rule) + ')';
};

parser.InstanceOf.prototype.toJavascript = function(grammar, rule) {
    return 'g.InstanceOf(' + this.value[0] + ')';
};

parser.One.prototype.toJavascript = function(grammar, rule) {
    return 'g.One()';
};

parser.Ref.prototype.toJavascript = function(grammar, rule) {
    return 'this.' + this.value[0] + '()';
};

parser.Class.prototype.toJavascript = function(grammar, rule) {
    try {
        return jsderiv.parseClass(this.value[0])[0].toJavascript(grammar, rule);
    } catch(ex) {
        throw new Error("Error parsing class '" + this.value[0] + "': " + ex);
    }
};

parser.Literal.prototype.toJavascript = function(grammar, rule) {
    return 'g.Literal(' + this.value[0] + ')';
};

parser.Default.prototype.toJavascript = function(grammar, rule) {
    return '$default.apply(this, []).func()';
};

parser.Super.prototype.toJavascript = function(grammar, rule) {
    return grammar + '.$super.prototype.' + rule + '.apply(this, []).func()';
};

parser.Capture.prototype.toJavascript = function(grammar, rule) {
    return 'g.Capture(' + this.value[0].toJavascript(grammar, rule) + ')';
};

require('./parser-helper');

var classes = require('./classes');

classes.Class.prototype.toJavascript = function() {
    var left;
    
    if(this.value[0].length === 0) {
        if(this.value[1] === undefined) {
            left = 'c.Void()';
        } else {
            left = 'g.One()';
        }
    } else {
        left = this.value[0].map(function(expr) {
            return expr.toJavascript();
        }).fold(function(left, right) {
            return 'c.Or(' + left + ', ' + right + ')';
        });
    }
    
    if(this.value[1] === undefined) {
        return left;
    } else {
        var right = this.value[1].toJavascript();
        
        return 'c.And(' + left + ', ' + right + ')';
    }
};

classes.Char.prototype.toJavascript = function() {
    var chr = this.value[0];
    
    if(chr.substr(0, 1) === '\\') {
        chr = chr.substr(1);
    }
    
    return 'g.Char(' + JSON.stringify(chr) + ')';
};

classes.Control.prototype.toJavascript = function() {
    return 'g.Char(' + JSON.stringify(this.value[0]) + ')';
};

classes.Unicode.prototype.toJavascript = function() {
    return 'g.Char(' + JSON.stringify(this.value[0]) + ')';
};

classes.Range.prototype.toJavascript = function() {
    return 'g.Range(' + JSON.stringify(this.value[0]) + ', ' + JSON.stringify(this.value[1]) + ')';
};

classes.Category.prototype.toJavascript = function() {
    return 'g.Category(' + JSON.stringify(this.value[0]) + ')';
};

classes.Not.prototype.toJavascript = function() {
    return 'c.Not(' + this.value.map(function(expr) {
        return expr.toJavascript();
    }).fold(function(left, right) {
        return 'c.Or(' + left + ', ' + right + ')';
    }) + ')';
};
