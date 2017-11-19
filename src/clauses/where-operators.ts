import {
  Precedence,
  combineAnd, combineNot, combineXor, combineOr, AndConditions,
  OrConditions, AnyConditions,
} from './where-utils';
import { ParameterBag } from '../parameterBag';

export const operators = { and, or, xor, not };

/* istanbul ignore next */
export class WhereOp {
  evaluate(
    params: ParameterBag,
    precedence: Precedence = Precedence.None,
    name: string = ''
  ): string {
    throw Error('Cannot evaluate base where operator class.');
  }
}


export function and(conditions: AndConditions) {
  return new WhereAnd(conditions);
}
export class WhereAnd extends WhereOp {
  constructor(protected conditions: AndConditions) {
    super();
  }

  evaluate(params, precedence = Precedence.None, name = '') {
    return combineAnd(params, this.conditions, precedence, name);
  }
}


export function xor(conditions: OrConditions) {
  return new WhereXor(conditions);
}
export class WhereXor extends WhereOp {
  constructor(protected conditions: OrConditions) {
    super();
  }

  evaluate(params, precedence = Precedence.None, name = '') {
    return combineXor(params, this.conditions, precedence, name);
  }
}


export function or(conditions: OrConditions) {
  return new WhereOr(conditions);
}
export class WhereOr extends WhereOp {
  constructor(protected conditions: OrConditions) {
    super();
  }

  evaluate(params, precedence = Precedence.None, name = '') {
    return combineOr(params, this.conditions, precedence, name);
  }
}


export function not(conditions: AnyConditions) {
  return new WhereNot(conditions);
}
export class WhereNot extends WhereOp {
  constructor(protected conditions: AnyConditions) {
    super();
  }

  evaluate(params, precedence = Precedence.None, name = '') {
    return combineNot(params, this.conditions, precedence, name);
  }
}
