import {
  and, xor, not, or,
} from './where-operators';
import { expect } from 'chai';
import { ParameterBag } from '../parameter-bag';
import { greaterEqualTo, lessThan } from './where-comparators';

describe('Where Operators', () => {
  describe('AND', () => {
    it('should combine conditions with AND', () => {
      const op = and({ name: 1, name2: 2, node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name AND name2 = $name2 AND node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should accept a spread of conditions', () => {
      const op = and({ name: 1, name2: 2 }, { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name AND name2 = $name2 AND node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should accept a single array of conditions', () => {
      const op = and([{ name: 1, name2: 2 }, { node: { prop: 3 } }]);
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name AND name2 = $name2 AND node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should convert multiple arrays to or', () => {
      const op = and([{ name: 1 }, { name2: 2 }], { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('(name = $name OR name2 = $name2) AND node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should be nestable', () => {
      const op = and(
        { name: 'steve' },
        [
          and({ age: lessThan(18) }, { guardian: true }),
          { age: greaterEqualTo(18) },
        ],
      );
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name AND (age < $age AND guardian = $guardian OR age >= $age2)');
      expect(bag.getParams()).to.deep.equal({
        name: 'steve',
        age: 18,
        guardian: true,
        age2: 18,
      });
    });
  });

  describe('OR', () => {
    it('should accept a spread of conditions', () => {
      const op = or({ name: 1 }, { name2: 2 }, { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name OR name2 = $name2 OR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should accept a single array of conditions', () => {
      const op = or([{ name: 1 }, { name2: 2 }, { node: { prop: 3 } }]);
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name OR name2 = $name2 OR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should convert multiple arrays to or', () => {
      const op = or([{ name: 1 }, { name2: 2 }], { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name OR name2 = $name2 OR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should be nestable', () => {
      const op = and({
        ticket: true,
        person: or({ age: greaterEqualTo(18) }, { guardian: true }),
      });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('ticket = $ticket AND (person.age >= $age OR person.guardian = $guardian)');
      expect(bag.getParams()).to.deep.equal({
        ticket: true,
        age: 18,
        guardian: true,
      });
    });
  });

  describe('XOR', () => {
    it('should accept a spread of conditions', () => {
      const op = xor({ name: 1 }, { name2: 2 }, { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name XOR name2 = $name2 XOR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should accept a single array of conditions', () => {
      const op = xor([{ name: 1 }, { name2: 2 }, { node: { prop: 3 } }]);
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('name = $name XOR name2 = $name2 XOR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should convert multiple arrays to or', () => {
      const op = xor([{ name: 1 }, { name2: 2 }], { node: { prop: 3 } });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('(name = $name OR name2 = $name2) XOR node.prop = $prop');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should be nestable', () => {
      const op = and({
        ticket: true,
        person: xor({ age: greaterEqualTo(18) }, { guardian: true }),
      });
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('ticket = $ticket AND (person.age >= $age XOR person.guardian = $guardian)');
      expect(bag.getParams()).to.deep.equal({
        ticket: true,
        age: 18,
        guardian: true,
      });
    });
  });

  describe('NOT', () => {
    it('should prepend not to a condition', () => {
      const op = not({ name: 1 });
      const bag = new ParameterBag();
      expect(op.evaluate(bag)).to.equal('NOT name = $name');
      expect(bag.getParams()).to.deep.equal({ name: 1 });
    });

    it('should wrap multiple args', () => {
      const op = not([{ name: 1, name2: 2 }, { node: { prop: 3 } }]);
      const bag = new ParameterBag();
      expect(op.evaluate(bag))
        .to.equal('NOT (name = $name AND name2 = $name2 OR node.prop = $prop)');
      expect(bag.getParams()).to.deep.equal({
        name: 1,
        name2: 2,
        prop: 3,
      });
    });

    it('should be nestable', () => {
      const op = and(
        not({
          ticket: or(
            { expired: true },
            { used: true },
          ),
        }),
        {
          person: {
            age: not(lessThan(18)),
          },
        },
      );
      const bag = new ParameterBag();
      expect(op.evaluate(bag)).to
        .equal('NOT (ticket.expired = $expired OR ticket.used = $used) AND NOT person.age < $age');
      expect(bag.getParams()).to.deep.equal({
        expired: true,
        used: true,
        age: 18,
      });
    });
  });
});
