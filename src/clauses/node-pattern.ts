import { Pattern } from './pattern';
import { Dictionary, trim } from 'lodash';

export class NodePattern extends Pattern {
  constructor(
    name: string | string[] | Dictionary<any>,
    labels?: string | string[] | Dictionary<any>,
    conditions?: Dictionary<any>,
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
