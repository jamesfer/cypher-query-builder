const expect = require('chai').expect;
const termListClauseTests = require('./termListClause.tests');

module.exports = function(makeReturn) {
  termListClauseTests(makeReturn, 'RETURN ');
};
