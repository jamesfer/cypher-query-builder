import { Many, castArray } from 'lodash';
import { Clause } from '../clause';

export interface DeleteOptions {
  detach?: boolean;
}

export class Delete extends Clause {
  variables: string[];

  constructor(
    variables: Many<string>,
    protected options: DeleteOptions = { },
  ) {
    super();
    this.variables = castArray(variables);
  }

  build() {
    const detach = this.options.detach ? 'DETACH ' : '';
    return `${detach}DELETE ${this.variables.join(', ')}`;
  }
}
