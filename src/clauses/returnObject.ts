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
 * @param specs - Many or one specification for object
 * @param alias - Many or one alias to name the object ({} AS alias)
 * @typeParam G - (optional) type of graph model that is being queried
 */
export class ReturnObject<G extends any = any> extends Clause {
  constructor(
    private readonly specs: Many<Selectable<G>>,
    private readonly name?: Many<string|undefined>,
  ) {
    super();
  }

  build(): string {
    const definitions: string[] = [];
    const records: Selectable<G>[] = isArray(this.specs) ? this.specs : [this.specs];
    for (const i in records) {
      let alias: string|undefined;
      if (isArray(this.name)) {
        alias = this.name[i];
      } else if (typeof this.name === 'string' && i === '0') {
        alias = this.name;
      } else {
        alias = undefined;
      }
      definitions.push(this.stringifyRecord(records[i], alias));
    }

    return `RETURN ${definitions.join(', ')}`;
  }

  private stringifyRecord(record: Selectable<any>, alias?: string) {
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
    if (alias) {
      definition += ` AS \`${alias}\``;
    }

    return definition;
  }
}
