import { Unwind } from './unwind';
import { expect } from 'chai';

describe('Unwind', () => {
  it('should start with Unwind', () => {
    const clause = new Unwind([], 'node');
    expect(clause.build()).to.equal('UNWIND $list AS node');
  });

  it('should create a param for the list', () => {
    const list = [1, 2, 3];
    const clause = new Unwind(list, 'node');
    expect(clause.getParams()).to.deep.equal({ list });
  });
});
