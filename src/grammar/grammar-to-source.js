var parser = require('./grammar');
var helper = require('./grammar-helper');

parser.Module.prototype.toSource = function() {
    return this.childNodes.map(function(definition) {
        return definition.toSource() + '\n';
    }).join('\n');
};

parser.Import.prototype.toSource = function() {
    return 'import {' + this.childNodes[0].join(', ') + '} from ' + this.childNodes[1] + ';';
};

parser.Export.prototype.toSource = function(forComment) {
    return 'export ' + this.childNodes[0].toSource(forComment);
};

parser.Constructor.prototype.toSource = function() {
    return 'constructor ' + this.childNodes.join(', ') + ';';
};

parser.Grammar.prototype.toSource = function(forComment) {
    forComment = forComment || false;
    
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
    
    if(forComment) {
        return 'grammar ' + id + (parent !== null ? 'extends ' + parent : '') + ';';
    } else {
        var padding = helper.padding(rules.map(function(rule) {
            if(rule instanceof parser.Start) {
                return 'start';
            } else {
                return rule.childNodes[0];
            }
        }));
        
        return 'grammar ' + id + (parent !== null ? 'extends ' + parent : '') + ' {\n' +
            '    ' + rules.map(function(rule) {
                return rule.toSource(padding);
            }).join('\n    ') + '\n}';
    }
};

parser.Augmentation.prototype.toSource = function() {
    var padding = helper.padding(this.childNodes[1].map(function(rule) {
        if(rule instanceof parser.Start) {
            return 'start';
        } else {
            return rule.childNodes[0];
        }
    }));
    
    return 'augment grammar ' + this.childNodes[0] + ' {\n' +
        '    ' + this.childNodes[1].map(function(rule) {
            return rule.toSource(padding);
        }).join('\n    ') + '\n}';
};

parser.Start.prototype.toSource = function(padding) {
    var prefix = padding === undefined ? '' : ' ' + padding('start');
    
    return 'start ' + prefix + this.childNodes[0].toSource() + ';';
};

parser.Rule.prototype.toSource = function(padding) {
    var prefix = padding === undefined ? '' : padding(this.childNodes[0]);
    
    return this.childNodes[0] + ': ' + prefix + this.childNodes[1].toSource() + ';';
};

parser.Or.prototype.toSource = function() {
    return this.childNodes[0].toSource() + ' | ' + this.childNodes[1].toSource();
};

var beforeRed = [parser.Or];

parser.Red.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeRed) + ' -> ' + this.childNodes[1];
};

var beforeAnd = beforeRed.concat([parser.Red]);

parser.And.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeAnd) + ' & ' + helper.capture(this.childNodes[1], beforeAnd);
};

var beforeSeq = beforeAnd.concat([parser.And]);

parser.Seq.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeSeq) + ' ' + helper.capture(this.childNodes[1], beforeSeq);
};

var beforeRight = beforeSeq.concat([parser.Seq]);

parser.Any.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeRight) + '*';
};

parser.Many.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeRight) + '+';
};

parser.Maybe.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeRight) + '?';
};

parser.Ignore.prototype.toSource = function() {
    return helper.capture(this.childNodes[0], beforeRight) + '!';
};

var beforeLeft = beforeRight.concat([parser.Any, parser.Many, parser.Maybe, parser.Ignore]);

parser.Not.prototype.toSource = function() {
    return '~ ' + helper.capture(this.childNodes[0], beforeLeft);
};

parser.Look.prototype.toSource = function() {
    return '?= ' + helper.capture(this.childNodes[0], beforeLeft);
};

parser.Type.prototype.toSource = function() {
    return '@' + this.childNodes[0];
};

parser.Value.prototype.toSource = function() {
    return '@' + this.childNodes[0];
};

parser.One.prototype.toSource = function() {
    return '.';
};

parser.Ref.prototype.toSource = function() {
    return this.childNodes[0];
};

parser.Class.prototype.toSource = function() {
    return this.childNodes[0];
};

parser.Literal.prototype.toSource = function() {
    return this.childNodes[0];
};

parser.Default.prototype.toSource = function() {
    return 'default';
};

parser.Super.prototype.toSource = function() {
    return 'super';
};

parser.Capture.prototype.toSource = function() {
    return '<' + this.childNodes[0].toSource() + '>';
};
