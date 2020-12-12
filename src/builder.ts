import { Dictionary, Many, assign } from 'lodash';
import {
  Limit, Match, NodePattern, Skip, Where, Set, Create,
  Return, With, Unwind, Delete, Raw, OrderBy, Merge, OnCreate, OnMatch,
  Remove,
} from './clauses';
import { CreateOptions } from './clauses/create';
import { DeleteOptions } from './clauses/delete';
import { MatchOptions } from './clauses/match';
import { Direction, OrderConstraint, OrderConstraints } from './clauses/order-by';
import { PatternCollection } from './clauses/pattern-clause';
import { SetOptions, SetProperties } from './clauses/set';
import { Term } from './clauses/term-list-clause';
import { AnyConditions } from './clauses/where-utils';
import { Clause } from './clause';
import { RemoveProperties } from './clauses/remove';
import { Union } from './clauses/union';
import { ReturnOptions } from './clauses/return';

/**
 * @internal
 */
export interface WrapperClause {
  new (clause: Set): Clause;
}

/**
 * @internal
 */
export class SetBlock<Q> {
  constructor(protected chain: (clause: Clause) => Q, protected wrapper?: WrapperClause) { }

  /**
   * Adds a [set]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/set}
   * clause to the query.
   *
   * `set` lets you updates a nodes labels and properties in one clause. Most of
   * the time it will be easier to use one of the variants such as `setLabels`,
   * `setValues` or `setVariables`.
   *
   * This function accepts three different kind of properties, each of which is
   * described in more detail in the variants.
   *
   * ```
   * query.set({
   *   labels: {
   *     sale: 'Active',
   *   },
   *   variables: {
   *     sale: {
   *       activatedAt: 'timestamp()',
   *     },
   *   },
   *   values: {
   *     sale: {
   *       activatedBy: user.id,
   *     },
   *   },
   * })
   * // SET sale:Active, sale.activatedAt = timestamp(), sale.activatedBy = $userId
   * ```
   *
   * `set` also accepts an options object which currently only contains a
   * single setting: `override`. Override controls whether the `=` or `+=`
   * operator is used in the set clause. `true` causes the existing object to be
   * cleared and replaced by the new object. `false` on the other hand will
   * merge the existing and new objects together, with new properties replacing
   * the ones on the existing object.
   * The default value of override is a little inconsistent and it will be
   * improved in the next major version. If you don't pass any settings object,
   * override will default to `true`. If you pass an options object without an
   * `override` key, override will be `false`. In future versions, override will
   * always default to `false` to be more consistent with `setVariables` and
   * `setValues`.
   *
   * @param {SetProperties} properties
   * @param {SetOptions} options
   * @returns {Q}
   */
  set(properties: SetProperties, options?: SetOptions) {
    return this.chain(this.wrap(new Set(properties, options)));
  }

  /**
   * Adds labels to a node using a [set]{@link
    * https://neo4j.com/docs/developer-manual/current/cypher/clauses/set}
   * clause.
   *
   * ```
   * query.setLabels({
   *   sale: 'Active',
   * })
   * // SET sale:Active
   * ```
   *
   * `setLabels` accepts a dictionary where the keys are nodes to be updated
   * and the value is a single label or an array of labels to add to the node.
   *
   * @param {_.Dictionary<_.Many<string>>} labels
   * @returns {Q}
   */
  setLabels(labels: Dictionary<Many<string>>) {
    return this.chain(this.wrap(new Set({ labels })));
  }

  /**
   * Updates a node from parameters using a [set]{@link
    * https://neo4j.com/docs/developer-manual/current/cypher/clauses/set}
   * clause. This function treats all values as parameters which is different to
   * `setVariables` which assumes values are cypher variables.
   *
   * ```
   * query.setValues({
   *   'sale.activatedBy': user.id,
   * })
   * // SET sale.activatedBy += $userId
   * ```
   *
   * `setValues` accepts a dictionary where the keys are nodes or property names
   * to be updated.
   *
   * To use the `+=` operator to merge properties of a node, you can pass
   * `true` to the merge option.
   * ```
   * query.setValues({
   *   'sale': { active: true },
   * }, true)
   * // SET sale += $sale
   * ```
   */
  setValues(values: Dictionary<any>, merge?: boolean) {
    return this.chain(this.wrap(new Set({ values }, { merge })));
  }

