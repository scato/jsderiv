var ecma = require('./index'),
    fs      = require('fs'),
    sys     = require('sys');

var source = process.argv[2],
    target = process.argv[3];

sys.puts("Reading " + source + "...");

var input  = fs.readFileSync(source).toString();

sys.puts("Parsing...");

var output = ecma.parse(input)[0].toJsderiv(true);

sys.puts("Writing " + target + "...");

fs.writeFileSync(target, output);

sys.puts("Done.");
