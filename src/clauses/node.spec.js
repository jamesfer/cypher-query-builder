const expect = require('chai').expect;
const Node = require('./node');
const nodeTests = require('./node.tests');
const { construct } = require('../utils');

describe('Node', function() {
  describe('#build', function() {
    nodeTests(construct(Node, s => s.buildQueryObject()))
  });
});
