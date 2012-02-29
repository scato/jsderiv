var parser = require('./parser');
var test = require('./parser-test');
var helper = require('./parser-helper');

test.Test.prototype.toJavascript = function(exports) {
    if(exports === undefined) {
        throw new Error("Cannot convert non-exported test to Javascript");
    } else {
        var key = this.value[0][0] + 'test ' + this.value[0].substr(1);
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

test.NodeSet.prototype.toJavascript = function() {
    return '[' + this.value.map(function(nodeList) {
        return nodeList.toJavascript();
    }).join(', ') + ']';
};

test.NodeList.prototype.toJavascript = function() {
    return '[' + this.value.map(function(nodeList) {
        return nodeList.toJavascript();
    }).join(', ') + ']';
};

test.Node.prototype.toJavascript = function() {
    return this.value[0] + '(' + this.value[1].toJavascript() + ')';
};

test.Terminal.prototype.toJavascript = function() {
    return this.value[0];
};
