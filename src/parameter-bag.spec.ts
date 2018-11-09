import { keys, values } from 'lodash';
import { ParameterBag } from './parameter-bag';
import { expect } from '../test-setup';

describe('ParameterBag', () => {
  let parameterBag: ParameterBag;

  beforeEach(() => {
    parameterBag = new ParameterBag();
  });

  describe('#getName', () => {
    it('should return unique names', () => {
      parameterBag.addParam('1', 'name');
      parameterBag.addParam('2', 'name2');
      parameterBag.addParam('3', 'name3');
      expect(parameterBag.getName()).to.equal('p');
      expect(parameterBag.getName('name')).to.equal('name4');
    });
  });

  describe('#getParams', () => {
    it('should return an empty object for new clauses', () => {
      expect(parameterBag.getParams()).to.be.empty;
    });

    it('should return an object of parameters', () => {
      parameterBag.addParam('a', 'a');
      parameterBag.addParam('b', 'b');
      expect(parameterBag.getParams()).to.eql({
        a: 'a',
        b: 'b',
      });
    });

    it('should automatically generate a unique name if one is not provided', () => {
      parameterBag.addParam('hello');
      parameterBag.addParam('world');
      const paramObj = parameterBag.getParams();
      expect(keys(paramObj)).to.have.length(2);
      expect(values(paramObj)).to.contain('hello');
      expect(values(paramObj)).to.contain('world');
    });
  });

  describe('#addParam', () => {
    it('should create and add a parameter to the bag', () => {
      const param = parameterBag.addParam('value', 'name');
      expect(param.name).to.equal('name');
      expect(param.value).to.equal('value');
      expect(parameterBag.getParams()).to.have.property('name', 'value');
    });

    it('should generate a name if one is not given', () => {
      parameterBag.addParam('value');
      expect(values(parameterBag.getParams())).to.contain('value');
    });

    it.skip('should rename the parameter if the given name is taken', () => {
      parameterBag.addParam('value', 'name');
      parameterBag.addParam('value2', 'name');
      const paramObj = parameterBag.getParams();
      expect(keys(paramObj)).to.have.length(2);
      expect(values(paramObj)).to.contain('value');
      expect(values(paramObj)).to.contain('value2');
    });
  });
});
