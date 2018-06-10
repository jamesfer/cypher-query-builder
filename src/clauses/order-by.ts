import { Clause } from '../clause';
import { join, map, isString, isArray, Dictionary, trim } from 'lodash';

export type Direction = boolean | 'DESC' | 'DESCENDING' | 'ASC' | 'ASCENDING' | null | undefined;
export type InternalDirection = 'DESC' | '';
export type OrderConstraint = [string, Direction] | [string];
export type InternalOrderConstraint = { field: string, direction: InternalDirection };
export type OrderConstraints = Dictionary<Direction>;

export class OrderBy extends Clause {
  constraints: InternalOrderConstraint[];

  constructor(fields: string | (string | OrderConstraint)[] | OrderConstraints, dir?: Direction) {
    super();
    const direction = OrderBy.normalizeDirection(dir);

    if (isString(fields)) {
      this.constraints = [{ direction, field: fields }];
    } else if (isArray(fields)) {
      this.constraints = map(fields, (field): InternalOrderConstraint => {
        if (!isArray(field)) {
          return { field, direction };
        }
        const fieldDirection = field[1] ? OrderBy.normalizeDirection(field[1]) : direction;
        return { field: field[0], direction: fieldDirection };
      });
    } else {
      // tslint:disable-next-line:max-line-length
      console.warn('Warning: Passing constraints to OrderBy using an object is deprecated as the iteration order is not guaranteed. Use an array instead.');
      this.constraints = map(fields, (fieldDirection, field) => {
        return { field, direction: OrderBy.normalizeDirection(fieldDirection) };
      });
    }
  }

  build() {
    const constraints = map(this.constraints, ({ field, direction }) => {
      return trim(`${field} ${direction}`);
    });
    return 'ORDER BY ' + join(constraints, ', ');
  }

  private static normalizeDirection(dir?: Direction | string): InternalDirection {
    const isDescending = dir === 'DESC' || dir === 'DESCENDING' || dir === true;
    return isDescending ? 'DESC' : '';
  }
}
