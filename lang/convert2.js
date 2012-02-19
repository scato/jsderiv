var jsdom = require('../node_modules/jsdom'),
    fs    = require('fs'),
    sys   = require('sys');

var input = fs.readFileSync('lang/es5-syntax.html');
var document = jsdom.html(input, '3', {features: {QuerySelector: true}})
var output = '';

// hack: Sizzle needs global document for :not
(function() { return this; })().document = document;

var unofficial = document.getElementById('unofficial');

output += '/*\n';

for(var i = 0; i < unofficial.childNodes.length; i++) {
    var childNode = unofficial.childNodes[i];
    
    if(String(childNode.tagName).toLowerCase() === 'p') {
        output += ' * ' + childNode.innerHTML.replace(/\r\n/g, ' ').replace(/ +/g, ' ') + '\n';
        output += ' * \n';
    }
}

output += ' * And then another hack was appended by Scato Eggen to create this file.\n';
output += ' */\n';
output += '\n';

function formatString(string) {
    // replace newlines with spaces and remove excess spaces
    string = string.replace(/\r\n/g, ' ').replace(/ +/g, ' ').trim();
    
    // replace funny character with not in
    string = string.replace(/\u2209/g, 'not in');
    
    // replace funny quotation marks
    string = string.replace(/[\u201d\u201e]/g, '"');
    
    return string;
}

function formatSpan(span) {
    switch(span.className) {
        case 'nt':
        case 'gprose':
            return '<' + formatString(span.textContent) + '>';
        case 'geq':
        case 'grhsmod':
        case 'grhsannot':
            return formatString(span.textContent);
        case 'chgloss':
            return '/* ' + span.textContent + ' */';
        default:
            throw new Error('TODO: formatSpan(.' + span.className + ')');
    }
}

function formatAll(element, separator) {
    var output = [];
    
    for(var i = 0; i < element.childNodes.length; i++) {
        var childNode = element.childNodes[i];
        
        if(childNode.tagName !== undefined) {
            output.push(format(childNode));
        } else if(childNode.textContent.trim() !== '') {
            output.push(childNode.textContent.trim());
        }
    }
    
    return output.filter(function(token) {
        return token.length > 0;
    }).join(separator);
}

function formatDiv(div) {
    switch(div.className) {
        case 'gp':
            return formatAll(div, '\n') + '\n';
        case 'rhs':
            return '    ' + formatAll(div, ' ');
        case 'lhs':
            return formatAll(div, ' ');
        case 'keyword pile':
        case 'operator pile':
        case '':
        case 'keyword5 pile':
            return '    ' + formatAll(div, ' ');
        case 'end-pile':
            return '';
        case 'gsumxref':
            return '/* ' + div.innerHTML + ' */';
        default:
            throw new Error('TODO: formatDiv(.' + div.className + ')');
    }
}

function formatToken(token) {
    return '"' + token.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function formatCode(code) {
    switch(code.className) {
        case 't':
            return formatToken(code.textContent);
        case 'one-of-t':
            return code.textContent.replace(/ +/g, ' ').trim().split(' ').map(formatToken).join(' ');
    }
}

function formatSub(sub) {
    return '[' + sub.textContent + ']';
}

function format(element) {
    switch(element.tagName.toLowerCase()) {
        case 'div':
            return formatDiv(element);
        case 'span':
            return formatSpan(element);
        case 'code':
            return formatCode(element);
        case 'sub':
            return formatSub(element);
        default:
            throw new Error('TODO: format(' + element.tagName.toLowerCase() + ')');
    }
}

var defs = document.querySelectorAll('div.gp:not(.bogus)');

for(var i = 0; i < defs.length; i++) {
    var def = defs[i];
    
    output += format(def) + '\n';
}

fs.writeFileSync('lang/es5-syntax.ecma.txt', output);
