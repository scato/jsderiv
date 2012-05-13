var $ = require('../../../src/jsderiv');

// import {Scannerless} from .example;
var Scannerless = require("./example").Scannerless;

// import {Var, Lit} from .example;
var Var = require("./example").Var,
    Lit = require("./example").Lit;

// export test "Scannerless.Var" {
//     start Scannerless.Var;
//     
//     assert "var id;" -> (Var("id"));
//     assert "var id = 'x';" -> (Var("id", Lit("'x'")));
// }
exports["test \"Scannerless.Var\""] = function(test) {
    var start = new Scannerless().Var();
    
    test.deepEqual(start.parse("var id;"), [[Var("id")]]);
    test.deepEqual(start.parse("var id = 'x';"), [[Var("id", Lit("'x'"))]]);
    test.done();
};
