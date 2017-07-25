const Create = require('./create');
const createTests = require('./create.tests');
const { construct } = require('../utils');

describe('Create', function() {
  describe('#build', function() {
    createTests(construct(Create, s => s.buildQueryObject()));
  });
});
