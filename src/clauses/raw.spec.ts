import { expect } from 'chai';
import { values } from 'lodash';
import { Raw } from './raw';

describe('Raw', () => {
  it('should return the same string it is given', () => {
    const query = new Raw('ADD INDEX node.id');
    expect(query.build()).to.equal('ADD INDEX node.id');
  });

  it('should accept parameters', () => {
    const query = new Raw('SET n.id = $id', { id: 3 });
    expect(query.build()).to.equal('SET n.id = $id');
    expect(query.getParams()).to.have.property('id')
      .that.equals(3);
  });

  it('should accept template tag results', () => {
    const tag = (strings: TemplateStringsArray, ...args: any[]) => ({ strings, args });
    const { strings, args } = tag `SET n.id = ${3}`;
    const clause = new Raw(strings, ...args);
    expect(clause.build()).to.match(/^SET n.id = \$[a-zA-Z0-9]+$/);
    expect(values(clause.getParams())).to.have.members([3]);
  });

  it('should throw an error when parameters is not the correct type', () => {
    const makeAny = (): any => 3;
    const makeClause = () => new Raw('SET n.id = $id', makeAny());
    expect(makeClause).to.throw(TypeError, /params should be an object/i);
  });

  it('should throw an error when clause is not the correct type', () => {
    const makeAny = (): any => new Date();
    const makeClause = () => new Raw(makeAny());
    expect(makeClause).to.throw(TypeError, /clause should be a string or an array/i);
  });
});
