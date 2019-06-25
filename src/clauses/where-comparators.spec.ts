import { Dictionary } from 'lodash';
import { expect } from 'chai';
import {
  between, Comparator,
  contains, endsWith, equals, exists, greaterEqualTo, greaterThan, hasLabel,
  inArray,
  isNull, lessEqualTo, lessThan, regexp, startsWith,
} from './where-comparators';
import { ParameterBag } from '../parameter-bag';

describe('Where Comparators', () => {
  let bag: ParameterBag;

  beforeEach(() => {
    bag = new ParameterBag();
  });

  const simpleOperators: Dictionary<(value: any, variable?: boolean) => Comparator> = {
    equals,
    greaterThan,
    greaterEqualTo,
    lessThan,
    lessEqualTo,
    startsWith,
    endsWith,
    contains,
    inArray,
  };

  const opSymbols: Dictionary<string> = {
    equals: '=',
    greaterThan: '>',
    greaterEqualTo: '>=',
    lessThan: '<',
    lessEqualTo: '<=',
    startsWith: 'STARTS WITH',
    endsWith: 'ENDS WITH',
    contains: 'CONTAINS',
    inArray: 'IN',
  };

  for (const name in simpleOperators) {
    describe(name, () => {
      it('should perform a comparision', () => {
        const clause = simpleOperators[name]('value')(bag, 'name');
        expect(clause).to.equal(`name ${opSymbols[name]} $name`);
        expect(bag.getParams()).to.have.property('name')
          .that.equals('value');
      });

      it('should support using a cypher variable', () => {
        const clause = simpleOperators[name]('variable', true)(bag, 'name');
        expect(clause).to.equal(`name ${opSymbols[name]} variable`);
        expect(bag.getParams()).to.be.empty;
      });
    });
  }

  describe('regexp', () => {
    it('should perform a case sensitive comparision', () => {
      const clause = regexp('value')(bag, 'name');
      expect(clause).to.equal('name =~ $name');
      expect(bag.getParams()).to.have.property('name')
        .that.equals('value');
    });

    it('should perform a case insensitive comparision', () => {
      const clause = regexp('value', true)(bag, 'name');
      expect(clause).to.equal('name =~ $name');
      expect(bag.getParams()).to.have.property('name')
        .that.equals('(?i)value');
    });

    it('should support using a cypher variable', () => {
      const clause = regexp('variable', false, true)(bag, 'name');
      expect(clause).to.equal('name =~ variable');
      expect(bag.getParams()).to.be.empty;
    });
  });

  describe('exists', () => {
    it('should perform a comparision', () => {
      const clause = exists()(bag, 'name');
      expect(clause).to.equal('exists(name)');
    });
  });

  describe('isNull', () => {
    it('should perform a comparision', () => {
      const clause = isNull()(bag, 'name');
      expect(clause).to.equal('name IS NULL');
    });
  });

  describe('hasLabel', () => {
    it('should perform a comparison', () => {
      const clause = hasLabel('LABEL')(bag, 'name');
      expect(clause).to.equal('name:LABEL');
    });
  });

  describe('between', () => {
    it('should perform multiple comparisons', () => {
      const clauses = between(1, 2)(bag, 'name');
      expect(clauses).to.equal('name >= $lowerName AND name <= $upperName');
    });

    it('should support exclusive comparisons', () => {
      const clauses = between(1, 2, false)(bag, 'name');
      expect(clauses).to.equal('name > $lowerName AND name < $upperName');
    });

    it('should support mixed comparisons', () => {
      let clauses = between(1, 2, true, false)(bag, 'name');
      expect(clauses).to.equal('name >= $lowerName AND name < $upperName');

      bag = new ParameterBag();
      clauses = between(1, 2, false, true)(bag, 'name');
      expect(clauses).to.equal('name > $lowerName AND name <= $upperName');
    });

    it('should support cypher variables', () => {
      const clauses = between('v1', 'v2', false, false, true)(bag, 'name');
      expect(clauses).to.equal('name > v1 AND name < v2');
    });
  });
});
