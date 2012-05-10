var grammar = require('../../src/grammar');

grammar.convert(__dirname + '/files/example.g', __dirname + '/files/example.js', '../../../src/jsderiv');
grammar.convert(__dirname + '/files/tests.g', __dirname + '/files/tests.js', '../../../src/jsderiv');

var tests = require(__dirname + '/files/tests.g');

for(var p in tests) {
    if(tests.hasOwnProperty(p)) {
        exports[p] = tests[p];
    }
}

