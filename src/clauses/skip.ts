import { Clause } from '../clause';

export class Skip extends Clause {
  protected amountParam;

  constructor(public amount: number | string) {
    super();
    this.amountParam = this.addParam(amount, 'skipCount');
  }

  build() {
    return `SKIP ${this.amountParam}`;
  }
}
