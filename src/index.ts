import { Connection } from './connection';
import { clauses } from './clauses';
import { Query } from './query';

module.exports = Object.assign({
  Connection,
  Query,
}, clauses);
