module.exports = function (randInt, numNodes, numArcs) {
  var graph = {};

  numNodes = Math.max(numNodes, 0);
  numArcs = Math.max(Math.min(numArcs, (numNodes * (numNodes - 1)) / 2), 0);

  var candidates = [];

  for (var i = 0; i < numNodes; i++) {
    graph[i] = [];
    var arr = [];
    for (var j = 0; j < numNodes; j++) {
      arr.push(0);
      if (i < j) {
        candidates.push([i, j]);
      }
    }
  }

  for (i = 0; i < numArcs; i++) {
    var index = randInt(0, candidates.length);
    var arc = candidates.splice(index, 1)[0];
    graph[arc[0]].push(arc[1].toString());
  }

  return graph;
};
