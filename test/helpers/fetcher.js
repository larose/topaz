var Promise = require('bluebird');

exports.InMemory = function (modules) {
  return function (name) {
    if (modules[name]) {
      return Promise.resolve(modules[name]);
    }
    return Promise.reject(Error("Module '" + name + "' not found"));
  };
};