  /**
   * Updates a node from a variable that was previously declared in the query
   * using a [set]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/set}
   * clause. This function only accepts strings as its values which are not
   * escaped in any way so beware. If you want to store some user supplied
   * information in the database, `setValues` is the function you want.
   *
   * ```
   * query.setVariables({
   *   'sale.activatedAt': 'timestamp()',
   * })
   * // SET sale.activatedAt = timestamp()
   * ```
   * Note how values are inserted into the query, as is.
   *
   * To use the `+=` operator to merge properties of a node, you can pass
   * `true` to the merge option.
   * ```
   * query.setVariables({
   *   'sale': 'newSaleDetails'
   * }, true)
   * // SET sale += newSaleDetails
   * ```
   */
  setVariables(variables: Dictionary<string | Dictionary<string>>, merge?: boolean) {
    return this.chain(this.wrap(new Set({ variables }, { merge })));
  }

  private wrap(clause: Set): Clause {
    return this.wrapper ? new this.wrapper(clause) : clause;
  }
}

/**
 * Root class for all query chains, namely the {@link Connection} and
 * {@link Query} classes.
 * @internal
 */
export abstract class Builder<Q> extends SetBlock<Q> {
  protected constructor() {
    super(c => this.continueChainClause(c));
  }

  /**
   * Used to add an `ON CREATE` clause to the query. Any following query will be prefixed with
   * `ON CREATE`.
   *
   * Example:
   * ```javascript
   * query.onCreate.setLabels({ node: 'Active' });
   * // ON CREATE SET node:Active

   * query.onCreate.setVariables({ 'node.createdAt': 'timestamp()' });
   * // ON CREATE SET node.createdAt = timestamp()
   * ````
   *
   * The only methods that are available after `onCreate` are the set family of clauses.
   */
  onCreate = new SetBlock<Q>(this.continueChainClause.bind(this), OnCreate);

  /**
   * Used to add an `ON MATCH` clause to the query. Any following query will be prefixed with
   * `ON MATCH`.
   *
   * Example:
   * ```javascript
   * query.onMatch.setLabels({ node: 'Active' });
   * // ON MATCH SET node:Active

   * query.onMatch.setVariables({ 'node.updatedAt': 'timestamp()' });
   * // ON MATCH SET node.createdAt = timestamp()
   * ````
   *
   * The only methods that are available after `onMatch` are the set family of clauses.
   */
  onMatch = new SetBlock<Q>(this.continueChainClause.bind(this), OnMatch);

  /**
   * Adds a clause to the current chain and returns something that can be
   * chained with more clauses.
   * @param {Clause} clause
   * @returns {Q}
   */
  protected abstract continueChainClause(clause: Clause): Q;

  /**
   * Adds a [create]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/create}
   * clause to the query.
   *
   * Create accepts a single pattern, a list of patterns or a list of a list of
   * patterns. Each pattern represents a single part of a cypher pattern. For
   * example: `(people:Person { age: 30 })` would be a node pattern and
   * `-[:FriendsWith]->` would be a relationship pattern.
   *
   * If an array of patterns is provided, they are joined together to form a
   * composite pattern. For example:
   * ```javascript
   * query.create([
   *   node('people', 'Person', { age: 30 }),
   *   relation('out', '', 'FriendsWith'),
   *   node('friend', 'Friend'),
   * ])
   * ```
   *
   * Would equate to the cypher pattern
   * ```
   * CREATE (people:Person { age: 30 })-[:FriendsWith]->(friend:Friend)
   * ```
   *
   * The create method also accepts a `unique` option which will cause a `CREATE UNIQUE` clause to
   * be emitted instead.
   * ```javascript
   * query.create([node('people', 'Person', { age: 30 })], { unique: true });
   * // CREATE UNIQUE (people:Person { age: 30 })
   * ```
   */
  create(patterns: PatternCollection, options?: CreateOptions) {
    return this.continueChainClause(new Create(patterns, options));
  }

