import { Clause } from '../clause';
import { Dictionary } from 'lodash';

export class Raw extends Clause {
  constructor(public clause: string, public params: Dictionary<any> = {}) {
    super();

    for (let key in params) {
      this.addParam(params[key], key);
    }
  }

  build() {
    return this.clause;
  }
}
