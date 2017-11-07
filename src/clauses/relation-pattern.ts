import { Pattern } from './pattern';
import { trim } from 'lodash';
import { PathLength, stringifyPathLength } from '../utils';

export class RelationPattern extends Pattern {
  constructor(
    protected dir: 'in' | 'out' | 'either',
    name: string = '',
    labels: string | string[] = [],
    conditions = {},
    protected length?: PathLength
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
