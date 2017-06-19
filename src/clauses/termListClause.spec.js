const expect = require('chai').expect;
const TermListClause = require('./termListClause.js');
const termListClauseTests = require('./termListClause.tests');

describe('TermListClause', function() {
  termListClauseTests(function() {
    let args = [TermListClause];
    args.push.apply(args, arguments);
    let termList = new (TermListClause.bind.apply(TermListClause, args))();
    return termList.toString();
  }, '');
});
