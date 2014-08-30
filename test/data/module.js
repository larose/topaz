var _ = require('lodash');
var Promise = require('bluebird');

exports.createModules = function (graph) {
  var modules = {};

  _.forEach(graph, function (dependencies, name) {
    var module = {
      dependencies: dependencies.slice(0),
      execute: function () {
        return Promise.resolve(name);
      }
    };
    modules[name] = module;
  });

  return modules;
};

exports.discriminate = function (graph, invokes) {
  var directlyLoaded = _.uniq(_.flatten(invokes));
  var loaded = [];

  var names = _.map(graph, function(_, name) {
    return name;
  });

  directlyLoaded.forEach(function (name) {
    var dependencies = dfs(graph, name);
    loaded = loaded.concat(dependencies);
  });

  loaded = _.uniq(loaded);
  loaded.sort();

  notLoaded = _.difference(names, loaded);

  return {
    loaded: loaded,
    notLoaded: notLoaded
  };
};

var dfs = function (graph, start) {
  var nodes = [];
  var visited = {};

  var _dfs = function (node) {
    graph[node].forEach(function (neighbor) {
      if (!(neighbor in visited)) {
        _dfs(neighbor);
      }
    });

    visited[node] = true;
    nodes.push(node);
  };

  _dfs(start);

  nodes.reverse();
  return nodes;
};