  /**
   * Shorthand for `create(patterns, { unique: true })`
   */
  createUnique(patterns: PatternCollection) {
    return this.create(patterns, { unique: true });
  }

  /**
   * Shorthand for `create(node(name, labels, conditions), options)`. For more details
   * the arguments see @{link node}.
   */
  createNode(
    name: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
    options?: CreateOptions,
  ) {
    const clause = new Create(new NodePattern(name, labels, conditions), options);
    return this.continueChainClause(clause);
  }

  /**
   * Shorthand for `createNode(name, labels, conditions, { unique: true })`
   */
  createUniqueNode(
    name: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
  ) {
    return this.createNode(name, labels, conditions, { unique: true });
  }

  /**
   * Adds a [delete]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/delete}
   * clause to the query.
   *
   * Delete accepts a single string or an array of them and all of them are
   * joined together with commas. *Note that these strings are not escaped or
   * passed to Neo4j using parameters, therefore you should not pass user
   * input into this clause without escaping it first*.
   *
   * You can set `detach: true` in the options to make it a `DETACH DELETE`
   * clause.
   *
   * @param {_.Many<string>} terms
   * @param {DeleteOptions} options
   * @returns {Q}
   */
  delete(terms: Many<string>, options?: DeleteOptions) {
    return this.continueChainClause(new Delete(terms, options));
  }

  /**
   * Shorthand for `delete(terms, { detach: true })`.
   *
   * @param {_.Many<string>} terms
   * @param {DeleteOptions} options
   * @returns {Q}
   */
  detachDelete(terms: Many<string>, options: DeleteOptions = {}) {
    return this.continueChainClause(new Delete(terms, assign(options, {
      detach: true,
    })));
  }

  /**
   * Adds a [limit]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/limit}
   * clause to the query.
   *
   * @param {string | number} amount
   * @returns {Q}
   */
  limit(amount: number) {
    return this.continueChainClause(new Limit(amount));
  }

  /**
   * Adds a [match]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/match}
   * clause to the query.
   *
   * Match accepts a single pattern, a list of patterns or a list of a list of
   * patterns. Each pattern represents a single part of a cypher pattern. For
   * example: `(people:Person { age: 30 })` would be a node pattern and
   * `-[:FriendsWith]->` would be a relationship pattern.
   *
   * If an array of patterns is provided, they are joined together to form a
   * composite pattern. For example:
   * ```javascript
   * query.match([
   *   node('people', 'Person', { age: 30 }),
   *   relation('out', '', 'FriendsWith'),
   *   node('friends'),
   * ])
   * ```
   *
   * Would equate to the cypher pattern
   * ```
   * MATCH (people:Person { age: 30 })-[:FriendsWith]->(friends)
   * ```
   *
   * If an array of an array of patterns is provided each array is joined
   * together like above, and then each composite pattern is joined with a comma
   * to allow matching of multiple distinct patterns. Note: matching many
   * distinct patterns will produce a cross product of the results as noted in
   * the [cypher docs]{@link
   * https://neo4j.com/developer/kb/cross-product-cypher-queries-will-not-perform-well/}.
   *
   * You can also provide `optional: true` in the options to create and
   * `OPTIONAL MATCH` clause.
   *
   * @param {PatternCollection} patterns List of patterns to be matched.
   * @param {MatchOptions} options
   * @returns {Q}
   */
  match(patterns: PatternCollection, options?: MatchOptions) {
    return this.continueChainClause(new Match(patterns, options));
  }

  /**
   * Shorthand for `match(node(name, labels, conditions))`. For more details on
   * the arguments see {@link node}.
   *
   * @param {_.Many<string> | _.Dictionary<any>} name
   * @param {_.Many<string> | _.Dictionary<any>} labels
   * @param {_.Dictionary<any>} conditions
   * @returns {Q}
   */
  matchNode(
    name?: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
  ) {
    const clause = new Match(new NodePattern(name, labels, conditions));
    return this.continueChainClause(clause);
  }

