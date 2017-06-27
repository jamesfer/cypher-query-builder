const _ = require('lodash');
const expect = require('chai').expect;
const ParameterBag = require('./parameterBag');

describe.skip('ParameterBag', function() {
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

  describe('#setParent', function() {
    it('should set the parent property on the parameterBag', function() {
      expect(parameterBag.parent).to.be.null;
      let parent = new ParameterBag();
      parameterBag.setParent(parent);
      expect(parameterBag.parent).to.equal(parent);
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
      parameterBag.addParam('value', 'name');
      expect(parameterBag.getParams()).to.have.property('name', 'value');
    });

    it('should generate a name if one is not given', function() {
      parameterBag.addParam('value');
      expect(_.values(parameterBag.getParams())).to.contain('value');
    });

    it('should add a parameter to its parent if it has one', function() {
      let parent = new ParameterBag();
      parameterBag.setParent(parent);
      parameterBag.addParam('value', 'name');
      expect(parent.getParams()).to.have.property('name', 'value');
    });

    it('should rename the parameter if the given name is taken', function() {
      parameterBag.addParam('value', 'name');
      parameterBag.addParam('value2', 'name');
      let paramObj = parameterBag.getParams();
      expect(_.keys(paramObj)).to.have.length(2);
      expect(_.values(paramObj)).to.contain('value');
      expect(_.values(paramObj)).to.contain('value2');
    });
  });

  describe('#addExistingParam', function() {
    it('should add the param to the internal list', function() {
      let param = new ParameterBag.Parameter('a', 'b');
      parameterBag.addExistingParam(param);
      expect(parameterBag.getParams()).to.have.property('a', 'b');
    });

    it('should rename the param if it is a duplicate', function() {
      let param1 = new ParameterBag.Parameter('a', 'b');
      parameterBag.addExistingParam(param1);
      let param2 = new ParameterBag.Parameter('a', 'd');
      parameterBag.addExistingParam(param2);
      let paramObj = parameterBag.getParams();
      expect(paramObj).to.have.property('a', 'b');
      expect(_.keys(paramObj)).to.have.length(2);
    });

    it('should add it to the parent bag if there is one', function() {
      let parent = new ParameterBag();
      parameterBag.setParent(parent);
      let param = new ParameterBag.Parameter('a', 'b');
      parameterBag.addExistingParam(param);
      expect(parent.getParams()).to.have.property('a', 'b');
    });
  });
});
