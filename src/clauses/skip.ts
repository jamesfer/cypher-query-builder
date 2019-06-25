import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';

export class Skip extends Clause {
  protected amountParam: Parameter;

  constructor(public amount: number) {
    super();
    this.amountParam = this.addParam(amount, 'skipCount');
  }

  build() {
    return `SKIP ${this.amountParam}`;
  }
}
