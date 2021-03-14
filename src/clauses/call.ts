import { Clause } from '../clause';
import { Query } from '../query';

export class Call extends Clause {
  constructor(private readonly subQuery: Query) {
    super();
  }
  build(): string {
    const { query, params } = this.subQuery.buildQueryObject();
    for (const param in params) {
      this.addParam(params[param], param);
    }
    return `CALL {\n ${query.replace(';', '') }\n}`;
  }
}
