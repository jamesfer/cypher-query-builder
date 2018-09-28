import { values } from 'lodash';
import { Return, Unwind } from './clauses';
import { ClauseCollection } from './clause-collection';
import { expect } from '../test-setup';

describe('ClauseCollection', () => {
  describe('#addClause', () => {
    it('should add a clause to the internal list', () => {
      const clause = new Return('node');
      const collection = new ClauseCollection();

      collection.addClause(clause);

      expect(collection.getClauses()).includes(clause);
    });

    it('should merge the parameter bag of the clause into its own', () => {
      const numbers = [1, 2, 3];
      const clause = new Unwind(numbers, 'numbers');
      const collection = new ClauseCollection();

      collection.addClause(clause);

      expect(values(collection.getParams())).to.have.members([numbers]);
    });
  });

  describe('#build', () => {
    it('should join all clauses together', () => {
      const collection = new ClauseCollection();
      const unwind = new Unwind([1, 2, 3], 'numbers');
      collection.addClause(unwind);
      const ret = new Return('node');
      collection.addClause(ret);

      expect(collection.build()).to.equal(`${unwind.build()}\n${ret.build()};`);
    });
  });
});
