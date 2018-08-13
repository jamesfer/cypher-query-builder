import {
  Precedence,
  combineAnd,
  combineNot,
  combineXor,
  combineOr,
  AnyConditions,
  ConditionValue,
  Conditions,
  NodeConditions, makeOperatorCombiner, OperatorCombiner,
} from './where-utils';
import { ParameterBag } from '../parameter-bag';
import { isArray } from 'lodash';

export const operators = { and, or, xor, not };

export class WhereOp {
  protected conditions: AnyConditions[];

  constructor(conditions: AnyConditions[], protected combiner: OperatorCombiner) {
    const [first, ...rest] = conditions;
    this.conditions = rest.length === 0 && isArray(first) ? first : conditions;
  }

  evaluate(params: ParameterBag, precedence?: Precedence, name?: string): string {
    return this.combiner(params, this.conditions, precedence, name);
  }
}

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
 */
export function and(...conditions: AnyConditions[]) {
  return new WhereOp(conditions, combineAnd);
}

// export class WhereAnd extends WhereOp {
//   evaluate(params, precedence = Precedence.None, name = '') {
//     return combineAnd(params, this.conditions, precedence, name);
//   }
// }

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
 */
export function or(...conditions: AnyConditions[]) {
  return new WhereOp(conditions, combineOr);
}

// export class WhereOr extends WhereOp {
//   evaluate(params, precedence = Precedence.None, name = '') {
//     return combineOr(params, this.conditions, precedence, name);
//   }
// }

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
 */
export function xor(...conditions: AnyConditions[]) {
  return new WhereOp(conditions, combineXor);
}

// export class WhereXor extends WhereOp {
//   evaluate(params, precedence = Precedence.None, name = '') {
//     return combineXor(params, this.conditions, precedence, name);
//   }
// }

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
 */
export function not(conditions: AnyConditions) {
  return new WhereOp([conditions], combineNot);
}

// export class WhereNot extends WhereOp {
//   constructor(condition: AnyConditions) {
//     super(condition);
//   }
//
//   evaluate(params, precedence = Precedence.None, name = '') {
//     return combineNot(params, this.conditions, precedence, name);
//   }
// }
