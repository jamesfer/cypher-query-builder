import { construct } from '../utils';
import { Match } from './match';
import { matchTests } from './match.tests';

describe('Match', function() {
  describe('#build', function() {
    matchTests(construct(Match, s => s.buildQueryObject()));
  });
});
