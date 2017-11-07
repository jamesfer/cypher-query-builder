import { Statement } from '../statement';
import { concat, mapValues, join, map, isEmpty } from 'lodash';
import { Parameter } from '../parameterBag';
import { stringifyLabels } from '../utils';

export class Pattern extends Statement {
  protected useExpandedConditions: boolean;
  protected conditionParams = {};

  constructor(
    protected name: string,
    protected labels: string | string[] = [],
    protected conditions: {} = {},
    protected options = { expanded: true }
  ) {
    super();
    this.labels = concat([], labels);
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

