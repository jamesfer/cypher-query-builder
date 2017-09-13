const expect = require('chai').expect;
const patternClauseTests = require('./patternStatement.tests');

module.exports = function(makeCreateString) {
  patternClauseTests(makeCreateString, 'CREATE ');
}
