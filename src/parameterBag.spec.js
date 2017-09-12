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
      parameterBag.addParam('1', 'name');
      parameterBag.addParam('2', 'name2');
      parameterBag.addParam('3', 'name3');
      expect(parameterBag.getName()).to.equal('p');
      expect(parameterBag.getName('name')).to.equal('name4');
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
      let paramName = parameterBag.addParam('value', 'name');
      expect(paramName).to.equal('name');
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
