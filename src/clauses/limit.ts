import { Statement } from '../statement';

export class Limit extends Statement {
  variables: string[];

  constructor(public amount: number) {
    super();
  }

  build() {
    return `LIMIT ${this.amount}`;
  }
}
