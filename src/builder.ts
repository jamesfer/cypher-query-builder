import { Dictionary, Many, } from 'lodash';
import {
  Limit, Match, NodePattern, Skip, Where, Set, Create,
  Return, With, Unwind, Delete,
} from './clauses';
import { DeleteOptions } from './clauses/delete';
import { MatchOptions } from './clauses/match';
import { Direction, OrderBy, OrderConstraints } from './clauses/order-by';
import { PatternCollection } from './clauses/pattern-clause';
import { SetOptions, SetProperties } from './clauses/set';
import { Term } from './clauses/term-list-clause';
import { AnyConditions } from './clauses/where-utils';
import { Clause } from './clause';
import { Raw } from './clauses/raw';
import { assign } from 'lodash';


export abstract class Builder {
  protected abstract continueChainClause(clause: Clause): Builder;

  matchNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>) {
    const clause = new Match(new NodePattern(name, labels, conditions));
    return this.continueChainClause(clause);
  }

  match(patterns: PatternCollection, options?: MatchOptions) {
    return this.continueChainClause(new Match(patterns, options));
  }

  optionalMatch(patterns: PatternCollection, options: MatchOptions = {}) {
    return this.continueChainClause(new Match(patterns, assign(options, {
      optional: true,
    })));
  }

  createNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>) {
    const clause = new Create(new NodePattern(name, labels, conditions));
    return this.continueChainClause(clause);
  }

  create(patterns: PatternCollection) {
    return this.continueChainClause(new Create(patterns));
  }

  return(terms: Many<Term>) {
    return this.continueChainClause(new Return(terms));
  }

  with(terms: Many<Term>) {
    return this.continueChainClause(new With(terms));
  }

  unwind(list: any[], name: string) {
    return this.continueChainClause(new Unwind(list, name));
  }

  delete(terms: Many<string>, options?: DeleteOptions) {
    return this.continueChainClause(new Delete(terms, options));
  }

  detachDelete(terms: Many<string>, options: DeleteOptions = {}) {
    return this.continueChainClause(new Delete(terms, assign(options, {
      detach: true,
    })));
  }

  set(properties: SetProperties, options: SetOptions) {
    return this.continueChainClause(new Set(properties, options));
  }

  setLabels(labels: Dictionary<Many<string>>) {
    return this.continueChainClause(new Set({ labels }));
  }

  setValues(values: Dictionary<any>) {
    return this.continueChainClause(new Set({ values }));
  }

  setVariables(
    variables: Dictionary<string | Dictionary<string>>,
    override?: boolean
  ) {
    return this.continueChainClause(new Set(
      { variables },
      { override }
    ));
  }

  skip(amount: string | number) {
    return this.continueChainClause(new Skip(amount));
  }

  limit(amount: string | number) {
    return this.continueChainClause(new Limit(amount));
  }

  where(conditions: AnyConditions) {
    return this.continueChainClause(new Where(conditions));
  }

  orderBy(fields: Many<string> | OrderConstraints, dir?: Direction) {
    return this.continueChainClause(new OrderBy(fields, dir));
  }

  raw(clause: string, params: Dictionary<any> = {}) {
    return this.continueChainClause(new Raw(clause, params));
  }
}
