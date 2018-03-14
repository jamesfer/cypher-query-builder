import { Clause } from '../clause';
import {
  join, concat, map, mapValues, castArray, Dictionary,
  Many, isObject,
} from 'lodash';
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

  constructor(
    { labels, values, variables }: SetProperties,
    options: SetOptions = { override: true },
  ) {
    super();
    this.labels = mapValues(labels, castArray);
    this.values = mapValues(values, (value, name) => {
      return this.parameterBag.addParam(value, name);
    });
    this.variables = variables;
    this.override = options.override;
  }

  build() {
    const labels = map(this.labels, (labels, key) => {
      return key + stringifyLabels(labels);
    });
    const values = this.makeSetStatements(this.values);
    const variables = this.makeSetStatements(this.variables, true);

    return 'SET ' + join(concat(labels, values, variables), ', ');
  }

  protected makeSetStatements(
    obj: Dictionary<string | Parameter | Dictionary<string>>,
    recursive: boolean = false,
  ) {
    return map(obj, (value, key) => this.setStatement(value, key, recursive));
  }

  protected setStatement(value, key, recursive: boolean = false) {
    const op = this.override ? ' = ' : ' += ';
    if (isObject(value) && recursive) {
      const operationStrings = map(value, (value, prop) => key + '.' + prop + op + value);
      return join(operationStrings, ', ');
    }
    return key + op + value;
  }
}
