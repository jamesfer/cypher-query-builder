import { Create } from './create';
import { Node } from './node';
import { With } from './with';
import { Unwind } from './unwind';
import { Delete } from './delete';
import { Set } from './set';
import { construct } from '../utils';
import { Relation } from './relation';
import { Match } from './match';
import { Return } from './return';

export const clauses = {
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
