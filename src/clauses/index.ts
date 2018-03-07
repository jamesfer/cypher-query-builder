import { Dictionary, Many } from 'lodash';

export { Create } from './create';
export { NodePattern } from './node-pattern';
export { With } from './with';
export { Unwind } from './unwind';
export { Delete } from './delete';
export { Set } from './set';
export { RelationPattern } from './relation-pattern';
export { Match } from './match';
export { Return } from './return';
export { Skip } from './skip';
export { Limit } from './limit';
export { Where } from './where';
export { Raw } from './raw';
export { OrderBy } from './order-by';
export { and, or, xor, not, operators } from './where-operators';
export {
  equals,
  greaterThan,
  greaterEqualTo,
  lessThan,
  lessEqualTo,
  startsWith,
  endsWith,
  contains,
  inArray,
  hasLabel,
  exists,
  between,
  isNull,
  regexp,
  comparisions,
} from './where-comparators';

import { NodePattern } from './node-pattern';
import { RelationPattern } from './relation-pattern';
import { PathLength } from '../utils';

/**
 * Creates a node pattern like `(parent:Person { name: 'Gwenn' })`.
 *
 * All of the arguments are optional and most of the time you can supply only
 * the ones you want, assuming you keep the order the same of course.
 *
 * Use the following signatures as a reference:
 *
 * ```typescript
 * node(conditions: Dictionary<any>)
 * node(labels: string[], conditions?: Dictionary<any>)
 * node(name: string, conditions?: Dictionary<any>)
 * node(name: string, labels?: string | string[], conditions?: Dictionary<any>)
 * ```
 * *Note that labels must be an array when it is the first argument.*
 *
 *
 *
 * Some examples
 *
 * ```typescript
 * node()
 * // ()
 *
 * node('parent')
 * // (parent)
 *
 * node('parent', 'Person')
 * // (parent:Person)
 *
 * node([ 'Person' ])
 * // (:Person)
 *
 * node('parent', [ 'Person', 'Adult' ])
 * // (parent:Person:Adult)
 *
 * node({ name: 'Gwenn' })
 * // ({ name: 'Gwenn' })
 *
 * node('parent', { name: 'Gwenn' })
 * // (parent { name: 'Gwenn' })
 *
 * node([ 'Person' ], { name: 'Gwenn' })
 * // (:Person { name: 'Gwenn' })
 *
 * node('parent', 'Person', { name: 'Gwenn' })
 * // (parent:Person { name: 'Gwenn' })
 * ```
 *
 * For more details on node patterns see the cypher
 * [docs]{@link https://neo4j.com/docs/developer-manual/current/cypher/syntax/patterns/#cypher-pattern-node}
 *
 * @param {_.Many<string> | _.Dictionary<any>} name
 * @param {_.Many<string> | _.Dictionary<any>} labels
 * @param {_.Dictionary<any>} conditions A dictionary of conditions to attach
 * to the node. These are stored as parameters so there is no need to worry
 * about escaping.
 * @returns {NodePattern} An object representing the node pattern.
 */
export function node(
  name?: Many<string> | Dictionary<any>,
  labels?: Many<string> | Dictionary<any>,
  conditions?: Dictionary<any>,
) {
  return new NodePattern(name, labels, conditions);
}

/**
 * Creates a relation pattern like `-[rel:FriendsWith { active: true }]->`.
 *
 * All of the arguments except the direction are optional and most of the time
 * you can supply only the ones you want, assuming you keep the order the same
 * of course.
 *
 * Use the following signatures as a reference:
 *
 * ```typescript
 * relation(dir: 'in' | 'out' | 'either', conditions: Dictionary<any>)
 * relation(dir: 'in' | 'out' | 'either', labels: string[], conditions?: Dictionary<any>)
 * relation(dir: 'in' | 'out' | 'either', name: string, conditions?: Dictionary<any>)
 * relation(dir: 'in' | 'out' | 'either', name: string, labels?: string | string[], conditions?: Dictionary<any>, length: number | number[] | '*')
 * ```
 * *Note that labels must be an array when it is the first argument after dir.*
 *
 *
 *
 * Some examples
 *
 * ```typescript
 * relation('either')
 * //  -[]-
 *
 * relation('out', 'rel')
 * //  -[rel]->
 *
 * relation('out', 'rel', 'FriendsWith')
 * //  -[rel:FriendsWith]->
 *
 * relation('in', [ 'FriendsWith', 'RelatedTo' ])
 * // <-[:FriendsWith|RelatedTo]-
 * // Note that this will match a relation with either the FriendsWith label or
 * // the RelatedTo label. You cannot use this syntax when creating relations.
 *
 * relation('in', { active: true })
 * // <-[{ active: true }]
 *
 * relation('in', 'rel', { active: true })
 * // <-[rel { active: true }]-
 *
 * relation('either', [ 'FriendsWith' ], { active: true })
 * //  -[:FriendsWith { active: true }]-
 *
 * relation('either', 'rel', 'FriendsWith', { active: true }, 3)
 * //  -[rel:FriendsWith*3 { active: true }]-
 *
 * relation('either', 'rel', 'FriendsWith', { active: true }, [ 3 ])
 * //  -[rel:FriendsWith*3.. { active: true }]-
 *
 * relation('either', 'rel', 'FriendsWith', { active: true }, [ 3, 5 ])
 * //  -[rel:FriendsWith*3..5 { active: true }]-
 *
 * relation('either', 'rel', 'FriendsWith', { active: true }, '*')
 * //  -[rel:FriendsWith* { active: true }]-
 * ```
 *
 * For more details on relation patterns see the cypher
 * [docs]{@link https://neo4j.com/docs/developer-manual/current/cypher/syntax/patterns/#cypher-pattern-relationship}.
 *
 * @param dir Direction of the relation. `in` means to the left, `out` means to
 * the right and `either` means no direction.
 * @param {_.Many<string> | _.Dictionary<any>} name
 * @param {_.Many<string> | _.Dictionary<any>} labels
 * @param {_.Dictionary<any>} conditions
 * @param length Length of the relation for flexible length paths. Can be the
 * string `'*'` to represent any length, a single number `3` to represent the
 * maximum length of the path, or an array of two numbers which represent the
 * minimum and maximum length of the path. When passing an array, the second
 * number is optional, see the examples above.
 * @returns {RelationPattern} An object representing the relation pattern.
 */
export function relation(
  dir: 'in' | 'out' | 'either',
  name?: Many<string> | Dictionary<any>,
  labels?: Many<string> | Dictionary<any>,
  conditions?: Dictionary<any>,
  length?: PathLength
) {
  return new RelationPattern(dir, name, labels, conditions, length);
}
