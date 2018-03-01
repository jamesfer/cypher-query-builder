import { Clause } from '../clause';
import { AnyConditions, stringCons } from './where-utils';

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
  constructor(public conditions: AnyConditions) {
    super();
  }

  build() {
    return 'WHERE ' + stringCons(this.parameterBag, this.conditions);
  }
}
