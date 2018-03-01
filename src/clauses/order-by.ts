import { Clause } from '../clause';
import { join, map, Many, isString, isArray, Dictionary, reduce, mapValues } from 'lodash';


export type Direction = boolean | 'DESC' | 'DESCENDING' | 'ASC' | 'ASCENDING';
export type OrderConstraints = Dictionary<Direction>;

export class OrderBy extends Clause {
  constraints: Dictionary<'DESC' | ''>;

  constructor(fields: Many<string> | OrderConstraints, dir?: Direction) {
    super();
    const reverse = OrderBy.normalizeDirection(dir);

    if (isString(fields)) {
      this.constraints = { [fields]: reverse };
    }
    else if (isArray(fields)) {
      this.constraints = reduce(fields, (obj, field) => {
        obj[field] = reverse;
        return obj;
      }, {});
    }
    else {
      this.constraints = mapValues(fields, OrderBy.normalizeDirection);
    }
  }

  build() {
    const contraints = map(this.constraints, (dir, prop) => {
      return prop + (dir.length ? ` ${dir}` : '');
    });
    return 'ORDER BY ' + join(contraints, ', ');
  }

  private static normalizeDirection(dir?: Direction): 'DESC' | '' {
    const isDescending = dir === 'DESC' || dir === 'DESCENDING' || dir === true;
    return isDescending ? 'DESC' : '';
  }
}
