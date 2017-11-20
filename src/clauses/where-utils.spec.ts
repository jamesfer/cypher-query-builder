import { AnyConditions, stringCons } from './where-utils';
import { expect } from 'chai';
import { ParameterBag } from '../parameter-bag';
import { not, xor } from './where-operators';
import { equals, greaterThan } from './where-comparators';

describe('stringifyConditions', function() {
  function stringify(conditions: AnyConditions) {
    return stringCons(new ParameterBag(), conditions);
  }

  it('should convert a simple object', function() {
    expect(stringify({ name: 'value' })).to.equal('name = $name');
  });

  it('should join arrays of values with OR', function() {
    expect(stringify({ name: ['value1', 'value2'] }))
      .to.equal('name = $name OR name = $name2');
  });

  it('should join many conditions with AND', function() {
    expect(stringify({ name: 'value1', name2: 'value2' }))
      .to.equal('name = $name AND name2 = $name2');
  });

  it('should join arrays of conditions with OR', function() {
    expect(stringify([
      { name: 'value' },
      { name2: 'value2' },
    ])).to.equal('name = $name OR name2 = $name2');
  });

  it('should support node conditions', function() {
    expect(stringify({
      node: {
        name: 'value1',
        name2: 'value2',
      },
    })).to.equal('node.name = $name AND node.name2 = $name2');
  });

  it('should join arrays of node conditions with OR', function() {
    expect(stringify({
      node: [
        { name: 'value1' },
        { name: 'value2' },
      ],
    })).to.equal('node.name = $name OR node.name = $name2');
  });

  it('should join arrays of node values with OR', function() {
    expect(stringify({
      node: {
        name: [ 'value1', 'value2' ],
      },
    })).to.equal('node.name = $name OR node.name = $name2');
  });

  it('should join conditions with XOR', function() {
    expect(stringify(xor([{ name: 'value' }, { name2: 'value' }])))
      .to.equal('name = $name XOR name2 = $name2');
  });

  it('should negate conditions with NOT', function() {
    expect(stringify(not([{ name: 'value' }, { name2: 'value' }])))
      .to.equal('NOT (name = $name OR name2 = $name2)');
  });

  it('should preserve order of operations', function() {
    expect(stringify([
      {
        name: 'value',
      },
      {
        name2: 'value',
        name3: [ 'value', 'value' ],
      },
    ])).to.equal('name = $name OR name2 = $name2 AND (name3 = $name3 OR name3 = $name4)');
  });

  it('should support comparators', function() {
    expect(stringify({
      name: equals('value'),
      age: greaterThan(20),
    })).to.equal('name = $name AND age > $age');
  });
});
