import { Statement } from './statement';
import { join, map } from 'lodash';
import { Connection } from './connection';
import { Create, Match, Node, Set, Unwind, Return, With, Delete } from './clauses/index';

export class Query extends Statement {
  protected statements: Statement[] = [];

  constructor(protected connection: Connection = null) {
    super();
  }

  matchNode(varName, labels = [], conditions = {}) {
    return this.addStatement(new Match(new Node(varName, labels, conditions)));
  }

  match(patterns, settings?) {
    return this.addStatement(new Match(patterns, settings));
  }

  optionalMatch(patterns, settings?) {
    return this.addStatement(new Match(patterns, Object.assign(settings, {
      optional: true,
    })));
  }

  createNode(varName, labels = [], conditions = {}) {
    return this.addStatement(new Create(new Node(varName, labels, conditions)));
  }

  create(patterns) {
    return this.addStatement(new Create(patterns));
  }

  return(terms) {
    return this.addStatement(new Return(terms));
  }

  with(terms) {
    return this.addStatement(new With(terms));
  }

  unwind(list, name) {
    return this.addStatement(new Unwind(list, name));
  }

  delete(terms, settings?) {
    return this.addStatement(new Delete(terms, settings));
  }

  detachDelete(terms, settings = {}) {
    return this.addStatement(new Delete(terms, Object.assign(settings, {
      detach: true,
    })));
  }

  set(values, settings) {
    return this.addStatement(new Set(values, settings));
  }

  setLabels(labels) {
    return this.addStatement(new Set({ labels }));
  }

  setValues(values) {
    return this.addStatement(new Set({ values }));
  }

  setVariables(variables, override) {
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
