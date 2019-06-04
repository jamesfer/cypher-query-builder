import {
  concat, map, mapValues, castArray, Dictionary,
  Many, isObject, isString,
} from 'lodash';
import { Clause } from '../clause';
import { stringifyLabels } from '../utils';
import { Parameter } from '../parameter-bag';

export type SetProperties = {
  labels?: Dictionary<Many<string>>,
  values?: Dictionary<any>,
  variables?: Dictionary<string | Dictionary<string>>,
};

export interface SetOptions {
  merge?: boolean;
}

export class Set extends Clause {
  protected labels: Dictionary<string[]>;
  protected values: Dictionary<Parameter>;
  protected variables: Dictionary<string | Dictionary<string>>;
  protected merge: boolean;

  protected makeLabelStatement = (labels: Many<string>, key: string) => {
    return key + stringifyLabels(labels);
  }

  protected makeValueStatement = (value: any, key: string): string => {
    const valueIsObject = value instanceof Parameter ? isObject(value.value) : isObject(value);
    const op = this.merge && valueIsObject ? ' += ' : ' = ';
    return key + op + value;
  }

  protected makeVariableStatement = (value: string | Dictionary<string>, key: string): string => {
    const op = this.merge ? ' += ' : ' = ';
    if (isString(value)) {
      return key + op + value;
    }
    const operationStrings = map(value, (value, prop) => `${key}.${prop}${op}${value}`);
    return operationStrings.join(', ');
  }

  constructor(
    { labels, values, variables }: SetProperties,
    options: SetOptions = {},
  ) {
    super();

    this.labels = mapValues(labels, castArray);
    this.values = mapValues(values, (value, name) => {
      return this.parameterBag.addParam(value, name);
    });
    this.variables = variables || {};
    this.merge = !!options.merge;
  }

  build() {
    const labels = map(this.labels, this.makeLabelStatement);
    const values = map(this.values, this.makeValueStatement);
    const variables = map(this.variables, this.makeVariableStatement);
    return `SET ${concat(labels, values, variables).join(', ')}`;
  }
}
