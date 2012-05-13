var parser = require('./grammar');
var test = require('./grammar-test');
var helper = require('./grammar-helper');

test.Test.prototype.toSource = function(forComment) {
    forComment = forComment || false;
    
    if(false && forComment) {
        return 'test ' + this.childNodes[0] + ';';
    } else {
        return 'test ' + this.childNodes[0] + ' {\n' +
            '    ' + this.childNodes[1].toSource() + '\n    \n' +
            '    ' + this.childNodes[2].map(function(assertion) {
                return assertion.toSource();
            }).join('\n    ') + '\n}';
    }
};

test.StartDeclaration.prototype.toSource = function() {
    return 'start ' + this.childNodes[0] + ';';
};

test.Assertion.prototype.toSource = function() {
    return 'assert ' + this.childNodes[0].toSource() + ' -> ' + this.childNodes[1].toSource() + ';';
};

test.Set.prototype.toSource = function() {
    if(this.childNodes.length === 1) {
        return this.childNodes[0].toSource();
    } else {
        return '{' + this.childNodes.map(function(nodeList) {
            return nodeList.toSource();
        }).join(', ') + '}';
    }
};

test.List.prototype.toSource = function() {
    return '(' + this.childNodes.map(function(nodeList) {
        return nodeList.toSource();
    }).join(', ') + ')';
};

test.Node.prototype.toSource = function() {
    if(this.childNodes[1] instanceof test.List) {
        return this.childNodes[0] + '' + this.childNodes[1].toSource();
    } else {
        return this.childNodes[0] + ' ' + this.childNodes[1].toSource();
    }
};

test.Term.prototype.toSource = function() {
    return this.childNodes[0];
};
