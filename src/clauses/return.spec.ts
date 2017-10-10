import { returnTests } from './return.tests';
import { construct } from '../utils';
import { Return } from './return';

describe('Return', function() {
  describe('#build', function() {
    returnTests(construct(Return, s => s.buildQueryObject()));
  });
});
