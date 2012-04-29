var c = require('../../src/jsderiv');
var g = require('../../src/jsderiv');
var l = require('../../src/jsderiv');

g.Cons = function(id) { return g.Node.define(id); };
var defaultRed = c.Red;
c.Red = function(expr, lambda) { return defaultRed(c.Capture(expr), lambda); };
g.InstanceOf = g.Type;
g.List = function() { return arguments[0]; };
var Release = function() { return arguments[0][0]; };
g.Text = function() { return Array.prototype.join.apply(arguments[0], ['']); };
var defaultLiteral = g.Literal;
g.Literal = function(string) { return c.Or(defaultLiteral(string), g.Value(string)); };

