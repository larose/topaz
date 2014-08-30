var _ = require('lodash');
var Topaz = require('../lib');
var assert = require('assert');
var data = require('./data');
var fetcher = require('./helpers/fetcher');
var sinon = require('sinon');
var Promise = require('bluebird');

var INSTANCES = data.valid.human.concat(data.valid.random);

var testInstance = function (instance) {
  var factorySpies = [];
  var fetchSpy;

  describe(instance.name, function () {
    var promises;

    before(function () {
      var simpleFetch = fetcher.InMemory(instance.modules);
      fetchSpy = sinon.spy(simpleFetch);

      resolve = Topaz({
        fetch: fetchSpy,
        Promise: Promise
      });

      factorySpies = {};
      _.forEach(instance.modules, function (module, name) {
        factorySpies[name] = sinon.spy(module, 'factory');
      });

      promises = instance.resolves.map(function (names) {
        return resolve(names);
      });

      return Promise.all(promises);
    });

    after(function () {
      _.forEach(instance.modules, function (module) {
        module.factory.restore();
      });
    });

    it("should not call fetch for the modules not needed", function () {
      var fetchedModuleNames = _.flatten(fetchSpy.args);
      assert.equal(_.intersection(fetchedModuleNames, instance.notLoaded).length, 0);
    });

    it("should call fetch once per module needed", function () {
      var fetchedModuleNames = _.flatten(fetchSpy.args);
      fetchedModuleNames.sort();
      assert(_.isEqual(fetchedModuleNames, instance.loaded), "fetched once");
    });

    it("should not call the factory for the modules not needed", function () {
      instance.notLoaded.forEach(function (name) {
        var module = instance.modules[name];
        assert.equal(module.factory.callCount, 0);
      });
    });

    it("should call the factory once per module needed", function () {
      instance.loaded.forEach(function (name) {
        var module = instance.modules[name];
        assert.equal(module.factory.callCount, 1);
      });
    });

    it("should resolve the right values", function () {
      var _promises = [];
      for (var i = 0; i < instance.values.length; i++) {
        _promises.push(function(i) {
          return promises[i].then(function (resolved) {
            assert(_.isEqual(instance.values[i], resolved), JSON.stringify(instance.values[i]) + " == " + JSON.stringify(resolved));
          });
        }(i));
      }

      return Promise.all(_promises);
    });
  });
};

describe("valid instances", function () {
  INSTANCES.forEach(function (instance) {
    testInstance(instance);
  });
});
