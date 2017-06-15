deeq [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url]
====

[![Greenkeeper badge](https://badges.greenkeeper.io/teppeis/deeq.svg)](https://greenkeeper.io/)

deepEqual extended to support ES6 Map/Set

## Description

In ES6 era, it's useful to compare Map/Set values easily in testing.
However ES6 Map/Set equals to an empty `Object` in `assert.deepEqual`.

```js
var assert = require('assert');

assert.deepEqual(new Set(), {}); // Pass
assert.deepEqual(new Set([1, 2]), {}); // Pass
assert.deepEqual(new Set([1, 2]), new Set([3])); // Pass
assert.deepEqual(new Set([1, 2]), new Set([3]), true); // Pass
```

`deeq` is a comparison function that is able to compare ES6 Map/Set values.
The other behavior is same as `assert.deepEqual`'s comparison logic.

## Example

```js
var deeq = require('deeq');

var s1 = new Set([1, 2]);
var s2 = new Set([1, 2]);
var s3 = new Set([3, 4]);
console.log(deeq(s1, s2)); // true
console.log(deeq(s1, s3)); // false
```

### with assert

```js
var deeq = require('deeq');
var assert = require('assert');

var s1 = new Set([1, 2]);
var s2 = new Set([3, 4]);
assert(deeq(s1, s2)); // Throw an assertion error!
```

Especially suitable for usage with [power-assert](https://github.com/power-assert-js/power-assert).

## Install

```console
$ npm i deeq
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/deeq.svg
[npm-url]: https://npmjs.org/package/deeq
[travis-image]: https://travis-ci.org/teppeis/deeq.svg?branch=master
[travis-url]: https://travis-ci.org/teppeis/deeq
[deps-image]: https://david-dm.org/teppeis/deeq.svg
[deps-url]: https://david-dm.org/teppeis/deeq
