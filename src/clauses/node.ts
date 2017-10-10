import { Pattern } from './pattern';
import { trim } from 'lodash';

export class Node extends Pattern {
  constructor(
    name: string,
    labels: string | string[] = [],
    conditions = {}
  ) {
    super(name, labels, conditions);
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ' ' + this.getConditionsParamString();
    return '(' + trim(query) + ')';
  }
}
