import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';
import { Selector } from '../selector';

export class Unwind extends Clause {
  protected listParam: Parameter|string;

  constructor(
    protected list: any[]|Selector<any>,
    protected name: string,
  ) {
    super();
    if (list instanceof Selector) {
      this.listParam = list.toString();
    } else {
      this.listParam = this.parameterBag.addParam(this.list, 'list');
    }
  }

  build() {
    return `UNWIND ${this.listParam} AS ${this.name}`;
  }
}
