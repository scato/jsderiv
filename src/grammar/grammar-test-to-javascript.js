var parser = require('./grammar');
var test = require('./grammar-test');
var helper = require('./grammar-helper');

test.Test.prototype.toJavascript = function(exports) {
    if(exports === undefined) {
        throw new Error("Cannot convert non-exported test to Javascript");
    } else {
        var key = JSON.stringify('test ' + this.value[0]);
        var prefix = exports + '[' + key + '] = ';
        
        return prefix + 'function(test) {\n' +
            this.value[1].toJavascript() + '\n\n' +
            this.value[2].map(function(rule) {
                return rule.toJavascript();
            }).join('\n') + '\n' +
            '    test.done();\n' +
            '};';
    }
};

test.StartDeclaration.prototype.toJavascript = function() {
    return '    var start = new ' + this.value[0] + '().' + this.value[1] + '();';
    return '    // ' + this.toSource() + '\n' +
        '    var start = new ' + this.value[0] + '().' + this.value[1] + '();';
};

test.Assertion.prototype.toJavascript = function() {
    return '    test.deepEqual(g.parse(start, ' + this.value[0].toJavascript() + '), ' + this.value[1].toJavascript() + ');';
    return '    // ' + this.toSource() + '\n' +
        '    test.deepEqual(g.parse(start, ' + this.value[0].toJavascript() + '), ' + this.value[1].toJavascript() + ');';
};

test.Set.prototype.toJavascript = function() {
    return '[' + this.value.map(function(nodeList) {
        return nodeList.toJavascript();
    }).join(', ') + ']';
};

test.List.prototype.toJavascript = function() {
    return '[' + this.value.map(function(nodeList) {
        return nodeList.toJavascript();
    }).join(', ') + ']';
};

test.Node.prototype.toJavascript = function() {
    return this.value[0] + '(' + this.value[1].toJavascript() + ')';
};

test.Term.prototype.toJavascript = function() {
    return this.value[0];
};
