require('./grammar-to-source');

var jsderiv = require('./index');

require('./grammar-helper');

var classes = require('./grammar-classes');

classes.Class.prototype.toJavascript = function() {
    var left;
    
    if(this.childNodes[0][0].length === 0) {
        if(this.childNodes[0][1] === undefined) {
            left = 'c.Void()';
        } else {
            left = 'g.One()';
        }
    } else {
        left = this.childNodes[0][0].map(function(expr) {
            return expr.toJavascript();
        }).fold(function(left, right) {
            return 'c.Or(' + left + ', ' + right + ')';
        });
    }
    
    if(this.childNodes[0][1] === undefined) {
        return left;
    } else {
        var right = this.childNodes[0][1].toJavascript();
        
        return 'c.And(' + left + ', ' + right + ')';
    }
};

classes.Char.prototype.toJavascript = function() {
    var chr = this.childNodes[0][0];
    
    if(chr.substr(0, 1) === '\\') {
        chr = chr.substr(1);
    }
    
    return 'g.Char(' + JSON.stringify(chr) + ')';
};

classes.Control.prototype.toJavascript = function() {
    return 'g.Char(' + JSON.stringify(this.childNodes[0][0]) + ')';
};

classes.Unicode.prototype.toJavascript = function() {
    return 'g.Char(' + JSON.stringify(this.childNodes[0][0]) + ')';
};

classes.Range.prototype.toJavascript = function() {
    return 'g.Range(' + JSON.stringify(this.childNodes[0][0]) + ', ' + JSON.stringify(this.childNodes[0][1]) + ')';
};

classes.Category.prototype.toJavascript = function() {
    return 'g.Category(' + JSON.stringify(this.childNodes[0][0]) + ')';
};

classes.Not.prototype.toJavascript = function() {
    return 'c.Not(' + this.childNodes[0].map(function(expr) {
        return expr.toJavascript();
    }).fold(function(left, right) {
        return 'c.Or(' + left + ', ' + right + ')';
    }) + ')';
};
