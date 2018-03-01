import { Clause } from '../clause';

export class Skip extends Clause {
  constructor(public amount: number | string) {
    super();
  }

  build() {
    return `SKIP ${this.amount}`;
  }
}
