import { Statement } from '../statement';
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
}

export interface SetOptions {
  override: boolean;
}

export class Set extends Statement {
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
    let labels = map(this.labels, (labels, key) => {
      return key + stringifyLabels(labels)
    });
    let values = this.makeSetStatements(this.values);
    let variables = this.makeSetStatements(this.variables, true);

    return 'SET ' + join(concat(labels, values, variables), ', ');
  }

  protected makeSetStatements(
    obj: Dictionary<string | Parameter | Dictionary<string>>,
    recursive: boolean = false,
  ) {
    return map(obj, (value, key) => this.setStatement(value, key, recursive));
  }

  protected setStatement(value, key, recursive: boolean = false) {
    let op = this.override ? ' = ' : ' += ';
    if (isObject(value) && recursive) {
      return join(map(value, (value, prop) => {
        return key + '.' + prop + op + value;
      }), ', ');
    }
    return key + op + value;
  }
}
