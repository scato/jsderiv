var parser = require('./grammar');
var test = require('./grammar-test');
var helper = require('./grammar-helper');

test.Test.prototype.toJavascript = function(exports) {
    if(exports === undefined) {
        throw new Error("Cannot convert non-exported test to Javascript");
    } else {
        var key = JSON.stringify('test ' + this.childNodes[0]);
        var prefix = exports + '[' + key + '] = ';
        
        return prefix + 'function(test) {\n' +
            this.childNodes[1].toJavascript('    ') + '\n    \n' +
            this.childNodes[2].map(function(rule) {
                return rule.toJavascript('    ');
            }).join('\n') + '\n' +
            '    test.done();\n' +
            '};';
    }
};

test.StartDeclaration.prototype.toJavascript = function(indent) {
    indent = indent || '';
    
    return indent + 'var start = new ' + this.childNodes[0].split('.').map(function(part) {
        return part + '()';
    }).join('.') + ';';
    return indent + '// ' + this.toSource() + '\n' +
        indent + 'var start = new ' + this.childNodes[0].split('.').map(function(part) {
            return part + '()';
        }).join('.') + ';';
};

test.Assertion.prototype.toJavascript = function(indent) {
    indent = indent || '';
    
    return indent + 'test.deepEqual(start.parse(' + this.childNodes[0].toJavascript() + '), ' + this.childNodes[1].toJavascript() + ');';
    return indent + '// ' + this.toSource() + '\n' +
        indent + 'test.deepEqual(start.parse(' + this.childNodes[0].toJavascript() + '), ' + this.childNodes[1].toJavascript() + ');';
};

test.Set.prototype.toJavascript = function() {
    return '[' + this.childNodes.map(function(list) {
        return list.toJavascript();
    }).join(', ') + ']';
};

test.List.prototype.toJavascript = function() {
    return '[' + this.childNodes.map(function(node) {
        return node.toJavascript();
    }).join(', ') + ']';
};

test.List.prototype.toArguments = function() {
    return '(' + this.childNodes.map(function(node) {
        return node.toJavascript();
    }).join(', ') + ')';
};

test.Node.prototype.toJavascript = function() {
    return this.childNodes[0] + this.childNodes[1].toArguments();
};

test.Term.prototype.toJavascript = function() {
    return this.childNodes[0];
};
