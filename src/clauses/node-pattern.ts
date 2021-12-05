import { Dictionary, Many, trim } from 'lodash';
import { Pattern } from './pattern';

export class NodePattern<
    Names extends string = string,
    Condition extends Dictionary<any> = Dictionary<any>
    > extends Pattern<Names, Condition> {
  constructor(
    name?: Many<Names> | Dictionary<Names>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Condition,
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
