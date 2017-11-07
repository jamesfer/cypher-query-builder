import { construct } from '../utils';
import { Create } from './create';
import { createTests } from './create.tests';

describe('Create', function() {
  describe('#build', function() {
    createTests(construct(Create, s => s.buildQueryObject()));
  });
});
