import { Clause } from '../clause';
import { castArray, Many } from 'lodash';

export interface DeleteOptions {
  detach?: boolean;
}

export class Delete extends Clause {
  variables: string[];

  constructor(
    variables: Many<string>,
    protected options: DeleteOptions = { detach: true },
  ) {
    super();
    this.variables = castArray(variables);
  }

  build() {
    const detach = this.options.detach ? 'DETACH ' : '';
    return `${detach}DELETE ${this.variables.join(', ')}`;
  }
}
