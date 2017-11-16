import { Statement } from '../statement';

export class Skip extends Statement {
  constructor(public amount: number | string) {
    super();
  }

  build() {
    return `SKIP ${this.amount}`;
  }
}
