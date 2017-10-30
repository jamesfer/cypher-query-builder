import { Statement } from '../statement';
import { join, Many, castArray } from 'lodash';

export interface DeleteOptions {
  detach?: boolean;
}

export class Delete extends Statement {
  variables: string[];

  constructor(
    variables: Many<string>,
    protected options: DeleteOptions = { detach: true },
  ) {
    super();
    this.variables = castArray(variables);
  }

  build() {
    let str = this.options.detach ? 'DETACH ' : '';
    str += 'DELETE ';
    return str + join(this.variables, ', ');
  }
}
