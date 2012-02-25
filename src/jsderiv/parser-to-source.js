var parser = require('./parser');
var helper = require('./parser-helper');

parser.Module.prototype.toSource = function() {
    return this.value.map(function(definition) {
        return definition.toSource() + '\n';
    }).join('\n');
};

parser.Import.prototype.toSource = function() {
    return 'import {' + this.value[0].join(', ') + '} from ' + this.value[1] + ';';
};

parser.Export.prototype.toSource = function(forComment) {
    return 'export ' + this.value[0].toSource(forComment);
};

parser.Constructor.prototype.toSource = function() {
    return 'constructor ' + this.value.join(', ') + ';';
};

parser.Grammar.prototype.toSource = function(forComment) {
    forComment = forComment || false;
    
    if(forComment) {
        return 'grammar ' + this.value[0] + ';';
    } else {
        var padding = helper.padding(this.value[1].map(function(rule) {
            if(rule instanceof parser.Start) {
                return 'start';
            } else {
                return rule.value[0];
            }
        }));
        
        return 'grammar ' + this.value[0] + ' {\n' +
            '    ' + this.value[1].map(function(rule) {
                return rule.toSource(padding);
            }).join('\n    ') + '\n}';
    }
};

parser.Augmentation.prototype.toSource = function() {
    var padding = helper.padding(this.value[1].map(function(rule) {
        if(rule instanceof parser.Start) {
            return 'start';
        } else {
            return rule.value[0];
        }
    }));
    
    return 'augment grammar ' + this.value[0] + ' {\n' +
        '    ' + this.value[1].map(function(rule) {
            return rule.toSource(padding);
        }).join('\n    ') + '\n}';
};

parser.Start.prototype.toSource = function(padding) {
    var prefix = padding === undefined ? '' : ' ' + padding('start');
    
    return 'start ' + prefix + this.value[0].toSource() + ';';
};

parser.Rule.prototype.toSource = function(padding) {
    var prefix = padding === undefined ? '' : padding(this.value[0]);
    
    return this.value[0] + ': ' + prefix + this.value[1].toSource() + ';';
};

parser.Or.prototype.toSource = function() {
    return this.value[0].toSource() + ' | ' + this.value[1].toSource();
};

var beforeRed = [parser.Or];

parser.Red.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeRed) + ' -> ' + this.value[1];
};

var beforeAnd = beforeRed.concat([parser.Red]);

parser.And.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeAnd) + ' & ' + helper.capture(this.value[1], beforeAnd);
};

var beforeSeq = beforeAnd.concat([parser.And]);

parser.Seq.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeSeq) + ' ' + helper.capture(this.value[1], beforeSeq);
};

var beforeRight = beforeSeq.concat([parser.Seq]);

parser.Any.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeRight) + '*';
};

parser.Many.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeRight) + '+';
};

parser.Maybe.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeRight) + '?';
};

parser.Ignore.prototype.toSource = function() {
    return helper.capture(this.value[0], beforeRight) + '!';
};

var beforeLeft = beforeRight.concat([parser.Any, parser.Many, parser.Maybe, parser.Ignore]);

parser.Not.prototype.toSource = function() {
    return '~ ' + helper.capture(this.value[0], beforeLeft);
};

parser.Look.prototype.toSource = function() {
    return '?= ' + helper.capture(this.value[0], beforeLeft);
};

parser.InstanceOf.prototype.toSource = function() {
    return '@' + this.value[0];
};

parser.One.prototype.toSource = function() {
    return '.';
};

parser.Ref.prototype.toSource = function() {
    return this.value[0];
};

parser.Class.prototype.toSource = function() {
    return this.value[0];
};

parser.Literal.prototype.toSource = function() {
    return this.value[0];
};

parser.Default.prototype.toSource = function() {
    return 'default';
};
