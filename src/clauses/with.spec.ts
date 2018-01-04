import { With } from './with';
import { expect } from 'chai';

describe('With', function() {
  it('should start with WITH', function() {
    const clause = new With('node');
    expect(clause.build()).to.equal('WITH node');
  });
});
