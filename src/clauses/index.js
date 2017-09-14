const { construct } = require('../utils');
const Node = require('./node');
const Relation = require('./relation');
const Match = require('./match');
const Create = require('./create');
const Return = require('./return');
const With = require('./with');
const Unwind = require('./unwind');
const Delete = require('./delete');
const Set = require('./set');

module.exports = {
  node: construct(Node),
  relation: construct(Relation),
  match: construct(Match),
  create: construct(Create),
  return: construct(Return),
  with: construct(With),
  unwind: construct(Unwind),
  delete: construct(Delete),
  set: construct(Set),
};
