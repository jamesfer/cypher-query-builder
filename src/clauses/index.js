const { construct } = require('../utils');
const Node = require('./node');
const Relation = require('./relation');
const Match = require('./match');
const Create = require('./create');
const Return = require('./return');

module.exports = {
  node: construct(Node),
  relation: construct(Relation),
  match: construct(Match),
  create: construct(Create),
  return: construct(Return),
};
