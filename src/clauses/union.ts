import { Clause } from '../clause';

export class Union extends Clause {
  constructor(public all: boolean = false) {
    super();
  }

  build() {
    return `UNION${this.all ? ' ALL' : ''}`;
  }
}
