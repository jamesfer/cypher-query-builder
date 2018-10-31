import { Clause } from '../clause';
import { AnyConditions, stringCons } from './where-utils';

export class Where extends Clause {
  protected query: string;

  constructor(public conditions: AnyConditions) {
    super();
    this.query = stringCons(this.parameterBag, this.conditions);
  }

  build() {
    return `WHERE ${this.query}`;
  }
}
