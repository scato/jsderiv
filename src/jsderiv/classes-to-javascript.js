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
