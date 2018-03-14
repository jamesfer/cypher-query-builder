import { With } from './with';
import { expect } from 'chai';

describe('With', () => {
  it('should start with WITH', () => {
    const clause = new With('node');
    expect(clause.build()).to.equal('WITH node');
  });
});
