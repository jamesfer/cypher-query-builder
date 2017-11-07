// import { Create as CreateClass } from './create';
// import { Node as NodeClass } from './node';
// import { With as WithClass } from './with';
// import { Unwind as UnwindClass} from './unwind';
// import { Delete as DeleteClass } from './delete';
// import { Set as SetClass } from './set';
// import { construct } from '../utils';
// import { Relation as RelationClass } from './relation';
// import { Match as MatchClass } from './match';
// import { Return as ReturnClass } from './return';
//
// export const Node = construct(NodeClass);
// export const Relation = construct(RelationClass);
// export const Match = construct(MatchClass);
// export const Create = construct(CreateClass);
// export const Return = construct(ReturnClass);
// export const With = construct(WithClass);
// export const Unwind = construct(UnwindClass);
// export const Delete = construct(DeleteClass);
// export const Set = construct(SetClass);



export { Create } from './create';
export { NodePattern } from './node-pattern';
export { With } from './with';
export { Unwind } from './unwind';
export { Delete } from './delete';
export { Set } from './set';
export { RelationPattern } from './relation-pattern';
export { Match } from './match';
export { Return } from './return';

import { NodePattern } from './node-pattern';
import { RelationPattern } from './relation-pattern';
import { PathLength } from '../utils';

export function node(
  name: string,
  labels: string | string[] = [],
  conditions = {}
) {
  return new NodePattern(name, labels, conditions);
}

export function relation(
  dir: 'in' | 'out' | 'either',
  name: string = '',
  labels: string | string[] = [],
  conditions = {},
  length?: PathLength
) {
  return new RelationPattern(dir, name, labels, conditions, length);
}
