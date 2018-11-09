import {
  AndConditions,
  AnyConditions,
  combineAnd,
  combineNot,
  combineOr,
  combineXor,
  OrConditions,
  Precedence,
  WhereOp,
} from './where-utils';
import { ParameterBag } from '../parameter-bag';

export const operators = { and, or, xor, not };

/**
 * `AND` operator to use in where clauses. This is the default operator when
 * using conditions so you will probably never need to use this unless you'd
 * like to make it explicit.
 *
 * ```
 * query.where(and({
 *   'person.name': 'Steve',
 *   'person.age': greaterThan(18),
 * }));
 * // WHERE person.name = 'Steve' AND person.age > 18
 * ```
 * Note that this method only accepts a dictionary of conditions.
 *
 * @param {AndConditions} conditions
 * @returns {WhereAnd}
 */
export function and(conditions: AndConditions) {
  return new WhereAnd(conditions);
}

export class WhereAnd extends WhereOp {
  constructor(protected conditions: AndConditions) {
    super();
  }

  evaluate(params: ParameterBag, precedence = Precedence.None, name = '') {
    return combineAnd(params, this.conditions, precedence, name);
  }
}

/**
 * `OR` operator to use in where clauses. This is the default operator when
 * supplying an array to where so you will probably never need to use this
 * unless you'd like to make it explicit.
 *
 * ```
 * query.where(or([
 *   { 'person.name': 'Steve' },
 *   { 'person.age': greaterThan(18) },
 * ]));
 * // WHERE person.name = 'Steve' OR person.age > 18
 * ```
 * Note that this method only accepts an array of conditions.
 *
 * @param {OrConditions} conditions
 * @returns {WhereOr}
 */
export function or(conditions: OrConditions) {
  return new WhereOr(conditions);
}

export class WhereOr extends WhereOp {
  constructor(protected conditions: OrConditions) {
    super();
  }

  evaluate(params: ParameterBag, precedence = Precedence.None, name = '') {
    return combineOr(params, this.conditions, precedence, name);
  }
}

/**
 * `XOR` operator to use in where clauses.
 *
 * ```
 * query.where(xor([
 *   { 'person.name': 'Steve' },
 *   { 'person.age': greaterThan(18) },
 * ]));
 * // WHERE person.name = 'Steve' XOR person.age > 18
 * ```
 * Note that this method only accepts an array of conditions.
 *
 * @param {OrConditions} conditions
 * @returns {WhereXor}
 */
export function xor(conditions: OrConditions) {
  return new WhereXor(conditions);
}

export class WhereXor extends WhereOp {
  constructor(protected conditions: OrConditions) {
    super();
  }

  evaluate(params: ParameterBag, precedence = Precedence.None, name = '') {
    return combineXor(params, this.conditions, precedence, name);
  }
}

/**
 * `NOT` operator to use in where clauses.
 *
 * ```
 * query.where(not([
 *   { 'person.name': 'Steve' },
 *   { 'person.age': greaterThan(18) },
 * ]));
 * // WHERE NOT (person.name = 'Steve' AND person.age > 18)
 * ```
 * Note that this method only accepts an array of conditions.
 *
 * @param {OrConditions} conditions
 * @returns {WhereXor}
 */
export function not(conditions: AnyConditions) {
  return new WhereNot(conditions);
}

export class WhereNot extends WhereOp {
  constructor(protected conditions: AnyConditions) {
    super();
  }

  evaluate(params: ParameterBag, precedence = Precedence.None, name = '') {
    return combineNot(params, this.conditions, precedence, name);
  }
}
