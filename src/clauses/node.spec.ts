import { nodeTests } from './node.tests';
import { construct } from '../utils';
import { Node } from './node';

describe('Node', function() {
  describe('#build', function() {
    nodeTests(construct(Node, s => s.buildQueryObject()))
  });
});
