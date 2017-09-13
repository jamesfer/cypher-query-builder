const expect = require('chai').expect;
const TermListClause = require('./termListStatement.js');
const termListClauseTests = require('./termListStatement.tests');
const { construct } = require('../utils');

describe('TermListStatement', function() {
  describe('#build', function() {
    termListClauseTests(construct(TermListClause, s => s.buildQueryObject()), '');
  });
});
