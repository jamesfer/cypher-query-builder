import { Clause } from '../clause';
import { Many, isArray, isString } from 'lodash';
import { Selector } from '../selector';

type Selectable<G extends any> = Record<string, string | Selector<G>>;

/**
 * Clause to create an object formed RETURN
 *
 * @typeParam G - (optional) type of graph model that is being queried
 */
export class ReturnObject<G extends any = any> extends Clause {
  constructor(private readonly specs : Many<Selectable<G>>) {
    super();
  }

  build(): string {
    const definitions: string[] = [];
    const records : Selectable<G>[] = isArray(this.specs) ? this.specs : [this.specs];
    for (const record of records) {
      definitions.push(this.stringifyRecord(record));
    }

    return `RETURN ${definitions.join(', ')}`;
  }

  private stringifyRecord(record : Selectable<G>) {
    let definition = '';
    const properties = [];
    for (const key in record) {
      properties.push({ key, selector: record[key] });
    }
    if (properties.length) {
      definition += '{ ';
      definition += properties.map(prop => `${prop.key}: ${prop.selector}`).join(', ');
      definition += ' }';
    }

    return definition;
  }
}
