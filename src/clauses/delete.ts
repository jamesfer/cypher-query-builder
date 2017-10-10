import { Statement } from '../statement';
import { join } from 'lodash';

export class Delete extends Statement {
  constructor(
    protected variables: string[] = [],
    protected options: { detach: boolean } = { detach: true },
  ) {
    super();
  }

  build() {
    let str = this.options.detach ? 'DETACH ' : '';
    str += 'DELETE ';
    return str + join(this.variables, ', ');
  }
}
