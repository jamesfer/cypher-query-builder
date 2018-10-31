import { last, capitalize } from 'lodash';
import { ParameterBag } from '../parameter-bag';

export const comparisions = {
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
};

export type Comparator = (params: ParameterBag, name: string) => string;

function compare(operator: string, value: any, variable?: boolean, paramName?: string): Comparator {
  return (params: ParameterBag, name: string): string => {
    const baseParamName = paramName || last(name.split('.'));
    const parts = [
      name,
      operator,
      variable ? value : params.addParam(value, baseParamName),
    ];
    return parts.join(' ');
  };
}

/**
 * Equals comparator for use in where clauses. This is the default so you will
 * probably never need to use this.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: equals(18) })
 * // WHERE age = 18
 *
 * query.where({ name: equals('clientName', true) })
 * // WHERE age = clientName
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function equals(value: any, variable?: boolean) {
  return compare('=', value, variable);
}

/**
 * Greater than comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: greaterThan(18) })
 * // WHERE age > 18
 *
 * query.where({ age: greaterThan('clientAge', true) })
 * // WHERE age > clientAge
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function greaterThan(value: any, variable?: boolean) {
  return compare('>', value, variable);
}

/**
 * Greater or equal to comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: greaterEqualTo(18) })
 * // WHERE age >= 18
 *
 * query.where({ age: greaterEqualTo('clientAge', true) })
 * // WHERE age >= clientAge
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function greaterEqualTo(value: any, variable?: boolean) {
  return compare('>=', value, variable);
}

/**
 * Less than comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: lessThan(18) })
 * // WHERE age < 18
 *
 * query.where({ age: lessThan('clientAge', true) })
 * // WHERE age < clientAge
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function lessThan(value: any, variable?: boolean) {
  return compare('<', value, variable);
}

/**
 * Less or equal to comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: lessEqualTo(18) })
 * // WHERE age <= 18
 *
 * query.where({ age: lessEqualTo('clientAge', true) })
 * // WHERE age >= clientAge
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function lessEqualTo(value: any, variable?: boolean) {
  return compare('<=', value, variable);
}

/**
 * Starts with comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ name: startsWith('steve') })
 * // WHERE name STARTS WITH 'steve'
 *
 * query.where({ name: startsWith('clientName', true) })
 * // WHERE name STARTS WITH clientName
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function startsWith(value: string, variable?: boolean) {
  return compare('STARTS WITH', value, variable);
}

/**
 * Ends with comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ name: endsWith('steve') })
 * // WHERE name ENDS WITH 'steve'
 *
 * query.where({ name: endsWith('clientName', true) })
 * // WHERE name ENDS WITH clientName
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function endsWith(value: string, variable?: boolean) {
  return compare('ENDS WITH', value, variable);
}

/**
 * Contains comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ name: contains('steve') })
 * // WHERE name CONTAINS 'steve'
 *
 * query.where({ name: contains('clientName', true) })
 * // WHERE name CONTAINS clientName
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function contains(value: string, variable?: boolean) {
  return compare('CONTAINS', value, variable);
}

/**
 * In comparator for use in where clauses.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ name: inArray([ 'steve', 'william' ]) })
 * // WHERE name IN [ 'steve', 'william' ]
 *
 * query.where({ name: inArray('clientNames', true) })
 * // WHERE name IN clientNames
 * ```
 * @param value
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function inArray(value: any[], variable?: boolean) {
  return compare('IN', value, variable);
}

/**
 * Regexp comparator for use in where clauses. Also accepts a case insensitive
 * to make it easier to add the `'(?i)'` flag to the start of your regexp.
 * If you are already using flags in your regexp, you should not set insensitive
 * to true because it will prepend `'(?i)'` which will make your regexp
 * malformed.
 *
 * The regexp syntax is inherited from the
 * [java regexp syntax]{@link
 * https://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html}.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ name: regexp('s.*e') })
 * // WHERE name =~ 's.*e'
 *
 * query.where({ name: regexp('clientPattern', true) })
 * // WHERE name =~ clientPattern
 * ```
 * @param exp
 * @param insensitive
 * @param {boolean} variable
 * @returns {Comparator}
 */
export function regexp(exp: string, insensitive?: boolean, variable?: boolean) {
  return compare('=~', insensitive ? `(?i)${exp}` : exp, variable);
}

/**
 * Between comparator for use in where clauses. This comparator uses Neo4j's
 * shortcut comparison syntax: `18 <= age <= 65`.
 *
 * The `lower` and `upper` are the bounds of the comparison. You can use
 * `lowerInclusive` and `upperInclusive` to control whether it uses `<=` or `<`
 * for the comparison. They both default to `true`.
 *
 * If you pass only `lowerInclusive` then it will use that value for both.
 *
 * If you want to compare against a Neo4j variable you can set `variable` to
 * true and the value will be inserted literally into the query.
 *
 * ```
 * query.where({ age: between(18, 65) })
 * // WHERE age >= 18 AND age <= 65
 *
 * query.where({ age: between(18, 65, false) })
 * // WHERE age > 18 < AND age < 65
 *
 * query.where({ age: between(18, 65, true, false) })
 * // WHERE age >= 18 AND age < 65
 *
 * query.where({ age: between('lowerBound', 'upperBound', true, false, true) })
 * // WHERE age >= lowerBound AND age < upperBound
 * ```
 *
 * @param lower
 * @param upper
 * @param {boolean} lowerInclusive
 * @param {boolean} upperInclusive
 * @param {boolean} variables
 * @returns {Comparator}
 */
export function between(
  lower: any,
  upper: any,
  lowerInclusive = true,
  upperInclusive = lowerInclusive,
  variables?: boolean,
): Comparator {
  const lowerOp = lowerInclusive ? '>=' : '>';
  const upperOp = upperInclusive ? '<=' : '<';
  return (params: ParameterBag, name) => {
    const paramName = capitalize(name);
    const lowerComparator = compare(lowerOp, lower, variables, `lower${paramName}`);
    const upperComparator = compare(upperOp, upper, variables, `upper${paramName}`);

    const lowerConstraint = lowerComparator(params, name);
    const upperConstraint = upperComparator(params, name);
    return `${lowerConstraint} AND ${upperConstraint}`;
  };
}

/**
 * Is null comparator for use in where clauses. Note that this comparator does
 * not accept any arguments
 *
 * ```
 * query.where({ name: isNull() })
 * // WHERE name IS NULL
 * ```
 * @returns {Comparator}
 */
export function isNull(): Comparator {
  return (params, name) => `${name} IS NULL`;
}

/**
 * Has label comparator for use in where clauses.
 *
 * ```
 * query.where({ person: hasLabel('Manager') })
 * // WHERE person:Manager
 * ```
 * @param {string} label
 * @returns {Comparator}
 */
export function hasLabel(label: string): Comparator {
  return (params, name) => `${name}:${label}`;
}

/**
 * Exists comparator for use in where clauses. Note that this comparator does
 * not accept any arguments
 *
 * ```
 * query.where({ person: exists() })
 * // WHERE exists(person)
 * ```
 * @returns {Comparator}
 */
export function exists(): Comparator {
  return (params, name) => `exists(${name})`;
}
