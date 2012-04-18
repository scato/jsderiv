var ArgumentError = require('../../src/jsderiv').ArgumentError;

var Void = require('../../src/jsderiv').Void,
    Null = require('../../src/jsderiv').Null,
    Cat  = require('../../src/jsderiv').Cat,
    Map  = require('../../src/jsderiv').Map;

exports['test constructor'] = function(test) {
    // constructor expects one argument
    test.throws(function() {
        new Cat();
    }, ArgumentError);
    
    // constructor expects a valid category
    test.throws(function() {
        new Cat(false);
    }, ArgumentError);
    
    // constructor expects a valid category
    test.throws(function() {
        new Cat('x');
    }, ArgumentError);
    
    // function can also be used as a constructor 
    test.ok(Cat('w') instanceof Cat);
    
    test.done();
};

exports['test equals'] = function(test) {
    // Cat('w') is equal to "another" Cat('w')
    test.ok(Cat('w').equals(Cat('w')));
    
    // Cat('w') is not equal to Cat('d')
    test.ok(!Cat('w').equals(Cat('d')));
    
    // Cat('w') is not equal to Void
    test.ok(!Cat('w').equals(Void()));
    
    test.done();
};

exports['test toString'] = function(test) {
    // Cat('w') renders as "Cat("w")"
    test.equals('Cat("w")', Cat('w').toString());
    
    test.done();
};

exports['test isNullable'] = function(test) {
    // Cat('w') is not nullable
    test.ok(!Cat('w').isNullable());
    
    test.done();
};

exports['test isVoidable'] = function(test) {
    // Cat('w') is voidable
    test.ok(Cat('w').isVoidable());
    
    test.done();
};

exports['test delta'] = function(test) {
    // delta requires an argument
    test.throws(function() {
        Cat('w').delta();
    }, ArgumentError);
    
    // the delta of Cat('w') is always Void
    test.ok(Cat('w').delta('a').equals(Void()));
    
    test.done();
};

exports['test derive'] = function(test) {
    // derive requires an argument
    test.throws(function() {
        Cat('w').derive();
    }, ArgumentError);
    
    // deriving Cat('w') yields Null -> 'a' for 'a'
    test.ok(Cat('w').derive('a') instanceof Map);
    test.deepEqual(Cat('w').derive('a').parseNull(), ['a']);
    
    // deriving Cat('d') yields Void for 'a'
    test.ok(Cat('d').derive('a').equals(Void()));
    
    test.done();
};

exports['test parseNull'] = function(test) {
    // parsing Null with Cat('w') always yields an empty set
    test.deepEqual(Cat('w').parseNull(), []);
    
    test.done();
};

exports['test parse'] = function(test) {
    // parse requires an argument
    test.throws(function() {
        Cat('w').parse();
    });
    
    // parsing "a" with Cat('w') yields "a"
    test.deepEqual(Cat('w').parse("a"), ["a"]);
    
    // parsing "abc" with Cat('w') yields an empty set
    test.deepEqual(Cat('w').parse("abc"), []);
    
    test.done();
};

exports['test derive JavaScript categories'] = function(test) {
    // derive Cat('w') yields non-void for alphanumerics and underscore, void for everything else
    test.ok(!Cat('w').derive('a').equals(Void()));
    test.ok(!Cat('w').derive('A').equals(Void()));
    test.ok(!Cat('w').derive('0').equals(Void()));
    test.ok(!Cat('w').derive('_').equals(Void()));
    test.ok(Cat('w').derive('%').equals(Void()));
    test.ok(Cat('w').derive(' ').equals(Void()));
    
    // derive Cat('W') yields void for alphanumerics and underscore, non-void for everything else
    test.ok(Cat('W').derive('a').equals(Void()));
    test.ok(Cat('W').derive('A').equals(Void()));
    test.ok(Cat('W').derive('0').equals(Void()));
    test.ok(Cat('W').derive('_').equals(Void()));
    test.ok(!Cat('W').derive('%').equals(Void()));
    test.ok(!Cat('W').derive(' ').equals(Void()));
    
    // derive Cat('d') yields non-void for decimals, void for everything else
    test.ok(Cat('d').derive('a').equals(Void()));
    test.ok(Cat('d').derive('A').equals(Void()));
    test.ok(!Cat('d').derive('0').equals(Void()));
    test.ok(Cat('d').derive('_').equals(Void()));
    test.ok(Cat('d').derive('%').equals(Void()));
    test.ok(Cat('d').derive(' ').equals(Void()));
    
    // derive Cat('D') yields void for decimals, non-void for everything else
    test.ok(!Cat('D').derive('a').equals(Void()));
    test.ok(!Cat('D').derive('A').equals(Void()));
    test.ok(Cat('D').derive('0').equals(Void()));
    test.ok(!Cat('D').derive('_').equals(Void()));
    test.ok(!Cat('D').derive('%').equals(Void()));
    test.ok(!Cat('D').derive(' ').equals(Void()));
    
    // derive Cat('s') yields non-void for decimals, void for everything else
    test.ok(Cat('s').derive('a').equals(Void()));
    test.ok(Cat('s').derive('A').equals(Void()));
    test.ok(Cat('s').derive('0').equals(Void()));
    test.ok(Cat('s').derive('_').equals(Void()));
    test.ok(Cat('s').derive('%').equals(Void()));
    test.ok(!Cat('s').derive(' ').equals(Void()));
    
    // derive Cat('S') yields void for decimals, non-void for everything else
    test.ok(!Cat('S').derive('a').equals(Void()));
    test.ok(!Cat('S').derive('A').equals(Void()));
    test.ok(!Cat('S').derive('0').equals(Void()));
    test.ok(!Cat('S').derive('_').equals(Void()));
    test.ok(!Cat('S').derive('%').equals(Void()));
    test.ok(Cat('S').derive(' ').equals(Void()));
    
    test.done();
};