  /**
   * Shorthand for `match(patterns, { optional: true })`.
   *
   * @param {PatternCollection} patterns
   * @param {MatchOptions} options
   * @returns {Q}
   */
  optionalMatch(patterns: PatternCollection, options: MatchOptions = {}) {
    return this.continueChainClause(new Match(patterns, assign(options, {
      optional: true,
    })));
  }

  /**
   * Adds a [merge]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/merge/}
   * clause to the query. It accepts the same parameters as `match` and `create` so refer to them
   * for more information.
   *
   * ```javascript
   * query.merge([
   *   node('user', 'User', { id: 1 }),
   *   relation('out', 'rel', 'OwnsProject'),
   *   node('project', 'Project', { id: 20 }),
   * ])
   * .onMatch.setVariables({ 'rel.updatedAt': `timestamp` });
   * // MERGE (user:User { id: 1 })-[rel:OwnsProject]->(project:Project { id: 20 })
   * // ON MATCH SET rel.updatedAt = timestamp()
   * ```
   */
  merge(patterns: PatternCollection) {
    return this.continueChainClause(new Merge(patterns));
  }

  /**
   * Adds an [order by]{@link
   * https://neo4j.com/docs/developer-manual/current/cypher/clauses/order-by}
   * to the query.
   *
   * Pass a single string or an array of strings to order by.
   * ```javascript
   * query.orderBy([
   *   'name',
   *   'occupation',
   * ])
   * // ORDER BY name, occupation
   * ```
   *
   * You can control the sort direction by adding a direction to each property.
   * ```javascript
   * query.orderBy([
   *   ['name', 'DESC'],
   *   'occupation', // Same as ['occupation', 'ASC']
   * ])
   * // ORDER BY name DESC, occupation
   * ```
   *
   * The second parameter is the default search direction for all properties that
   * don't have a direction specified. So the above query could instead be
   * written as:
   * ```javascript
   * query.orderBy([
   *   'name',
   *   ['occupation', 'ASC']
   * ], 'DESC')
   * // ORDER BY name DESC, occupation
   * ```
   *
   * It is also acceptable to pass an object where each key is the
   * property and the value is a direction. Eg:
   * ```javascript
   * query.orderBy({
   *   name: 'DESC',
   *   occupation: 'ASC',
   * })
   * ```
   * However, the underlying iteration order is not always guaranteed and
   * it may cause subtle bugs in your code. It is still accepted but it
   * is recommended that you use the array syntax above.
   *
   * Valid values for directions are `DESC`, `DESCENDING`, `ASC`, `ASCENDING`.
   * `true` and `false` are also accepted (`true` being the same as `DESC` and
   * `false` the same as `ASC`), however they should be avoided as they are
   * quite ambiguous. Directions always default to `ASC` as it does in cypher.
   *
   * @param {_.Many<string> | OrderConstraints} fields
   * @param {Direction} dir
   * @returns {Q}
   */
  orderBy(fields: string | (string | OrderConstraint)[] | OrderConstraints, dir?: Direction) {
    return this.continueChainClause(new OrderBy(fields, dir));
  }

  /**
   * Adds a clause to the query as is. You can also provide an object of params
   * as well.
   *
   * ```javascript
   * query.raw('MATCH (:Event { date: $date }', { date: '2017-01-01' })
   * ```
   *
   * `raw` can also be used as a template tag
   *
   * ```javascript
   * query.matchNode('event', 'Event', { id: 1 })
   *  .raw`SET event.finishedAt = ${Date.now()}`
   * ```
   *
   * But note that using template parameters where they are not supported in a query will produce
   * an malformed query.
   *
   * ```javascript
   * query.raw`SET node.${property} = 'value'`
   * // Invalid query:
   * // SET node.$param1 = 'value'
   * ```
   *
   * @param {string} clause
   * @param args
   * @returns {Q}
   */
  raw(clause: string | TemplateStringsArray, ...args: any[]) {
    return this.continueChainClause(new Raw(clause, ...args));
  }

