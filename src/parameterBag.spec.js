const _ = require('lodash');
const expect = require('chai').expect;
const ParameterBag = require('./parameterBag');

describe('ParameterBag', function() {
  let parameterBag;

  beforeEach(function() {
    parameterBag = new ParameterBag();
  });

  describe('#getName', function() {
    it('should return unique names', function() {
      let names = [];
      for (let i = 0; i < 10; i++) {
        let name = parameterBag.getName();
        expect(names).to.not.contain(name);
        names.push(name);
      }
    });
  });

  describe('#getParams', function() {
    it('should return an empty object for new statements', function() {
      expect(parameterBag.getParams()).to.be.empty;
    });

    it('should return an object of parameters', function() {
      parameterBag.addParam('a', 'a');
      parameterBag.addParam('b', 'b');
      expect(parameterBag.getParams()).to.eql({
        a: 'a',
        b: 'b'
      });
    });

    it('should automatically generate a unique name if one is not provided', function() {
      parameterBag.addParam('hello');
      parameterBag.addParam('world');
      let paramObj = parameterBag.getParams();
      expect(_.keys(paramObj)).to.have.length(2);
      expect(_.values(paramObj)).to.contain('hello');
      expect(_.values(paramObj)).to.contain('world');
    });
  });

  describe('#addParam', function() {
    it('should create and add a parameter to the bag', function() {
      let param = parameterBag.addParam('value', 'name');
      expect(param.name).to.equal('name');
      expect(param.value).to.equal('value');
      expect(parameterBag.getParams()).to.have.property('name', 'value');
    });

    it('should generate a name if one is not given', function() {
      parameterBag.addParam('value');
      expect(_.values(parameterBag.getParams())).to.contain('value');
    });

    it.skip('should rename the parameter if the given name is taken', function() {
      parameterBag.addParam('value', 'name');
      parameterBag.addParam('value2', 'name');
      let paramObj = parameterBag.getParams();
      expect(_.keys(paramObj)).to.have.length(2);
      expect(_.values(paramObj)).to.contain('value');
      expect(_.values(paramObj)).to.contain('value2');
    });
  });
});
