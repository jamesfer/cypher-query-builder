import { Clause } from '../clause';
import { Many, isArray } from 'lodash';
import { Selector } from '../selector';

/**
 * @typeParam G - (optional) current graph model to gather data drom
 * @typeParam T - (optional) Target type that defines the output
 */
export type Selectable<G, T extends string = string>
    = Record<T, string | Selector<G> | Record<string, Selector<G>>>;

/**
 * Clause to create an object formed RETURN
 *
 * @typeParam G - (optional) type of graph model that is being queried
 */
export class ReturnObject<G extends any = any> extends Clause {
  constructor(private readonly specs: Many<Selectable<G>>) {
    super();
  }

  build(): string {
    const definitions: string[] = [];
    const records: Selectable<G>[] = isArray(this.specs) ? this.specs : [this.specs];
    for (const record of records) {
      definitions.push(this.stringifyRecord(record));
    }

    return `RETURN ${definitions.join(', ')}`;
  }

  private stringifyRecord(record: Selectable<any>) {
    let definition = '';
    const properties = [];
    for (const key in record) {
      const selector = (record[key].toString() === '[object Object]')
        ? this.stringifyRecord(<Selectable<G>>record[key])
        : record[key];
      properties.push({ key, selector });
    }
    if (properties.length) {
      definition += '{ ';
      definition += properties.map(prop => `${prop.key}: ${prop.selector}`).join(', ');
      definition += ' }';
    }

    return definition;
  }
}