exports['test derive Unicode categories'] = function(test) {
    // The following are valid constructor arguments: p{Cc}, p{Zs}, p{Po}, p{Sc}, p{Ps}, p{Pe}, p{Sm}, p{Pd}, p{Nd}, p{Lu}, p{Sk}, p{Pc}, p{Ll}, p{So}, p{Pi}, p{Cf}, p{No}, p{Pf}, p{Lo}, p{Lt}, p{Lm}, p{Mn}, p{Me}, p{Mc}, p{Nl}, p{Zl}, p{Zp}, p{Cs}, p{Co}: 
    
    test.doesNotThrow(function() {
        new Cat('p{Cc}');
        new Cat('p{Zs}');
        new Cat('p{Po}');
        new Cat('p{Sc}');
        new Cat('p{Ps}');
        new Cat('p{Pe}');
        new Cat('p{Sm}');
        new Cat('p{Pd}');
        new Cat('p{Nd}');
        new Cat('p{Lu}');
        new Cat('p{Sk}');
        new Cat('p{Pc}');
        new Cat('p{Ll}');
        new Cat('p{So}');
        new Cat('p{Pi}');
        new Cat('p{Cf}');
        new Cat('p{No}');
        new Cat('p{Pf}');
        new Cat('p{Lo}');
        new Cat('p{Lt}');
        new Cat('p{Lm}');
        new Cat('p{Mn}');
        new Cat('p{Me}');
        new Cat('p{Mc}');
        new Cat('p{Nl}');
        new Cat('p{Zl}');
        new Cat('p{Zp}');
        new Cat('p{Cs}');
        new Cat('p{Co}');
    }, ArgumentError);
    
    // derive Cat('p{Cc}') yields non-void for '\0'
    // derive Cat('p{Cc}') yields non-void for '\u0083' (NO BREAK HERE)
    // derive Cat('p{Cc}') yields void for 'a'
    test.ok(!Cat('p{Cc}').derive('\0').equals(Void()));
    test.ok(!Cat('p{Cc}').derive('\u0083').equals(Void()));
    test.ok(Cat('p{Cc}').derive('a').equals(Void()));
    
    // derive Cat('p{Sm}') yields non-void for '+'
    // derive Cat('p{Sm}') yields non-void for '\u00d7' (MULTIPLICATION SIGN)
    // derive Cat('p{Sm}') yields void for 'a'
    test.ok(!Cat('p{Sm}').derive('+').equals(Void()));
    test.ok(!Cat('p{Sm}').derive('\u00d7').equals(Void()));
    test.ok(Cat('p{Sm}').derive('a').equals(Void()));
    
    // derive Cat('p{Ll}') yields non-void for 'a'
    // derive Cat('p{Ll}') yields non-void for '\u00e0' (LATIN SMALL LETTER A WITH GRAVE)
    // derive Cat('p{Ll}') yields void for '+'
    test.ok(!Cat('p{Ll}').derive('a').equals(Void()));
    test.ok(!Cat('p{Ll}').derive('\u00e0').equals(Void()));
    test.ok(Cat('p{Ll}').derive('+').equals(Void()));
    
    // derive Cat('p{Pd}') yields non-void for '-'
    // derive Cat('p{Pd}') yields non-void for '\u2014' (EM DASH)
    // derive Cat('p{Pd}') yields void for '+'
    test.ok(!Cat('p{Pd}').derive('-').equals(Void()));
    test.ok(!Cat('p{Pd}').derive('\u2014').equals(Void()));
    test.ok(Cat('p{Pd}').derive('+').equals(Void()));
    
    // P{Cc} is also a valid constructor argument 
    test.doesNotThrow(function() {
        new Cat('P{Cc}');
    }, ArgumentError);
    
    // derive Cat('P{Pd}') yields void for '-'
    // derive Cat('P{Pd}') yields void for '\u2014' (EM DASH)
    // derive Cat('P{Pd}') yields non-void for '+'
    test.ok(Cat('P{Pd}').derive('-').equals(Void()));
    test.ok(Cat('P{Pd}').derive('\u2014').equals(Void()));
    test.ok(!Cat('P{Pd}').derive('+').equals(Void()));
    
    // p{Xx} is not a valid constructor argument 
    test.throws(function() {
        new Cat('p{Xx}');
    }, ArgumentError);
    
    test.done();
};
