require('./grammar-to-source');

var jsderiv = require('./index');

require('./grammar-helper');

var classes = require('./grammar-classes');

classes.Class.prototype.toJavascript = function() {
    var left;
    
    if(this.childNodes.length === 0) {
        return '$.Void()';
    } else {
        return this.childNodes.map(function(expr) {
            return expr.toJavascript();
        }).fold(function(left, right) {
            return '$.Or(' + left + ', ' + right + ')';
        });
    }
};

classes.Char.prototype.toJavascript = function() {
    var chr = this.childNodes[0];
    
    if(chr.substr(0, 1) === '\\') {
        chr = chr.substr(1);
    }
    
    return '$.Char(' + JSON.stringify(chr) + ')';
};

classes.Control.prototype.toJavascript = function() {
    return '$.Char("' + this.childNodes[0] + '")';
};

classes.Unicode.prototype.toJavascript = function() {
    return '$.Char("' + this.childNodes[0] + '")';
};

classes.Range.prototype.toJavascript = function() {
    return '$.Range(' + JSON.stringify(this.childNodes[0]) + ', ' + JSON.stringify(this.childNodes[1]) + ')';
};

classes.Category.prototype.toJavascript = function() {
    return '$.Cat(' + JSON.stringify(this.childNodes[0].replace(/^\\/, '')) + ')';
};

classes.Not.prototype.toJavascript = function() {
    return '$.Not(' + this.childNodes.map(function(expr) {
        return expr.toJavascript();
    }).fold(function(left, right) {
        return '$.Or(' + left + ', ' + right + ')';
    }) + ')';
};
