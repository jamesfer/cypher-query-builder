const expect = require('chai').expect;
const termListClauseTests = require('./termListStatement.tests');

module.exports = function(makeReturn) {
  termListClauseTests(makeReturn, 'RETURN ');
};
