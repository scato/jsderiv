var ecma = require('./ecma');
var generic = require('../../lib/generic')

require('./ecma-to-jsderiv');

exports.parse = function(string) {
    try {
        return generic.parse(new ecma.ECMA().start(), string, true);
    } catch(ex) {
        if(ex.result !== undefined) {
            require('sys').puts('Ambigious grammar, document could mean any of...');
            require('sys').puts(ex.result.join('\n'));
        } else {
            throw ex;
        }
    }
};
