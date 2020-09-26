import neo4jDriver from 'neo4j-driver';
import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';

export class Skip extends Clause {
  protected amountParam: Parameter;

  constructor(public amount: number) {
    super();
    this.amountParam = this.addParam(neo4jDriver.int(amount), 'skipCount');
  }

  build() {
    return `SKIP ${this.amountParam}`;
  }
}
