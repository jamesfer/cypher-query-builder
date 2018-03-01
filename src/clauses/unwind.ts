import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';

export class Unwind extends Clause {
  protected listParam: Parameter;

  constructor(
    protected list: any[],
    protected name: string,
  ) {
    super();
    this.listParam = this.parameterBag.addParam(this.list, 'list');
  }

  build() {
    return `UNWIND ${this.listParam} AS ${this.name}`;
  }
}
