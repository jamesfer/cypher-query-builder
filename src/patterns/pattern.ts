import {
  mapValues, map, isEmpty, Dictionary, isArray, isString,
  castArray, isObjectLike, isNil, Many,
} from 'lodash';
import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';
import { stringifyLabels } from '../utils';

export abstract class Pattern {
  protected name: string;
  protected labels: string[];
  protected rawConditions: Dictionary<any>;

  constructor(
    name?: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
  ) {
    let tempName = name;
    let tempLabels = labels;
    let tempConditions = conditions;

    if (isNil(tempConditions)) {
      if (this.isConditions(tempLabels)) {
        tempConditions = tempLabels;
        tempLabels = undefined;
      } else if (isNil(tempLabels) && this.isConditions(tempName)) {
        tempConditions = tempName;
        tempName = undefined;
      } else {
        tempConditions = {};
      }
    }

    if (isNil(tempLabels)) {
      if (isArray(tempName)) {
        tempLabels = tempName;
        tempName = undefined;
      } else {
        tempLabels = [];
      }
    }

    if (isNil(tempName)) {
      tempName = '';
    }

    if (!isString(tempName)) {
      throw new TypeError('Name must be a string.');
    }
    if (!isString(tempLabels) && !isArray(tempLabels)) {
      throw new TypeError('Labels must be a string or an array');
    }
    if (!this.isConditions(tempConditions)) {
      throw new TypeError('Conditions must be an object.');
    }

    this.labels = castArray(tempLabels);
    this.name = tempName;
    this.rawConditions = tempConditions;
  }

  get conditions(): Dictionary<any> {
    return this.rawConditions;
  }

  abstract toString(conditions: Dictionary<Parameter>): string;

  protected getNameString() {
    return this.name ? this.name : '';
  }

  protected getLabelsString(relation = false) {
    return stringifyLabels(this.labels, relation);
  }

  protected isConditions(a: unknown): a is Dictionary<any> {
    return isObjectLike(a) && !isArray(a);
  }

  protected getConditionsParamString(conditions: Dictionary<Parameter> | Parameter) {
    if (isEmpty(this.conditions)) {
      return '';
    }

    if (this.useExpandedConditions) {
      const strings = map(this.conditionParams, (param, name) => {
        return `${name}: ${param}`;
      });
      return `{ ${strings.join(', ')} }`;
    }
    return this.conditionParams.toString();
}
