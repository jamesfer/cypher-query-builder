import { Pattern } from './pattern';
import { Dictionary, Many, trim } from 'lodash';

export class NodePattern extends Pattern {
  constructor(
    name: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
  ) {
    super(name, labels, conditions);
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ` ${this.getConditionsParamString()}`;
    return `(${trim(query)})`;
  }
}
