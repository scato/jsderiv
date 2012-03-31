exports.moduleIdentifierToPath = function(moduleIdentifier) {
    var i = moduleIdentifier.match(/^\.*/)[0].length;
    
    var path = moduleIdentifier.substring(i).split('.').map(function(part) {
        if(part.match(/^(?:'|")/)) {
            return JSON.parse(part);
        } else {
            return part;
        }
    }).join('/');
    
    var base = './';
    
    if(i === 0) {
        base = '';
    } else {
        while(--i) {
            base = base + '../';
        }
    }
    
    return base + path;
};

Array.prototype.max = Array.prototype.max || function() {
    var max = undefined;
    
    this.forEach(function(element) {
        if(max === undefined || max < element) {
            max = element;
        }
    });
    
    return max;
};

String.prototype.repeat = String.prototype.repeat || function(n) {
    var output = '';
    
    while(n--) {
        output += this;
    }
    
    return output;
};

exports.padding = function(list) {
    var string = ' '.repeat(list.map(function(element) { return element.length; }).max());
    
    return function(element) {
        return string.substr(element.length);
    };
};

exports.capture = function(expr, list) {
    var source = expr.toSource();
    
    if(list.some(function(cons) {
        return expr instanceof cons;
    })) {
        return '(' + source + ')';
    } else {
        return source;
    }
};

Array.prototype.fold = Array.prototype.fold || function(lambda) {
    if(this.length === 0) {
        throw new Error('cannot fold empty list');
    } else if(this.length === 1) {
        return this[0];
    } else {
        var left = this.length - 1;
        
        return lambda(this.slice(0, left).fold(lambda), this[left]);
    }
};

exports.unescapeSlash = function(string) {
    if(string[0] === '\\') {
        return string[1];
    } else {
        return string;
    }
};

