import { Query } from '../query';
import { Call } from './call';
import { expect } from '../../test-setup';
import { spy } from 'sinon';
import { Clause } from '../clause';
import { greaterEqualTo, node } from './index';

type Testcase = {subQuery: Query, exp: string};
describe('call', () => {
  const expectations  : Record<string, Testcase> = {
    'wraps a subQuery in brackets' : {
      subQuery: (new Query<never, unknown>()).with('node').return('node'),
      exp: 'CALL {\n WITH node\nRETURN node\n}',
    },
  };

  for (const test in expectations) {
    const { exp, subQuery } = expectations[test];
    it(test, () => {
      const clause = new Call(subQuery);
      expect(clause.build()).to.equal(exp);
    });
  }

  it('passes the sub query params to the clause', () => {
    const addParam = spy(Clause.prototype, 'addParam');
    const subQuery = new Query()
      .match(node('node', 'Label', { id: 1 }))
      .where({ age : greaterEqualTo(5) });

    new Call(subQuery).build();
    expect(addParam.getCalls().length).to.equal(2);
    expect(addParam.getCalls()[0].calledWith(1, 'id')).to.be.true;
    expect(addParam.getCalls()[1].calledWith(5, 'age')).to.be.true;
  });
});
