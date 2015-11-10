deeq
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

MIT License
