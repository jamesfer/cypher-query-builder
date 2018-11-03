import { Clause } from '../clause';
import { AnyConditions, stringCons } from './where-utils';

export class Where extends Clause {
  constructor(public conditions: AnyConditions) {
    super();
  }

  build() {
    return `WHERE ${stringCons(this.parameterBag, this.conditions)}`;
  }
}
