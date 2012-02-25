//var jsderiv = require('../grammar/jsderiv'),
var jsderiv = require('./jsderiv'),
    fs      = require('fs'),
    sys     = require('sys');

var source = process.argv[2],
    target = process.argv[3];

sys.puts("Reading " + source + "...");

var input  = fs.readFileSync(source).toString();

sys.puts("Parsing...");

var output = jsderiv.parse(input)[0].toJavascript('../../lib/');

sys.puts("Writing " + target + "...");

//fs.writeFileSync(target, output);
sys.puts(output);

sys.puts("Done.");
