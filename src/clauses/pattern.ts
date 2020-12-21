import {
  mapValues, map, isEmpty, Dictionary, isArray, isString,
  castArray, isObjectLike, isNil, Many,
} from 'lodash';
import { Clause } from '../clause';
import { Parameter } from '../parameter-bag';
import { stringifyLabels } from '../utils';

/**
 * @typeParam Names - (optional) subset of allowed String values
 * @typeParam Condition - (optional) stricter Dictionary
 */
export abstract class Pattern<
    Names extends string = string,
    Condition extends Dictionary<any> = Dictionary<any>
    > extends Clause {
  protected useExpandedConditions: boolean | undefined;
  protected conditionParams: Dictionary<Parameter> | Parameter = {};
  protected name: string;
  protected labels: string[];
  protected conditions: Dictionary<any>;

  constructor(
    name?: Many<Names> | Dictionary<Names>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Condition,
    protected options = { expanded: true },
  ) {
    super();
    // tslint:disable-next-line:max-line-length
    const isConditions = <T = any>(a: unknown): a is Dictionary<T> => isObjectLike(a) && !isArray(a);
    let tempName : string|readonly string[]|Dictionary<string>|undefined = name;
    let tempLabels = labels;
    let tempConditions:object|undefined = conditions;
    if (isNil(tempConditions)) {
      if (isConditions<any>(tempLabels)) {
        tempConditions = tempLabels;
        tempLabels = undefined;
      } else if (isNil(tempLabels) && isConditions(tempName)) {
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
    if (!isConditions(tempConditions)) {
      throw new TypeError('Conditions must be an object.');
    }

    this.labels = castArray(tempLabels);
    this.name = tempName;
    this.conditions = tempConditions;
    this.setExpandedConditions(options.expanded);
  }

  setExpandedConditions(expanded: boolean) {
    if (this.useExpandedConditions !== expanded) {
      this.useExpandedConditions = expanded;
      this.rebindConditionParams();
    }
  }

  rebindConditionParams() {
    // Delete old bindings
    if (this.conditionParams instanceof Parameter) {
      this.parameterBag.deleteParam(this.conditionParams.name);
    } else {
      for (const key in this.conditionParams) {
        this.parameterBag.deleteParam(this.conditionParams[key].name);
      }
    }

    // Rebind params
    if (!isEmpty(this.conditions)) {
      if (this.useExpandedConditions) {
        this.conditionParams = mapValues(this.conditions, (value, name) => {
          return this.parameterBag.addParam(value, name);
        });
      } else {
        this.conditionParams = this.parameterBag.addParam(this.conditions, 'conditions');
      }
    } else {
      this.conditionParams = {};
    }
  }

  getNameString() {
    return this.name ? this.name : '';
  }

  getLabelsString(relation = false) {
    return stringifyLabels(this.labels, relation);
  }

  getConditionsParamString() {
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
}
