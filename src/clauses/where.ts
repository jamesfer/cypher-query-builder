import { Clause } from '../clause';
import { AnyConditions, stringifyConditions } from './where-utils';

/**
 * where({
 *    n: {
 *      name: 'james',
 *      active: eq(1),
 *      age: gt(20),
 *    }
 * });
 * where({
 *   'n.name': 'james'
 * });
 * where([
 *   { 'n.name': 'james' },
 *   { 'n.age': gt(20) },
 * ]);
 */
export class Where extends Clause {
  constructor(protected conditions: AnyConditions) {
    super();
  }

  build() {
    return 'WHERE ' + stringifyConditions(this.parameterBag, this.conditions);
  }
}
