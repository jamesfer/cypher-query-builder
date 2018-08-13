import { Where } from './where';
import { expect } from 'chai';
import { between, greaterThan, lessThan } from './where-comparators';
import { and, not, or, xor } from './where-operators';

describe('Where', () => {
  describe('#build', () => {
    it('should start with WHERE', () => {
      const query = new Where({ name: 'value' });
      expect(query.build()).to.equal('WHERE name = $name');
    });

    it('should compile with a comparator', () => {
      const query = new Where({ age: between(18, 65) });
      expect(query.build()).to.equal('WHERE age >= $lowerAge AND age <= $upperAge');
      expect(query.getParams()).to.deep.equal({
        lowerAge: 18,
        upperAge: 65,
      });
    });

    it('should allow shorthand comparators', () => {
      const query = new Where({
        age: [lessThan(18), greaterThan(45)],
      });
      expect(query.build()).to.equal('WHERE age < $age OR age > $age2');
      expect(query.getParams()).to.deep.equal({
        age: 18,
        age2: 45,
      });
    });

    it('should allow you to nest conditions', () => {
      const query = new Where(and(
        { name: 'steve' },
        xor(
          { age: greaterThan(18) },
          { manager: true },
        ),
        or(
          { active: false },
          { newMember: not(true) },
        ),
      ));
      expect(query.build()).to.equal('WHERE name = $name AND (age > $age XOR manager = $manager) '
        + 'AND (active = $active OR NOT newMember = $newMember)');
      expect(query.getParams()).to.deep.equal({
        name: 'steve',
        age: 18,
        manager: true,
        active: false,
        newMember: true,
      });
    });
  });
});