  /**
   * Adds a [remove]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/remove/}
   * clause to the query.
   *
   * Pass objects containing the list of properties and labels to remove from a node. Each key in an
   * object is the name of a node and the values are the names of the labels and properties to
   * remove. The values of each object can be either a single string, or an array of strings.
   * ```javascript
   * query.remove({
   *   labels: {
   *     coupon: 'Active',
   *   },
   *   properties: {
   *     customer: ['inactive', 'new'],
   *   },
   * });
   * // REMOVE coupon:Active, customer.inactive, customer.new
   * ```
   *
   * Both labels and properties objects are optional, but you must provide at least one of them for
   * the query to be syntatically valid.
   * ```
   * query.remove({
   *
   * });
   * // Invalid query:
   * // REMOVE
   * ```
   *
   * If you only need to remove labels *or* properties, you may find `removeProperties` or
   * `removeLabels` more convenient.
   */
  remove(properties: RemoveProperties) {
    return this.continueChainClause(new Remove(properties));
  }

  /**
   * Adds a [remove]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/remove/}
   * clause to the query.
   *
   * Pass an object containing the list of properties to remove from a node. Each key in the
   * object is the name of a node and the values are the names of the properties to remove. The
   * values can be either a single string, or an array of strings.
   * ```javascript
   * query.remove({
   *   customer: ['inactive', 'new'],
   *   coupon: 'available',
   * });
   * // REMOVE customer.inactive, customer.new, coupon.available
   * ```
   */
  removeProperties(properties: Dictionary<Many<string>>) {
    return this.continueChainClause(new Remove({ properties }));
  }

  /**
   * Adds a [remove]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/remove/}
   * clause to the query.
   *
   * Pass an object containing the list of labels to remove from a node. Each key in the
   * object is the name of a node and the values are the names of the labels to remove. The
   * values can be either a single string, or an array of strings.
   * ```javascript
   * query.remove({
   *   customer: ['Inactive', 'New'],
   *   coupon: 'Available',
   * });
   * // REMOVE customer:Inactive, customer:New, coupon:Available
   * ```
   */
  removeLabels(labels: Dictionary<Many<string>>) {
    return this.continueChainClause(new Remove({ labels }));
  }

  /**
   * Adds a [return]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/return}
   * clause to the query.
   *
   * There are many different ways to pass arguments to `return` so each is
   * documented in turn below.
   *
   * A single string:
   * ```javascript
   * query.return('people')
   * // RETURN people
   * ```
   *
   * An array of strings to return multiple variables:
   * ```javascript
   * query.return([ 'people', 'pets' ])
   * // RETURN people, pets
   * ```
   *
   * A single object to rename variables:
   * ```javascript
   * query.return({ people: 'employees' })
   * // RETURN people AS employees
   * ```
   *
   * A single object with an array for each value:
   * ```javascript
   * query.return({
   *   people: [ 'name', 'age' ],
   *   pets: [ 'name', 'breed' ],
   * })
   * // RETURN people.name, people.age, pets.name, pets.breed
   * ```
   * This gives you a shortcut to specifying many node properties. You can also
   * rename each property by adding an object inside the array or by providing
   * an object as the value:
   * ```javascript
   * query.return({
   *   people: [{ name: 'personName' }, 'age' ],
   * })
   * // RETURN people.name AS personName, people.age
   * ```
   * or
   * ```javascript
   * query.return({
   *   people: {
   *     name: 'personName',
   *     age: 'personAge',
   *   },
   * })
   * // RETURN people.name AS personName, people.age AS personAge
   * ```
   *
   * You can also pass an array of any of the above methods.
   *
   * The return method also accepts a `distinct` option which will cause a `RETURN DISTINCT` clause
   * to be emitted instead.
   * ```javascript
   * query.return('people', { distinct: true })
   * // RETURN DISTINCT people
   * ```
   */
  return(terms: Many<Term>, options?: ReturnOptions) {
    return this.continueChainClause(new Return(terms, options));
  }

  /**
   * Shorthand for `return(terms, { distinct: true });
   */
  returnDistinct(terms: Many<Term>) {
    return this.return(terms, { distinct: true });
  }

  /**
   * Adds a [skip]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/skip}
   * clause to the query.
   *
   * @param {string | number} amount
   * @returns {Q}
   */
  skip(amount: number) {
    return this.continueChainClause(new Skip(amount));
  }

