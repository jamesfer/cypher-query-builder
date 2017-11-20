import { expect } from 'chai';
import {
  between,
  contains, endsWith, equals, exists, greaterEqualTo, greaterThan, hasLabel,
  inArray,
  isNull, lessEqualTo, lessThan, regexp, startsWith,
} from './where-comparators';
import { ParameterBag } from '../parameter-bag';


describe('Where Comparators', function() {
  let bag: ParameterBag;
  beforeEach(function() {
    bag = new ParameterBag();
  });

  let simpleOperators = {
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
  let opSymbols = {
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

  for (let name in simpleOperators) {
    describe(name, function() {
      it('should perform a comparision', function() {
        let clause = simpleOperators[name]('value')(bag, 'name');
        expect(clause).to.equal('name ' + opSymbols[name] + ' $name');
        expect(bag.getParams()).to.have.property('name')
          .that.equals('value');
      });

      it('should support using a cypher variable', function() {
        let clause = simpleOperators[name]('variable', true)(bag, 'name');
        expect(clause).to.equal('name ' + opSymbols[name] + ' variable');
        expect(bag.getParams()).to.be.empty;
      });
    });
  }

  describe('regexp', function() {
    it('should perform a case sensitive comparision', function() {
      let clause = regexp('value')(bag, 'name');
      expect(clause).to.equal('name =~ $name');
      expect(bag.getParams()).to.have.property('name')
        .that.equals('value');
    });

    it('should perform a case insensitive comparision', function() {
      let clause = regexp('value', true)(bag, 'name');
      expect(clause).to.equal('name =~ $name');
      expect(bag.getParams()).to.have.property('name')
        .that.equals('(?i)value');
    });

    it('should support using a cypher variable', function() {
      let clause = regexp('variable', false, true)(bag, 'name');
      expect(clause).to.equal('name =~ variable');
      expect(bag.getParams()).to.be.empty;
    });
  });

  describe('exists', function() {
    it('should perform a comparision', function() {
      let clause = exists()(bag, 'name');
      expect(clause).to.equal('exists(name)');
    });
  });

  describe('isNull', function() {
    it('should perform a comparision', function() {
      let clause = isNull()(bag, 'name');
      expect(clause).to.equal('name IS NULL');
    });
  });

  describe('hasLabel', function() {
    it('should perform a comparison', function() {
      let clause = hasLabel('LABEL')(bag, 'name');
      expect(clause).to.equal('name:LABEL');
    });
  });

  describe('between', function() {
    it('should perform multiple comparisons', function() {
      let clauses = between(1, 2)(bag, 'name');
      expect(clauses).to.be.an('array')
        .with.members([
          'name >= $lowerName',
          'name <= $upperName',
        ]);
    });

    it('should support exclusive comparisons', function() {
      let clauses = between(1, 2, false)(bag, 'name');
      expect(clauses).to.be.an('array')
        .with.members([
        'name > $lowerName',
        'name < $upperName',
      ]);
    });

    it('should support mixed comparisons', function() {
      let clauses = between(1, 2, true, false)(bag, 'name');
      expect(clauses).to.be.an('array')
        .with.members([
        'name >= $lowerName',
        'name < $upperName',
      ]);

      bag = new ParameterBag();
      clauses = between(1, 2, false, true)(bag, 'name');
      expect(clauses).to.be.an('array')
        .with.members([
        'name > $lowerName',
        'name <= $upperName',
      ]);
    });

    it('should support cypher variables', function() {
      let clauses = between('v1', 'v2', false, false, true)(bag, 'name');
      expect(clauses).to.be.an('array')
        .with.members([
        'name > v1',
        'name < v2',
      ]);
    });
  });
});
