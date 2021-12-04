import { Dictionary, trim, Many, isNil, isNumber, isArray, every } from 'lodash';
import { Pattern } from './pattern';
import { PathLength, stringifyPathLength } from '../utils';

const isPathLengthArray = (value: any) => (
  isArray(value) && every(value, item => isNumber(item) || isNil(item)) && value.length > 0
);
const isPathLength = (value: any): value is PathLength => (
  value === '*' || isNumber(value) || isPathLengthArray(value)
);

export type RelationDirection = 'in' | 'out' | 'either';

export class RelationPattern extends Pattern {
  dir: RelationDirection;
  length: PathLength | undefined;

  constructor(
    dir: RelationDirection,
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
    return arrows[this.dir].join(query.length > 0 ? `[${query}]` : '');
  }
}
