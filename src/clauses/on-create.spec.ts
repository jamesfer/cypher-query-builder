import { OnCreate } from './on-create';
import { Set } from './set';
import { expect } from '../../test-setup';

describe('OnCreate', () => {
  it('should prefix ON CREATE', () => {
    const clause = new OnCreate(new Set({ labels: { a: ['Label'] } }));
    expect(clause.build()).to.equal('ON CREATE SET a:Label');
  });
});
