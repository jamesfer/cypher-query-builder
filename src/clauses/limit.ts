import { Clause } from '../clause';

export class Limit extends Clause {
  constructor(public amount: number | string) {
    super();
  }

  build() {
    return `LIMIT ${this.amount}`;
  }
}
