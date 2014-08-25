var _ = require('lodash');
var generateRandomDag = require('./random_dag');
var generateRandomResolves = require('./random_resolves');
var module = require('./module');
var seedrandom = require('seedrandom');

var SEED = 548425;
var NUM_GRAPHS = 20;
var MAX_NUM_RESOLVES = 2;
var MAX_NUM_NODES = 20;


var Random = function (seed) {
  this._rng = seedrandom(seed);
};

Random.prototype.randInt = function (min, max) {
  return Math.floor(this._rng() * (max - min)) + min;
};

var random = new Random(SEED);

var randInt = random.randInt.bind(random);

var initInstance = function (instance) {
  instance.modules = module.createModules(instance.graph);
  var state = module.discriminate(instance.graph, instance.resolves);
  instance.loaded = state.loaded;
  instance.notLoaded = state.notLoaded;

  return instance;
};

var VALID_HUMAN = [{
  name: "1 - [1]",
  graph: {
    '1': []
  },
  resolves: [['1']],
  values: [['1']]
}, {
  name: "1 => [2] - [1,2]",
  graph: {
    '1': ['2'],
    '2': []
  },
  resolves: [['1'], ['2']],
  values: [['1'], ['2']]
}, {
  name: "1 => [2, 3]; 2 => [3] - [1,3]",
  graph: {
    '1': ['2', '3'],
    '2': ['3'],
    '3': []
  },
  resolves: [['3', '1'], ['3']],
  values: [['3', '1'], ['3']]
}, {
  name: "1 => [2, 3]; 2 => [3] - [2,3]",
  graph: {
    '1': ['2', '3'],
    '2': ['3'],
    '3': []
  },
  resolves: [['3'], ['2', '2']],
  values: [['3'], ['2', '2']]
}];

var VALID_RANDOM = [];

for (var i = 0; i < NUM_GRAPHS; i++) {
  var numNodes = randInt(0, MAX_NUM_NODES);
  var numArcs = randInt(0, (numNodes * (numNodes - 1) / 2));

  var graph = generateRandomDag(randInt, numNodes, numArcs);
  var resolves = generateRandomResolves(randInt, graph, randInt(1, MAX_NUM_RESOLVES));

  var instance = {
    graph: graph,
    resolves: resolves,
    values: _.cloneDeep(resolves),
    name: "random " + (i + 1)
  };

  VALID_RANDOM.push(instance);
}

VALID_HUMAN = VALID_HUMAN.map(initInstance);
VALID_RANDOM = VALID_RANDOM.map(initInstance);

exports.valid = {
  human: VALID_HUMAN,
  random: VALID_RANDOM
};
