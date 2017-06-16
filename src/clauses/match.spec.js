const expect = require('chai').expect;
const Match = require('./match');
const matchTests = require('./match.tests');

describe('Match#toString', function() {
  matchTests(function() {
    let args = [Match];
    args.push.apply(args, arguments);
    let match = new (Match.bind.apply(Match, args))();
    return match.toString();
  });
});
