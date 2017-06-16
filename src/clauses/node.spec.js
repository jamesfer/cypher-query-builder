const expect = require('chai').expect;
const Node = require('./node');
const nodeTests = require('./node.tests');

describe('Node#toString', function() {
  nodeTests(function() {
    let args = [Node];
    args.push.apply(args, arguments);
    let node = new (Node.bind.apply(Node, args))();
    return node.toString();
  });
});
