module.exports = function (randInt, graph, numResolves) {
  var nodes = Object.keys(graph);
  var numNodes = nodes.length;

  var resolves = [];

  for (var i = 0; i < numResolves; i++) {
    var numDependencies = randInt(0, numNodes);
    var resolve = [];
    for (var j = 0; j < numDependencies; j++) {
      resolve.push(nodes[randInt(0, numNodes)]);
    }

    resolves.push(resolve);
  }

  return resolves;
};
