const expect = require('chai').expect;
const ParameterContainer = require('./parameterContainer');
const ParameterBag = require('./parameterBag');

describe('ParameterContainer', function() {
  describe('#constructor', function() {
    it('should create an empty parameter bag', function() {
      let container = new ParameterContainer();
      expect(container.parameterBag).to.be.ok
        .and.be.an.instanceOf(ParameterBag);
    });
  });

  describe('#useParameterBag', function() {
    it('should store the new bag in the class', function() {
      let bag = new ParameterBag();
      let container = new ParameterContainer();
      expect(container.parameterBag).to.not.equal(bag);
      container.useParameterBag(bag);
      expect(container.parameterBag).to.equal(bag);
    });

    it('should merge properties from the existing bag to the new one', function() {
      let container = new ParameterContainer();
      container.parameterBag.addParam('container value', 'name');

      let bag = new ParameterBag();
      bag.addParam('bag value', 'name');
      container.useParameterBag(bag);

      let params = container.parameterBag.getParams();
      expect(params).to.have.property('name', 'bag value');
      expect(params).to.have.property('name2', 'container value');
    });

    it('should not recreate the Parameter objects', function() {
      let container = new ParameterContainer();
      let param = container.parameterBag.addParam('container value', 'name');

      let bag = new ParameterBag();
      bag.addParam('bag value', 'name');
      container.useParameterBag(bag);

      expect(param.name).to.equal('name2');
      expect(container.parameterBag.parameterMap['name2']).to.equal(param);
    });
  });

  describe('#getParams', function() {
    it('should return the params', function() {
      let container = new ParameterContainer();
      container.parameterBag.addParam('value1', 'string');
      container.parameterBag.addParam(7, 'number');

      let actualParams = container.parameterBag.getParams();
      expect(container.getParams()).to.deep.equal(actualParams);
    });
  });
});