  /**
   * Add a [union]{@link https://neo4j.com/docs/cypher-manual/current/clauses/union/} clause to the
   * query.
   *
   * ```javascript
   * query.matchNode('people', 'People')
   *   .return({ 'people.name': 'name' })
   *   .union()
   *   .matchNode('departments', 'Department')
   *   .return({ 'departments.name': 'name' });
   * // MATCH (people:People)
   * // RETURN people.name AS name
   * // UNION
   * // MATCH (departments:Department)
   * // RETURN departments.name AS name
   * ```
   */
  union(all?: boolean) {
    return this.continueChainClause(new Union(all));
  }

  /**
   * Add a [union all]{@link https://neo4j.com/docs/cypher-manual/current/clauses/union/} clause to
   * the query. Just shorthand for `union(true)`.
   *
   * ```javascript
   * query.matchNode('people', 'People')
   *   .return({ 'people.name': 'name' })
   *   .unionAll()
   *   .matchNode('departments', 'Department')
   *   .return({ 'departments.name': 'name' });
   * // MATCH (people:People)
   * // RETURN people.name AS name
   * // UNION ALL
   * // MATCH (departments:Department)
   * // RETURN departments.name AS name
   * ```
   */
  unionAll() {
    return this.continueChainClause(new Union(true));
  }

  /**
   * Adds an [unwind]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/unwind}
   * clause to the query.
   *
   * @param {any[]} list Any kind of array to unwind in the query
   * @param {string} name Name of the variable to use in the unwinding
   * @returns {Q}
   */
  unwind(list: any[], name: string) {
    return this.continueChainClause(new Unwind(list, name));
  }

  /**
   * Adds a [where]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/where}
   * clause to the query.
   *
   * `where` is probably the most complex clause in this package because of the flexible ways to
   * combine conditions. A handy rule of thumb is when you see an array it becomes an `OR` and when
   * you see a dictionary, it becomes an `AND`. The many different ways of specifying your
   * constraints are listed below.
   *
   * As a simple object, the comparison of each property is just `AND`ed together.
   * ```javascript
   * query.where({
   *   name: 'Alan',
   *   age: 54,
   * })
   * // WHERE name = 'Alan' AND age = 54
   * ```
   *
   * You can wrap your constraints in a top level dictionary in which case the key of the outer
   * dictionary will be considered the name of the node.
   * ```javascript
   * query.where({
   *   person: {
   *     name: 'Alan',
   *     age: 54,
   *   },
   * })
   * // WHERE person.name = 'Alan' AND person.age = 54
   * ```
   *
   * Using an array, you can generate `OR`ed conditions.
   * ```javascript
   * query.where([
   *   { name: 'Alan' },
   *   { age: 54 },
   * ])
   * // WHERE name = 'Alan' OR age = 54
   * ```
   *
   * Arrays can be placed at many levels in the conditions.
   * ```javascript
   * query.where({
   *   name: [ 'Alan', 'Steve', 'Bob' ],
   * })
   * // WHERE name = 'Alan' OR name = 'Steve' OR name = 'Bob'
   *
   * query.where({
   *   person: [
   *     { name: 'Alan' },
   *     { age: 54 },
   *   ],
   * })
   * // WHERE person.name = 'Alan' OR person.age = 54
   *
   * query.where([
   *   { employee: { name: 'Alan' } },
   *   { department: { code: 765 } },
   * })
   * // WHERE employee.name = 'Alan' OR department.code = 765
   * ```
   *
   * For more complex comparisons, you can use the comparator functions such as:
   * ```javascript
   * query.where({
   *   age: greaterThan(30),
   * })
   * // WHERE age > 30
   * ```
   *
   * The full list of comparators currently supported are:
   *  - [between]{@link http://jamesfer.me/cypher-query-builder/globals.html#between}
   *  - [contains]{@link http://jamesfer.me/cypher-query-builder/globals.html#contains}
   *  - [endsWith]{@link http://jamesfer.me/cypher-query-builder/globals.html#endswith}
   *  - [equals]{@link http://jamesfer.me/cypher-query-builder/globals.html#equals}
   *  - [exists]{@link http://jamesfer.me/cypher-query-builder/globals.html#exists}
   *  - [greaterEqualTo]{@link http://jamesfer.me/cypher-query-builder/globals.html#greaterequalto}
   *  - [greaterThan]{@link http://jamesfer.me/cypher-query-builder/globals.html#greaterthan}
   *  - [hasLabel]{@link http://jamesfer.me/cypher-query-builder/globals.html#haslabel}
   *  - [inArray]{@link http://jamesfer.me/cypher-query-builder/globals.html#inarray}
   *  - [isNull]{@link http://jamesfer.me/cypher-query-builder/globals.html#isnull}
   *  - [lessEqualTo]{@link http://jamesfer.me/cypher-query-builder/globals.html#lessequalto}
   *  - [lessThan]{@link http://jamesfer.me/cypher-query-builder/globals.html#lessthan}
   *  - [regexp]{@link http://jamesfer.me/cypher-query-builder/globals.html#regexp}
   *  - [startsWith]{@link http://jamesfer.me/cypher-query-builder/globals.html#startswith}
   *
   * You can import the comparisons one at a time or all at once.
   * ```javascript
   * import { greaterThan, regexp } from 'cypher-query-builder';
   * // or
   * import { comparisons } form 'cypher-query-builder';
   * ```
   *
   * For convenience you can also pass a Javascript RegExp object as a value,
   * which will then be converted into a string before it is passed to cypher.
   * *However*, beware that the cypher regexp syntax is inherited from
   * [java]{@link
    * https://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html},
   * and may have slight differences to the Javascript syntax. If you would
   * prefer, you can use the `regexp` comparator and use strings instead of
   * RegExp objects. For example, Javascript RegExp flags will not be
   * preserved when sent to cypher.
   * ```javascript
   * query.where({
   *   name: /[A-Z].*son/,
   * })
   * // WHERE age =~ '[A-Z].*son'
   * ```
   *
   * All the binary operators including `xor` and `not` are available as well and can also be
   * imported individually or all at once.
   * ```javascript
   * import { xor, and } from 'cypher-query-builder';
   * // or
   * import { operators } form 'cypher-query-builder';
   * ```
   *
   * The operators can be placed at any level of the query.
   * ```javascript
   * query.where({
   *   age: xor([lessThan(12), greaterThan(65)])
   * })
   * // WHERE age < 12 XOR age > 65
   * ```
   *
   * @param {AnyConditions} conditions
   * @returns {Q}
   */
  where(conditions: AnyConditions) {
    return this.continueChainClause(new Where(conditions));
  }

