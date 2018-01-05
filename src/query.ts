import { Statement } from './statement';
import { Dictionary, join, Many, map } from 'lodash';
import { Connection } from './connection';
import { Create, Match, NodePattern, Set, Unwind, Return, With, Delete, Where } from './clauses/index';
import { PatternCollection } from './clauses/pattern-statement';
import { MatchOptions } from './clauses/match';
import { SetOptions, SetProperties } from './clauses/set';
import { Term } from './clauses/term-list-statement';
import { DeleteOptions } from './clauses/delete';
import { SanitizedRecord, SanitizedValue } from './transformer';
import { Builder } from './builder';
import { Skip } from './clauses/skip';
import { Limit } from './clauses/limit';
import { AnyConditions } from './clauses/where-utils';
import { Direction, OrderBy, OrderConstraints } from './clauses/order-by';
import { Raw } from './clauses/raw';

export class Query extends Statement implements Builder {
  protected statements: Statement[] = [];

  constructor(protected connection: Connection = null) {
    super();
  }

  matchNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>) {
    return this.addStatement(new Match(new NodePattern(name, labels, conditions)));
  }

  match(patterns: PatternCollection, options?: MatchOptions) {
    return this.addStatement(new Match(patterns, options));
  }

  optionalMatch(patterns: PatternCollection, options: MatchOptions = {}) {
    return this.addStatement(new Match(patterns, Object.assign(options, {
      optional: true,
    })));
  }

  createNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>) {
    return this.addStatement(new Create(new NodePattern(name, labels, conditions)));
  }

  create(patterns: PatternCollection) {
    return this.addStatement(new Create(patterns));
  }

  return(terms: Many<Term>) {
    return this.addStatement(new Return(terms));
  }

  with(terms: Many<Term>) {
    return this.addStatement(new With(terms));
  }

  unwind(list: any[], name: string) {
    return this.addStatement(new Unwind(list, name));
  }

  delete(terms: Many<string>, options?: DeleteOptions) {
    return this.addStatement(new Delete(terms, options));
  }

  detachDelete(terms: Many<string>, options: DeleteOptions = {}) {
    return this.addStatement(new Delete(terms, Object.assign(options, {
      detach: true,
    })));
  }

  set(properties: SetProperties, options: SetOptions) {
    return this.addStatement(new Set(properties, options));
  }

  setLabels(labels: Dictionary<Many<string>>) {
    return this.addStatement(new Set({ labels }));
  }

  setValues(values: Dictionary<any>) {
    return this.addStatement(new Set({ values }));
  }

  setVariables(variables: Dictionary<string | Dictionary<string>>, override?: boolean) {
    return this.addStatement(new Set(
      { variables },
      { override }
    ));
  }

  skip(amount: string | number) {
    return this.addStatement(new Skip(amount));
  }

  limit(amount: string | number) {
    return this.addStatement(new Limit(amount));
  }

  where(conditions: AnyConditions) {
    return this.addStatement(new Where(conditions));
  }

  orderBy(fields: Many<string> | OrderConstraints, dir?: Direction) {
    return this.addStatement(new OrderBy(fields, dir));
  }

  raw(clause: string, params: Dictionary<any> = {}) {
    return this.addStatement(new Raw(clause, params));
  }

  build() {
    return join(map(this.statements, s => s.build()), '\n') + ';';
  }

  getStatements() {
    return this.statements;
  }

  /**
   * Adds a statement to the child list.
   * @param {Statement} statement
   * @return {Query}
   */
  addStatement(statement) {
    statement.useParameterBag(this.parameterBag);
    this.statements.push(statement);
    return this;
  }

  async run<R = SanitizedValue>(): Promise<SanitizedRecord<R>[]> {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run<R>(this);
  }
}
