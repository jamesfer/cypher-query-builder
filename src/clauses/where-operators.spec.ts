import {
  and, WhereAnd, WhereNot, WhereOr,
  WhereXor, xor, not, or,
} from './where-operators';
import { expect } from 'chai';
import { ParameterBag } from '../parameterBag';


describe('WhereAnd', function() {
  it('should combine conditions with AND', function() {
    let op = new WhereAnd({ name: 1, name2: 2, node: { prop: 3 }});
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name AND name2 = $name2 AND node.prop = $prop');
  });

  describe('#and', function() {
    it('should return a WhereAnd instance', function() {
      expect(and({ a: 'b' })).to.be.an.instanceof(WhereAnd);
    });
  });
});

describe('WhereOr', function() {
  it('should combine conditions with OR', function() {
    let op = new WhereOr([{ name: 1 }, { name2: 2 }, { node: { prop: 3 }}]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name OR name2 = $name2 OR node.prop = $prop');
  });

  describe('#or', function() {
    it('should return a WhereOr instance', function() {
      expect(or([{ a: 'b' }])).to.be.an.instanceof(WhereOr);
    });
  });
});

describe('WhereXor', function() {
  it('should combine conditions with XOR', function() {
    let op = new WhereXor([{ name: 1 }, { name2: 2 }, { node: { prop: 3 }}]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('name = $name XOR name2 = $name2 XOR node.prop = $prop');
  });

  describe('#or', function() {
    it('should return a WhereOr instance', function() {
      expect(xor([{ a: 'b' }])).to.be.an.instanceof(WhereXor);
    });
  });
});

describe('WhereNot', function() {
  it('should combine conditions with NOT', function() {
    let op = new WhereNot([{ name: 1, name2: 2 }, { node: { prop: 3 }}]);
    expect(op.evaluate(new ParameterBag()))
      .to.equal('NOT (name = $name AND name2 = $name2 OR node.prop = $prop)');
  });

  describe('#or', function() {
    it('should return a WhereNot instance', function() {
      expect(not({ a: 'b' })).to.be.an.instanceof(WhereNot);
    });
  });
});
