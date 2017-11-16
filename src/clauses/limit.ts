import { Statement } from '../statement';

export class Limit extends Statement {
  constructor(public amount: number | string) {
    super();
  }

  build() {
    return `LIMIT ${this.amount}`;
  }
}
