const expect = require('chai').expect;
const patternClauseTests = require('./patternClause.tests');

module.exports = function(makeCreateString) {
  patternClauseTests(makeCreateString, 'CREATE ');
}
