import { Clause } from '../clause';
import { Dictionary, Many, map, mapValues, flatMap, castArray } from 'lodash';
import { stringifyLabels } from '../utils';
import { TypedDictionary } from '../types';

export type RemoveProperties
    <L extends string = string,
    T extends string = string,
    P extends string = string> =
    {
      labels?: Dictionary<Many<L>>;
      properties?: TypedDictionary<T, Many<P>>;
    };

export class Remove extends Clause {
  protected labels: Dictionary<string[]>;
  protected properties: Dictionary<string[]>;

  constructor({ labels = {}, properties = {} }: RemoveProperties) {
    super();
    this.labels = mapValues(labels, castArray);
    this.properties = mapValues(properties, castArray);
  }

  build() {
    const labels = map(this.labels, (labels, key) => key + stringifyLabels(labels));
    const properties = flatMap(this.properties, (properties, key) => (
      map(properties, property => `${key}.${property}`)
    ));
    return `REMOVE ${[...labels, ...properties].join(', ')}`;
  }
}
