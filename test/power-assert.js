// experimental

var deeq = require('deeq');
deeq.inject();
var stringifier = require('stringifier');
var typeName = require('type-name');
var assert = require('power-assert').customize({
  output: {
    stringify: stringify
  }
});

describe('ES6 Set', () => {
  it('with assert.deepEqual()', () => {
    var s1 = new Set([1]);
    var s2 = new Set([2, 3, {a: 1, b: 2}]);
    assert.deepEqual(s1, s2);
  });

  it('with assert(deeq())', () => {
    var s1 = new Set([1]);
    var s2 = new Set([2]);
    assert(deeq(s1, {a: 1}));
  });
});

function stringify(val) {
  return stringifier.stringify(val, {
    typeFn: typeFn,
    handlers: {
      'Set': setToString
    }
  });
}

function typeFn(val) {
  if (val instanceof Set) {
    return 'Set';
  }
  return typeName(val);
}

function setToString(acc, set) {
  var values = [];
  set.forEach(value => {
    values.push(stringify(value));
  });
  acc.push(`Set{${values.join(',')}}`);
}
