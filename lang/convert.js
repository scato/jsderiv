var jsdom = require('../node_modules/jsdom'),
    fs    = require('fs'),
    sys   = require('sys');

var input = fs.readFileSync('lang/es5.html');
var document = jsdom.html(input, '3', {features: {QuerySelector: true}})

var main = document.getElementById('everything');
var childNodes = Array.prototype.slice.apply(main.childNodes);

// hack: Sizzle needs global document for :not
(function() { return this; })().document = document;

function cleanSection(section) {
    var childNodes = Array.prototype.slice.apply(section.childNodes);
    
    childNodes.forEach(function(childNode) {
        if(String(childNode.tagName).toLowerCase() === 'h1') {
            return;
        } else if(String(childNode.tagName).toLowerCase() === 'section') {
            if(childNode.querySelector('div.gp:not(.example)') === undefined) {
                section.removeChild(childNode);
            } else {
                cleanSection(childNode);
            }
        } else if(String(childNode.tagName).toLowerCase() === 'div') {
            if(childNode.className.split(' ').indexOf('gp') !== -1) {
                return;
            } else if(childNode.className.split(' ').indexOf('syntax') !== -1) {
                return;
            } else {
                section.removeChild(childNode);
            }
        } else {
            section.removeChild(childNode);
        }
    });
}

childNodes.forEach(function(childNode) {
    if(childNode.id === 'unofficial') {
        return;
    } else if(!String(childNode.id).match(/^sec-/)) {
        main.removeChild(childNode);
    } else if(childNode.querySelector('div.gp:not(.example)') === undefined) {
        main.removeChild(childNode);
    } else {
        cleanSection(childNode);
    }
});

var pagemarks = Array.prototype.slice.apply(document.querySelectorAll('span.pagemark'));

pagemarks.forEach(function(pagemark) {
    pagemark.parentNode.removeChild(pagemark);
});

var meta = document.createElement('meta');

meta.setAttribute('http-equiv', 'Content-Type');
meta.setAttribute('content', 'text/html; charset=UTF-8');

document.getElementsByTagName('head')[0].appendChild(meta);

fs.writeFileSync('lang/es5-syntax.html', '<!DOCTYPE HTML>' + document.innerHTML);
