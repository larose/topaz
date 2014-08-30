module.exports = function (options) {
  var fetch = options.fetch;
  var Promise = options.Promise;
  var modules = {};

  var resolve = function (path, dependencies) {
    return Promise.all(dependencies.map(function (id) {

      // 1. Check circular dependency
      var index = path.indexOf(id);
      if (index !== -1) {
        return Promise.reject(new CircularDependencyError([], path.slice(index)));
      }

      // 2. Get module from cache, if available
      var promise = modules[id];
      if (typeof promise !== 'undefined') {
        return promise;
      }

      // 3. Load module
      return modules[id] = fetch(id).then(function (module) {
        return resolve(path.concat([id]), module.dependencies).spread(module.execute, createError.bind(null, Promise, id));
      });
    }));
  };

  return resolve.bind(null, []);
};

var CircularDependencyError = function (path, cycle) {
  this.path = path;
  this.cycle = cycle;
  this.message = "Circular dependency: " + path.concat(cycle).concat([cycle[0]]).join(" => ");
};
CircularDependencyError.prototype.__proto__ = Error.prototype;

var createError = function (Promise, id, parentError) {
  if (!(parentError instanceof CircularDependencyError)) {
    return Promise.reject(parentError);
  }

  var _path = [];
  var _cycle = parentError.cycle;

  var depIndex = parentError.cycle.indexOf(id);
  var depInCycle = depIndex !== -1;
  if (depInCycle) {
    // Rotate cycle so it starts with dep
    _cycle = parentError.cycle.slice(depIndex).concat(parentError.cycle.slice(0, depIndex));
  } else {
    // Add dep at the beginning of the path
    _path = parentError.path.slice(0);
    _path.splice(0, 0, id);
  }

  return Promise.reject(new CircularDependencyError(_path, _cycle));
};
