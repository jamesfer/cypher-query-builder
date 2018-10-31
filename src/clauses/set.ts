import { Clause } from '../clause';
import { concat, map, mapValues, castArray, Dictionary, Many, isObject } from 'lodash';
import { stringifyLabels } from '../utils';
import { Parameter } from '../parameter-bag';

export type SetProperties = {
  labels?: Dictionary<Many<string>>,
  values?: Dictionary<any>,
  variables?: Dictionary<string | Dictionary<string>>,
};

export interface SetOptions {
  override: boolean;
}

export class Set extends Clause {
  protected labels: Dictionary<string[]>;
  protected values: Dictionary<Parameter>;
  protected variables: Dictionary<string | Dictionary<string>>;
  protected override: boolean;

  protected makeLabelStatement = (labels: Many<string>, key: string) => {
    return key + stringifyLabels(labels);
  }

  protected makeValueStatement = (value: any, key: string): string => {
    const valueIsObject = value instanceof Parameter ? isObject(value.value) : isObject(value);
    const op = this.override || !valueIsObject ? ' = ' : ' += ';
    return key + op + value;
  }

  protected makeVariableStatement = (value: string | Dictionary<string>, key: string): string => {
    const op = this.override ? ' = ' : ' += ';
    if (isObject(value)) {
      const operationStrings = map(value, (value, prop) => `${key}.${prop}${op}${value}`);
      return operationStrings.join(', ');
    }
    return key + op + value;
  }

  constructor(
    { labels, values, variables }: SetProperties,
    inOptions?: SetOptions,
  ) {
    super();

    let options: SetOptions | undefined = inOptions;
    if (inOptions === undefined) {
      // tslint:disable-next-line:max-line-length
      console.warn('Warning: In the future, override will default to false in a Set clause when no options are provided. To retain the old behaviour, pass { override: false } as options to the Set constructor.');
      options = { override: true };
    }

    this.labels = mapValues(labels, castArray);
    this.values = mapValues(values, (value, name) => {
      return this.parameterBag.addParam(value, name);
    });
    this.variables = variables;
    this.override = options.override;
  }

  build() {
    const labels = map(this.labels, this.makeLabelStatement);
    const values = map(this.values, this.makeValueStatement);
    const variables = map(this.variables, this.makeVariableStatement);
    return `SET ${concat(labels, values, variables).join(', ')}`;
  }
}
