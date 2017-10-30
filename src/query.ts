import { Statement } from './statement';
import { Dictionary, join, Many, map } from 'lodash';
import { Connection } from './connection';
import { Create, Match, Node, Set, Unwind, Return, With, Delete } from './clauses/index';
import { Builder } from './builder';
import { PatternCollection } from './clauses/patternStatement';
import { MatchOptions } from './clauses/match';
import { SetOptions, SetProperties } from './clauses/set';
import { PropertyTerm } from './clauses/termListStatement';
import { DeleteOptions } from './clauses/delete';

export class Query extends Statement implements Builder {
  protected statements: Statement[] = [];

  constructor(protected connection: Connection = null) {
    super();
  }

  matchNode(varName: string, labels?: Many<string>, conditions?: {}) {
    return this.addStatement(new Match(new Node(varName, labels, conditions)));
  }

  match(patterns: PatternCollection, options?: MatchOptions) {
    return this.addStatement(new Match(patterns, options));
  }

  optionalMatch(patterns: PatternCollection, options?: MatchOptions) {
    return this.addStatement(new Match(patterns, Object.assign(options, {
      optional: true,
    })));
  }

  createNode(varName: any, labels?: Many<string>, conditions?: {}) {
    return this.addStatement(new Create(new Node(varName, labels, conditions)));
  }

  create(patterns: PatternCollection) {
    return this.addStatement(new Create(patterns));
  }

  return(terms: Many<PropertyTerm>) {
    return this.addStatement(new Return(terms));
  }

  with(terms: Many<PropertyTerm>) {
    return this.addStatement(new With(terms));
  }

  unwind(list: any[], name: string) {
    return this.addStatement(new Unwind(list, name));
  }

  delete(terms: Many<string>, options?: DeleteOptions) {
    return this.addStatement(new Delete(terms, options));
  }

  detachDelete(terms: Many<string>, options?: DeleteOptions) {
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

  setVariables(variables: Dictionary<string | Dictionary<string>>, override: boolean) {
    return this.addStatement(new Set(
      { variables },
      { override }
    ));
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

  async run() {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run(this);
  }
}
