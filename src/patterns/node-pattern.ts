import { Dictionary, Many, trim } from 'lodash';
import { Parameter } from '../parameter-bag';
import { Pattern } from './pattern';

export class NodePattern extends Pattern {
  constructor(
    name?: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
  ) {
    super(name, labels, conditions);
  }

  toString(conditions: Dictionary<Parameter> | Parameter) {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ` ${this.getConditionsParamString()}`;
    return `(${trim(query)})`;
  }
}
