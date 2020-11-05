import { trim } from 'lodash';
import { Pattern } from './pattern';

export class PathNamePattern extends Pattern {
  constructor(
      name: string,
  ) {
    super(name);
  }

  build() {
    let query = this.getNameString();
    query += '=';
    return `(${trim(query)})`;
  }
}
