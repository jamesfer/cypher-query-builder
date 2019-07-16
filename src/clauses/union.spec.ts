import { expect } from '../../test-setup';
import { Union } from './union';

describe('Union', () => {
  it('should exactly equal UNION', () => {
    const clause = new Union();
    expect(clause.build()).to.equal('UNION');
  });

  it('should exactly equal UNION ALL when all is true', () => {
    const clause = new Union(true);
    expect(clause.build()).to.equal('UNION ALL');
  });
});
