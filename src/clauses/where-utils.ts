import {
  Dictionary,
  isPlainObject,
  Many,
  isArray,
  join,
  map,
  split,
  last,
  keys,
  isFunction,
} from 'lodash';
import { ParameterBag } from '../parameter-bag';
import { WhereOp } from './where-operators';
import { Comparator } from './where-comparators';

export type ConditionValue = Many<any | Comparator | WhereOp>;
export type Conditions = Many<Dictionary<ConditionValue> | WhereOp>;
export type NodeConditions = Many<Dictionary<Conditions | ConditionValue> | WhereOp >;
export type AnyConditions = NodeConditions | Conditions | ConditionValue | WhereOp;

export const enum Precedence {
  None,
  Or,
  Xor,
  And,
  Not,
}

export type OperatorCombiner = (
  params: ParameterBag,
  conditions: Many<AnyConditions>,
  currentPrecedence?: Precedence,
  name?: string,
) => string;

export function stringifyCondition(
  params: ParameterBag,
  condition: ConditionValue,
  name: string = '',
): string {
  if (isFunction(condition)) {
    return condition(params, name);
  }
  const conditionName = last(split(name, '.'));
  return name + ' = ' + params.addParam(condition, conditionName);
}

export function stringifyConditions(
  params: ParameterBag,
  conditions: Many<AnyConditions>,
  precedence: Precedence = Precedence.None,
  name: string = '',
): string {
  if (isArray(conditions)) {
    return combineOr(params, conditions, precedence, name);
  }
  if (conditions instanceof WhereOp) {
    return conditions.evaluate(params, precedence, name);
  }
  if (isPlainObject(conditions)) {
    return combineAnd(params, conditions, precedence, name);
  }
  return stringifyCondition(params, conditions, name);
}

function wrapWithBraces(string: string, opPrecedence, currentPrecedence): string {
  const braces = currentPrecedence > opPrecedence;
  return braces ? `(${string})` : string;
}

export function makeOperatorCombiner(op: string, opPrecedence: Precedence): OperatorCombiner {
  return (params, conditions, currentPrecedence = Precedence.None, name = '') => {
    const conditionsIsArray = isArray(conditions);
    const useSuffix = !conditionsIsArray;
    const operatorUsed = (conditionsIsArray ? conditions : Object.keys(conditions)).length > 1;
    const precedenceInChildren = operatorUsed ? opPrecedence : currentPrecedence;

    const strings = map(conditions, (condition, key) => {
      const fullName = useSuffix
        ? name.length > 0 ? `${name}.${key}` : '' + key
        : name;
      return stringifyConditions(params, condition, precedenceInChildren, fullName);
    });

    const string = join(strings, ` ${op} `);
    return operatorUsed ? wrapWithBraces(string, opPrecedence, currentPrecedence) : string;
  };
}

export const combineOr = makeOperatorCombiner('OR', Precedence.Or);
export const combineAnd = makeOperatorCombiner('AND', Precedence.And);
export const combineXor = makeOperatorCombiner('XOR', Precedence.Xor);

export function combineNot(
  params: ParameterBag,
  conditions: Many<AnyConditions>,
  precedence: Precedence,
  name: string,
): string {
  const string = 'NOT ' + stringifyConditions(params, conditions, Precedence.Not, name);
  return wrapWithBraces(string, Precedence.Not, precedence);
}

//
// export function combineOr(
//   params: ParameterBag,
//   conditions: Many<AnyConditions>,
//   precedence: Precedence,
//   name: string,
// ): string {
//   return makeOperatorCombiner('OR', Precedence.Or, params, conditions, precedence, name);
// }

// export function combineXor(
//   params: ParameterBag,
//   conditions: Many<AnyConditions>,
//   precedence: Precedence,
//   name: string,
// ): string {
//   return makeOperatorCombiner('XOR', Precedence.Xor, params, conditions, precedence, name);
// }

// export function combineAnd(
//   params: ParameterBag,
//   conditions: Many<AnyConditions>,
//   precedence: Precedence,
//   name: string,
// ): string {
//   return makeOperatorCombiner('AND', Precedence.And, params, conditions, precedence, name);
// }
