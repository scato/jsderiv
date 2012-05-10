var parser = require('./grammar');
var test = require('./grammar-test');
var helper = require('./grammar-helper');

test.Test.prototype.toSource = function(forComment) {
    forComment = forComment || false;
    
    if(false && forComment) {
        return 'test ' + this.value[0] + ';';
    } else {
        return 'test ' + this.value[0] + ' {\n' +
            '    ' + this.value[1].toSource() + '\n\n' +
            '    ' + this.value[2].map(function(assertion) {
                return assertion.toSource();
            }).join('\n    ') + '\n}';
    }
};

test.StartDeclaration.prototype.toSource = function() {
    return 'start ' + this.value[0] + '.' + this.value[1] + ';';
};

test.Assertion.prototype.toSource = function() {
    return 'assert ' + this.value[0].toSource() + ' -> ' + this.value[1].toSource() + ';';
};

test.Set.prototype.toSource = function() {
    if(this.value.length === 1) {
        return this.value[0].toSource();
    } else {
        return '{' + this.value.map(function(nodeList) {
            return nodeList.toSource();
        }).join(', ') + '}';
    }
};

test.List.prototype.toSource = function() {
    return '(' + this.value.map(function(nodeList) {
        return nodeList.toSource();
    }).join(', ') + ')';
};

test.Node.prototype.toSource = function() {
    if(this.value[1] instanceof test.NodeList) {
        return this.value[0] + '' + this.value[1].toSource();
    } else {
        return this.value[0] + ' ' + this.value[1].toSource();
    }
};

test.Term.prototype.toSource = function() {
    return this.value[0];
};
