var Topaz = require('../lib');
var assert = require('assert');
var fetcher = require('./helpers/fetcher');
var sinon = require('sinon');
var Promise = require('bluebird');

var INSTANCES = [{
  dependencies: ['z'],
  cycle: ['z', 'z']
}, {
  dependencies: ['a'],
  cycle: ['a', 'b', 'c', 'a']
}, {
  dependencies: ['b'],
  cycle: ['b', 'c', 'a', 'b']
}, {
  dependencies: ['c'],
  cycle: ['c', 'a', 'b', 'c']
}, {
  dependencies: ['1'],
  cycle: ['1', 'a', 'b', 'c', 'a']
}, {
  dependencies: ['2'],
  cycle: ['2', 'b', 'c', 'a', 'b']
}, {
  dependencies: ['3'],
  cycle: ['3', 'c', 'a', 'b', 'c']
}, {
  dependencies: ['4'],
  cycle: ['4', '1', 'a', 'b', 'c', 'a']
}];


describe("circular dependency", function () {
  var fetchSpy;
  var resolve;
  var promise;

  before(function() {
    var modules = {
      a: {
        dependencies: ['b']
      },
      b: {
        dependencies: ['c']
      },
      c: {
        dependencies: ['a']
      },
      '1': {
        dependencies: ['a']
      },
      '2': {
        dependencies: ['b']
      },
      '3': {
        dependencies: ['c']
      },
      '4': {
        dependencies: ['1']
      },
      z: {
        dependencies: ['z']
      }
    };

    var simpleFetch = fetcher.InMemory(modules);
    fetchSpy = sinon.spy(simpleFetch);
    resolve = Topaz({
      fetch: fetchSpy,
      Promise: Promise
    });
  });

  INSTANCES.forEach(function (instance) {
    it(instance.dependencies + ": " + instance.cycle.join(" => "), function () {
      return resolve(instance.dependencies).then(
        function () {
          return Promise.reject(Error("Resolved circular dependency"));
        },
        function (err) {
          var expectedMessage = "Circular dependency: " + instance.cycle.join(" => ");
          assert.equal(err.message, expectedMessage);
        });
    });
  });
});