  /**
   * Adds a [with]{@link https://neo4j.com/docs/developer-manual/current/cypher/clauses/with}
   * clause to the query.
   *
   * There are many different ways to pass arguments to `with` so each is
   * documented in turn below.
   *
   * A single string:
   * ```javascript
   * query.with('people')
   * // WITH people
   * ```
   *
   * An array of strings to return multiple variables:
   * ```javascript
   * query.with([ 'people', 'pets' ])
   * // WITH people, pets
   * ```
   *
   * A single object to rename variables:
   * ```javascript
   * query.with({ people: 'employees' })
   * // WITH people AS employees
   * ```
   *
   * A single object with an array for each value:
   * ```javascript
   * query.with({
   *   people: [ 'name', 'age' ],
   *   pets: [ 'name', 'breed' ],
   * })
   * // WITH people.name, people.age, pets.name, pets.breed
   * ```
   * This gives you a shortcut to specifying many node properties. You can also
   * rename each property by adding an object inside the array or by providing
   * an object as the value:
   * ```javascript
   * query.with({
   *   people: [{ name: 'personName' }, 'age' ],
   * })
   * // WITH people.name AS personName, people.age
   * ```
   * or
   * ```javascript
   * query.with({
   *   people: {
   *     name: 'personName',
   *     age: 'personAge',
   *   },
   * })
   * // WITH people.name AS personName, people.age AS personAge
   * ```
   *
   * You can also pass an array of any of the above methods.
   *
   * @param {_.Many<Term>} terms
   * @returns {Q}
   */
  with(terms: Many<Term>) {
    return this.continueChainClause(new With(terms));
  }
}
