# Introduction

Topaz is a lightweight asynchronous module loader based on promises. It
has no dependency on a specific promise library.

# Quick start

```
npm install topaz
```

Then:

```
var Topaz = require('topaz');
var Promise = require('bluebird'); // Or your favorite promise library

var fetch = function (id) {
  if (id === 'a') {
    return Promise.resolve({
      dependencies: ['b'],
      factory: function (b) {
        return Promise.resolve(1 + b);
      }
    });
  }

  if (id === 'b') {
    return Promise.resolve({
      dependencies: [],
      factory: function () {
        return Promise.resolve(2);
      }
    });
  }

  return Promise.reject(Error("Cannot find module " + id));
};

var resolve = Topaz({
  fetch: fetch,
  Promise: Promise
});

resolve(['a']).spread(function (a) {
  console.log('a =', a); //  => 3
});
```
