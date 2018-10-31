import { Set } from './set';
import { Clause } from '../clause';

export class OnMatch extends Clause {
  constructor(protected clause: Set) {
    super();
    clause.useParameterBag(this.parameterBag);
  }

  build() {
    return `ON MATCH ${this.clause.build()}`;
  }
}
