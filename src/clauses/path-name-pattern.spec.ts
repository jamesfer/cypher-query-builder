import { PathNamePattern } from './path-name-pattern';
import { expect } from 'chai';

describe('PathNamePattern', () => {

  it('should accept just a name', () => {
    const pattern = new PathNamePattern('label');
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('label');
  });
});
