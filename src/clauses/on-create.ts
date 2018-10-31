import { Set } from './set';
import { Clause } from '../clause';

export class OnCreate extends Clause {
  constructor(protected clause: Set) {
    super();
    clause.useParameterBag(this.parameterBag);
  }

  build() {
    return `ON CREATE ${this.clause.build()}`;
  }
}
