import { Statement } from '../statement';
import { join, concat, map, mapValues, castArray, Dictionary } from 'lodash';
import { stringifyLabels } from '../utils';
import { Parameter } from '../parameterBag';

type Labels = string[];
type Values = any;
type Variables = string;

interface SetPropertiesInterface<L, V, R> {
  labels: Dictionary<L>,
  values: Dictionary<V>,
  variables: Dictionary<R>,
}

type SetProperties = {
  labels?: Dictionary<string | string[]>,
  values?: Dictionary<any>,
  variables?: Dictionary<string | Dictionary<string>>,
}

export class Set extends Statement {
  protected labels: Dictionary<string[]>;
  protected values: Dictionary<Parameter>;
  protected variables: Dictionary<string | Dictionary<string>>;
  protected override: boolean;

  constructor(
    { labels, values, variables }: SetProperties,
    options = { override: true },
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
    let op = this.override ? ' = ' : ' += ';
    let setStatement = (value, key) => key + op + value;

    let labels = map(this.labels, (labels, key) => {
      return key + stringifyLabels(labels)
    });
    let values = map(this.values, setStatement);
    let variables = map(this.variables, setStatement);

    return 'SET ' + join(concat(labels, values, variables), ', ');
  }
}
