var assert = require('assert');
var deeq = require('../');

describe('deeq', () => {
  context('Set', () => {
    it('equals', () => {
      assert(deeq(new Set(), new Set()));
      assert(deeq(new Set([1]), new Set([1])));
      assert(deeq(new Set([1, 2]), new Set([1, 2])));
    });
    it('different size', () => {
      assert(!deeq(new Set([1]), new Set()));
    });
    it('different value', () => {
      assert(!deeq(new Set([1]), new Set([2])));
    });
    it('not strict', () => {
      assert(deeq(new Set([1]), new Set(['1'])));
    });
    it('strict', () => {
      assert(!deeq(new Set([1]), new Set(['1']), true));
    });
  });

  context('Map', () => {
    it('equals', () => {
      assert(deeq(new Map(), new Map()));
      assert(deeq(new Map([['a', 1]]), new Map([['a', 1]])));
      assert(deeq(new Map([['a', 1], ['b', 2]]), new Map([['a', 1], ['b', 2]])));
    });
    it('different size', () => {
      assert(!deeq(new Map([['a', 1]]), new Map()));
    });
    it('different value', () => {
      assert(!deeq(new Map([['a', 1]]), new Map([['a', 2]])));
    });
    it('different key', () => {
      assert(!deeq(new Map([['a', 1]]), new Map([['b', 1]])));
    });
    it('not strict', () => {
      assert(deeq(new Map([['a', 1]]), new Map([['a', '1']])));
    });
    it('strict', () => {
      assert(!deeq(new Map([['a', 1]]), new Map([['a', '1']]), true));
    });
  });

  context('Primitives', () => {
    it('same', () => {
      assert(deeq(1, 1));
      assert(deeq('a', 'a'));
      assert(deeq(null, null));
      assert(deeq(undefined, undefined));
      var s = Symbol();
      assert(deeq(s, s));
    });
    it('different', () => {
      assert(!deeq(1, 2));
      assert(!deeq('a', 'b'));
      assert(!deeq(null, 0));
      assert(!deeq(Symbol(), Symbol()));
    });
    it('not strict', () => {
      assert(deeq(4, '4'));
      assert(deeq(true, 1));
      assert(!deeq(4, '5'));
    });
    it('strict', () => {
      assert(deeq(4, 4, true));
      assert(!deeq(4, '4', true));
    });
  });

  context('Date', () => {
    it('same', () => {
      assert(deeq(new Date(2000, 3, 14), new Date(2000, 3, 14)));
    });
    it('different', () => {
      assert(!deeq(new Date(2000, 3, 14), new Date(2000, 3, 15)));
    });
  });

  context('RegExp', () => {
    it('same', () => {
      assert(deeq(/a/, /a/));
      assert(deeq(/a/g, /a/g));
      assert(deeq(/a/i, /a/i));
      assert(deeq(/a/m, /a/m));
      assert(deeq(/a/igm, /a/igm));
      assert(deeq(/a/mgi, /a/igm));
    });
    it('different pattern', () => {
      assert(!deeq(/ab/, /a/));
    });
    it('different flag: g', () => {
      assert(!deeq(/a/g, /a/));
    });
    it('different flag: i', () => {
      assert(!deeq(/a/i, /a/));
    });
    it('different flag: m', () => {
      assert(!deeq(/a/m, /a/));
    });
    it('different flag order', () => {
      assert(!deeq(/a/igm, /a/im));
    });
    it('different last index', () => {
      var re = /a/;
      re.lastIndex = 3;
      assert(!deeq(re, /a/));
    });
  });

  context('Object', () => {
    it('having the same number of owned properties && the same set of keys', () => {
      assert(deeq({a: 4}, {a: 4}));
      assert(deeq({a: 4, b: '2'}, {a: 4, b: '2'}));
    });
    it('array', () => {
      assert(deeq([4], ['4']));
    });
    it('does not allow extra property', () => {
      assert(!deeq({a: 4}, {a: 4, b: true}));
    });
    it('array and object (number index)', () => {
      assert(deeq(['a'], {0: 'a'}));
    });
    it('although not necessarily the same order', () => {
      assert(deeq({a: 4, b: '1'}, {b: '1', a: 4}));
    });
    it('array that has properties', () => {
      var a1 = [1, 2, 3];
      var a2 = [1, 2, 3];
      a1.a = 'test';
      a1.b = true;
      a2.b = true;
      a2.a = 'test';
      assert(!deeq(Object.keys(a1), Object.keys(a2))); // depends on implementation
      assert(deeq(a1, a2));
    });
    it('having an identical prototype property', () => {
      var nbRoot = {
        toString: function() { return this.first + ' ' + this.last; }
      };

      function nameBuilder(first, last) {
        this.first = first;
        this.last = last;
        return this;
      }
      nameBuilder.prototype = nbRoot;

      function nameBuilder2(first, last) {
        this.first = first;
        this.last = last;
        return this;
      }
      nameBuilder2.prototype = nbRoot;

      var nb1 = new nameBuilder('Ryan', 'Dahl');
      var nb2 = new nameBuilder2('Ryan', 'Dahl');

      assert(deeq(nb1, nb2));

      nameBuilder2.prototype = Object;
      nb2 = new nameBuilder2('Ryan', 'Dahl');
      assert(deeq(nb1, nb2));
    });
    it('primitives and object', () => {
      assert(!deeq(null, {}));
      assert(!deeq(undefined, {}));
      assert(!deeq('a', ['a']));
      assert(!deeq('a', {0: 'a'}));
      assert(!deeq(1, {}));
      assert(!deeq(true, {}));
      assert(!deeq(Symbol(), {}));
    });
    it('primitive wrappers and object', () => {
      assert(deeq(new String('a'), ['a']));
      assert(deeq(new String('a'), {0: 'a'}));
      assert(deeq(new Number(1), {}));
      assert(deeq(new Boolean(true), {}));
    });
  });
});
