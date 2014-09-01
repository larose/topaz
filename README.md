# Introduction

Topaz is a lightweight asynchronous module loader based on promises. It
has no dependency on a specific promise library.


# Quick start

```
npm install topaz
```

Then:

```js
var Topaz = require('topaz');
var Promise = require('bluebird'); // Or your favorite promise library

// fetch is a function that given an id (String) it returns a promise
// that is fulfilled with the module named 'id'.
var fetch = function (id) {
  if (id === 'a') {
    return Promise.resolve({
      dependencies: ['b'],
      execute: function (b) {
        return Promise.resolve(1 + b);
      }
    });
  }

  if (id === 'b') {
    return Promise.resolve({
      dependencies: [],
      execute: function () {
        return Promise.resolve(2);
      }
    });
  }

  return Promise.reject(Error("Cannot find module " + id));
};

// Topaz is a function that given a fetch function and a promise
// library, it returns a resolve function.
var resolve = Topaz({
  fetch: fetch,
  Promise: Promise
});

// resolve is a function that given an array of ids, it returns a
// promise that is fulfilled with an array containing the requested
// modules.
resolve(['a']).spread(function (a) {
  console.log('a =', a); //  => 3
});
```


# API

## `Topaz` :: `options (Object) -> resolve (Function)`

Given a fetch function and a promise library, returns a resolve function.

### `options.fetch` :: `id (String) -> Promise (Object)`

Given an id, returns a promise that is fulfilled with the
module named 'id'.

### `options.Promise` :: `Promise library (Object)`

A promise library such as
[Bluebird](https://github.com/petkaantonov/bluebird) or
[Q](https://github.com/kriskowal/q).

### `resolve` :: `ids (Array) -> Promise (Object)`

Given an array of ids, returns a promise that is fulfilled with an
array containing the modules


# Author

Mathieu Larose <mathieu@mathieularose.com> (http://mathieularose.com)
