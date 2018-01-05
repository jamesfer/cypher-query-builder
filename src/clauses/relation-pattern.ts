import { Pattern } from './pattern';
import { Dictionary, trim, Many } from 'lodash';
import { PathLength, stringifyPathLength } from '../utils';

export class RelationPattern extends Pattern {
  constructor(
    protected dir: 'in' | 'out' | 'either',
    name?: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
    protected length?: PathLength,
  ) {
    super(name, labels, conditions);
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += stringifyPathLength(this.length);
    query += ' ' + this.getConditionsParamString();

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    };
    return arrows[this.dir][0] + trim(query) + arrows[this.dir][1];
  }
}
