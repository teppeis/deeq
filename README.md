deeq [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url]
====

deepEqual extended to support ES6 Map/Set

## Install

```console
$ npm i deeq
```

## Usage

```js
var deeq = require('deeq');

var s1 = new Set([1, 2]);
var s2 = new Set([1, 2]);
var s3 = new Set([3, 4]);
console.log(deeq(s1, s2)); // true
console.log(deeq(s1, s3)); // false
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/deeq.svg
[npm-url]: https://npmjs.org/package/deeq
[travis-image]: https://travis-ci.org/teppeis/deeq.svg?branch=master
[travis-url]: https://travis-ci.org/teppeis/deeq
[deps-image]: https://david-dm.org/teppeis/deeq.svg
[deps-url]: https://david-dm.org/teppeis/deeq
