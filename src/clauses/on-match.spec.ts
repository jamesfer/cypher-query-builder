import { Set } from './set';
import { expect } from '../../test-setup';
import { OnMatch } from './on-match';

describe('OnMatch', () => {
  it('should prefix ON MATCH', () => {
    const clause = new OnMatch(new Set({ labels: { a: ['Label'] } }));
    expect(clause.build()).to.equal('ON MATCH SET a:Label');
  });
});
