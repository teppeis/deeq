'use strict';

let util = require('util');
let originalAssert = require('assert');

function deeq(actual, expected, strict) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (actual instanceof Buffer && expected instanceof Buffer) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  } else if (isSet(actual) && isSet(expected)) {
    return actual.size === expected.size &&
           deeq(setToArray(actual), setToArray(expected), strict);

  } else if (isMap(actual) && isMap(expected)) {
    return actual.size === expected.size &&
           deeq(mapToArray(actual), mapToArray(expected), strict);

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, strict);
  }
}

function isSet(object) {
  return Object.prototype.toString.call(object) == '[object Set]';
}

function isMap(object) {
  return Object.prototype.toString.call(object) == '[object Map]';
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function setToArray(set) {
  let arr = [];
  set.forEach(function(value) {
    arr.push(value);
  });
  return arr;
}

function mapToArray(map) {
  let arr = [];
  map.forEach(function(value, key) {
    arr.push([key, value]);
  });
  return arr;
}

function objEquiv(a, b, strict) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  let aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deeq(a, b, strict);
  }
  let ka = Object.keys(a),
      kb = Object.keys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deeq(a[key], b[key], strict)) return false;
  }
  return true;
}

const DEEP_EQUAL_KEY = Symbol('deepEqual');
const DEEP_STRICT_EQUAL_KEY = Symbol('deepStrictEqual');

deeq.inject = function(assertToInject) {
  let assert = assertToInject || originalAssert;
  if (!assert[DEEP_EQUAL_KEY]) {
    assert[DEEP_EQUAL_KEY] = assert.deepEqual;
  }
  if (!assert[DEEP_STRICT_EQUAL_KEY]) {
    assert[DEEP_STRICT_EQUAL_KEY] = assert.deepStrictEqual;
  }
  assert.deepEqual = function deepEqual(actual, expected, message) {
    if (!deeq(actual, expected, false)) {
      assert.fail(actual, expected, message, 'deepEqual', assert.deepEqual);
    }
  };

  assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
    if (!deeq(actual, expected, true)) {
      assert.fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
    }
  };
};

deeq.restore = function(injectedAssert) {
  let assert = injectedAssert || originalAssert;
  if (assert[DEEP_EQUAL_KEY]) {
    assert.deepEqual = assert[DEEP_EQUAL_KEY];
    delete assert[DEEP_EQUAL_KEY];
  }
  if (assert[DEEP_STRICT_EQUAL_KEY]) {
    assert.deepStrictEqual = assert[DEEP_STRICT_EQUAL_KEY];
    delete assert[DEEP_STRICT_EQUAL_KEY];
  }
};

module.exports = deeq;
