var parser = require('./grammar');

parser.Literal.prototype.indent = false;
parser.Ref.prototype.indent = false;
parser.Class.prototype.indent = false;

parser.Any.prototype.indent = false;
parser.Ignore.prototype.indent = false;
parser.Or.prototype.indent = false;
parser.And.prototype.indent = false;
parser.Not.prototype.indent = false;
parser.Many.prototype.indent = false;
parser.Look.prototype.indent = false;
parser.Seq.prototype.indent = false;
parser.Red.prototype.indent = false;
parser.InstanceOf.prototype.indent = false;

parser.Constructor.prototype.indent = false;
parser.Import.prototype.indent = false;
