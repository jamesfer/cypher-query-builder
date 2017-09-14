const expect = require('chai').expect;
const patternStatementTests = require('./patternStatement.tests');

module.exports = function(makeCreateString) {
  patternStatementTests(makeCreateString, 'CREATE ');
}
