import { Statement } from '../statement';
import { join, map, Many, isString, isArray, Dictionary, reduce } from 'lodash';


export type Direction = 'DESC' | 'ASC';
export type OrderConstraints = Dictionary<Direction>;

export class OrderBy extends Statement {
  constraints: OrderConstraints;

  constructor(fields: Many<string> | OrderConstraints, public dir?: Direction) {
    super();
    if (isString(fields)) {
      this.constraints = { [fields]: dir };
    }
    else if (isArray(fields)) {
      this.constraints = reduce(fields, (obj, field) => {
        obj[field] = dir;
        return obj;
      }, {});
    }
    else {
      this.constraints = fields;
    }
  }

  build() {
    return 'ORDER BY ' + join(map(this.constraints, constraint => {
      let dir = constraint[1] || this.dir;
      return constraint[0] + (dir ? ' ' + dir : '');
    }));
  }
}
