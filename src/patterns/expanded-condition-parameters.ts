import { Dictionary, mapValues } from "lodash";
import { Parameter, ParameterBag } from '../parameter-bag';
import { ConditionParameters } from './condition-parameters';

export class ExpandedConditionParameters extends ConditionParameters {
  private expandedConditions: Dictionary<Parameter>;
  constructor(
    conditions: Dictionary<any>,
    parameterBag: ParameterBag = new ParameterBag(),
  ) {
    super(parameterBag);

    this.expandedConditions = mapValues(conditions, )
  }

  toString() {
    return
  }
}
