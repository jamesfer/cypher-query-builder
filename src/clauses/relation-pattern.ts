import { Pattern } from './pattern';
import { Dictionary, trim, Many, join } from 'lodash';
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
    const name = this.getNameString();
    const labels = this.getLabelsString(true);
    const length = stringifyPathLength(this.length);
    const conditions = this.getConditionsParamString();
    const query = trim(`${name}${labels}${length} ${conditions}`);

    const arrows: Record<'in' | 'out' | 'either', string[]> = {
      in: ['<-', '-'],
      out: ['-', '->'],
      either: ['-', '-'],
    };
    return join(arrows[this.dir], query.length > 0 ? `[${query}]` : '');
  }
}
