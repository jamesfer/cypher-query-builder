import { join, Many, last, split, capitalize } from 'lodash';
import { ParameterBag } from '../parameterBag';
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

export type Comparator = (params: ParameterBag, name: string) => Many<string>;

function compare(operator: string, value: any, variable?: boolean, paramName?: string): Comparator {
  return (params: ParameterBag, name: string): string => {
    paramName = paramName || last(split(name, '.'));
    return join([
      name,
      operator,
      variable ? value : params.addParam(value, paramName),
    ], ' ');
  };
}

export function equals(value: any, variable?: boolean) {
  return compare('=', value, variable);
}

export function greaterThan(value: any, variable?: boolean) {
  return compare('>', value, variable);
}

export function greaterEqualTo(value: any, variable?: boolean) {
  return compare('>=', value, variable);
}

export function lessThan(value: any, variable?: boolean) {
  return compare('<', value, variable);
}

export function lessEqualTo(value: any, variable?: boolean) {
  return compare('<=', value, variable);
}

export function startsWith(value: string, variable?: boolean) {
  return compare('STARTS WITH', value, variable);
}

export function endsWith(value: string, variable?: boolean) {
  return compare('ENDS WITH', value, variable);
}

export function contains(value: string, variable?: boolean) {
  return compare('CONTAINS', value, variable);
}

export function inArray(value: any[], variable?: boolean) {
  return compare('IN', value, variable);
}

export function regexp(exp: string, insensitive?: boolean, variable?: boolean) {
  return compare('=~', insensitive ? '(?i)' + exp : exp, variable);
}

export function isNull(): Comparator {
  return (params, name) => name + ' IS NULL';
}

export function hasLabel(label: string): Comparator {
  return (params, name) => name + ':' + label;
}

export function exists(): Comparator {
  return (params, name) => `exists(${name})`;
}

export function between(
  lower: any,
  upper: any,
  lowerInclusive?: boolean,
  upperInclusive?: boolean,
  variables?: boolean
): Comparator {
  if (lowerInclusive === undefined) {
    lowerInclusive = true;
  }
  if (upperInclusive === undefined) {
    upperInclusive = lowerInclusive;
  }

  const lowerOp = lowerInclusive ? '>=' : '>';
  const upperOp = upperInclusive ? '<=' : '<';
  return (params: ParameterBag, name) => {
    const paramName = capitalize(name);
    const upperComp = compare(lowerOp, lower, variables, 'lower' + paramName);
    const lowerComp = compare(upperOp, upper, variables, 'upper' + paramName);

    return []
      .concat(lowerComp(params, name))
      .concat(upperComp(params, name));
  }
}
