import { Statement } from '../statement';
import {
  mapValues, join, map, isEmpty, Dictionary, isArray, isString,
  castArray, isObjectLike, isNil, Many,
} from 'lodash';
import { Parameter } from '../parameter-bag';
import { stringifyLabels } from '../utils';

export class Pattern extends Statement {
  protected useExpandedConditions: boolean;
  protected conditionParams = {};
  protected name: string;
  protected labels: string[];
  protected conditions: Dictionary<any>;

  constructor(
    name?: Many<string> | Dictionary<any>,
    labels?: Many<string> | Dictionary<any>,
    conditions?: Dictionary<any>,
    protected options = { expanded: true },
  ) {
    super();

    const isConditions = (a: any) => isObjectLike(a) && !isArray(a);

    if (isNil(conditions)) {
      if (isConditions(labels)) {
        conditions = labels as Dictionary<any>;
        labels = undefined;
      }
      else if (isNil(labels) && isConditions(name)) {
        conditions = name as Dictionary<any>;
        name = undefined;
      }
      else {
        conditions = {};
      }
    }

    if (isNil(labels)) {
      if (isString(name) || isArray(name)) {
        labels = name;
        name = undefined;
      }
      else {
        labels = [];
      }
    }

    if (isNil(name)) {
      name = '';
    }

    if (!isString(name)) {
      throw new TypeError('Name must be a string.')
    }
    if (!isString(labels) && !isArray(labels)) {
      throw new TypeError('Labels must be a string or an array');
    }
    if (!isConditions(conditions)) {
      throw new TypeError('Conditions must be an object.');
    }

    this.labels = castArray(labels);
    this.name = name;
    this.conditions = conditions;
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
    }
    else {
      for (let key in this.conditionParams) {
        this.parameterBag.deleteParam(this.conditionParams[key].name);
      }
    }

    // Rebind params
    if (!isEmpty(this.conditions)) {
      if (this.useExpandedConditions) {
        this.conditionParams = mapValues(this.conditions, (value, name) => {
          return this.parameterBag.addParam(value, name);
        });
      }
      else {
        this.conditionParams = this.parameterBag.addParam(this.conditions, 'conditions');
      }
    }
    else {
      this.conditionParams = {};
    }
  }

  getNameString() {
    return this.name ? this.name : '';
  }

  getLabelsString() {
    return stringifyLabels(this.labels);
  }

  getConditionsParamString() {
    if (isEmpty(this.conditions)) {
      return '';
    }

    if (this.useExpandedConditions) {
      let strings = map(this.conditionParams, (param, name) => {
        return `${name}: ${param}`;
      });
      return '{ ' + join(strings, ', ') + ' }';
    }
    return this.conditionParams.toString();
  }
}

