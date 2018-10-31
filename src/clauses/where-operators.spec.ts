import {
  and, WhereAnd, WhereNot, WhereOr,
  WhereXor, xor, not, or,
} from './where-operators';
import { expect } from 'chai';
import { ParameterBag } from '../parameter-bag';

describe('WhereAnd', () => {
  it('should combine conditions with AND', () => {
    const op = new WhereAnd({ name: 1, name2: 2, node: { prop: 3 } });
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name AND name2 = $name2 AND node.prop = $prop');
  });

  describe('#and', () => {
    it('should return a WhereAnd instance', () => {
      expect(and({ a: 'b' })).to.be.an.instanceof(WhereAnd);
    });
  });
});

describe('WhereOr', () => {
  it('should combine conditions with OR', () => {
    const op = new WhereOr([{ name: 1 }, { name2: 2 }, { node: { prop: 3 } }]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name OR name2 = $name2 OR node.prop = $prop');
  });

  describe('#or', () => {
    it('should return a WhereOr instance', () => {
      expect(or([{ a: 'b' }])).to.be.an.instanceof(WhereOr);
    });
  });
});

describe('WhereXor', () => {
  it('should combine conditions with XOR', () => {
    const op = new WhereXor([{ name: 1 }, { name2: 2 }, { node: { prop: 3 } }]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name XOR name2 = $name2 XOR node.prop = $prop');
  });

  describe('#or', () => {
    it('should return a WhereOr instance', () => {
      expect(xor([{ a: 'b' }])).to.be.an.instanceof(WhereXor);
    });
  });
});

describe('WhereNot', () => {
  it('should combine conditions with NOT', () => {
    const op = new WhereNot([{ name: 1, name2: 2 }, { node: { prop: 3 } }]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('NOT (name = $name AND name2 = $name2 OR node.prop = $prop)');
  });

  describe('#or', () => {
    it('should return a WhereNot instance', () => {
      expect(not({ a: 'b' })).to.be.an.instanceof(WhereNot);
    });
  });
});
