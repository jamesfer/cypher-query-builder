import { nodeTests } from './node-pattern.tests';
import { construct } from '../utils';
import { NodePattern } from './node-pattern';

describe('Node', function() {
  describe('#build', function() {
    nodeTests(construct(NodePattern, s => s.buildQueryObject()))
  });
});
