const expect = require('chai').expect;
const TermListClause = require('./termListClause.js');
const termListClauseTests = require('./termListClause.tests');
const { construct } = require('../utils');

describe('TermListClause', function() {
  describe('#build', function() {
    termListClauseTests(construct(TermListClause, s => s.buildQueryObject()), '');
  });
});
