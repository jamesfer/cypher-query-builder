import { Pattern } from './pattern';
import { Dictionary, trim, Many, join, isNil, isNumber, isArray, every } from 'lodash';
import { PathLength, stringifyPathLength } from '../utils';

const isPathLength = (value: any): value is PathLength => (
  value === '*' || isNumber(value) || isArray(value) && every(value, isNumber) && value.length > 0
);

export class RelationPattern extends Pattern {
  dir: 'in' | 'out' | 'either';
  length: PathLength | undefined;

  constructor(
    dir: 'in' | 'out' | 'either',
    name?: Many<string> | Dictionary<any> | PathLength,
    labels?: Many<string> | Dictionary<any> | PathLength,
    conditions?: Dictionary<any> | PathLength,
    length?: PathLength,
  ) {
    let tempName = name;
    let tempLabels = labels;
    let tempConditions = conditions;
    let tempLength = length;

    if (isNil(tempLength)) {
      if (isPathLength(tempConditions)) {
        tempLength = tempConditions;
        tempConditions = undefined;
      } else if (isNil(tempConditions) && isPathLength(tempLabels)) {
        tempLength = tempLabels;
        tempLabels = undefined;
      } else if (isNil(tempConditions) && isNil(tempLabels) && isPathLength(tempName)) {
        tempLength = tempName;
        tempName = undefined;
      }
    }

    if (isPathLength(tempName) || isPathLength(tempLabels) || isPathLength(tempConditions)) {
      throw new TypeError('Invalid argument combination.');
    }

    super(tempName, tempLabels, tempConditions);
    this.dir = dir;
    this.length = tempLength;
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
