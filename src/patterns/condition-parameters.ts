import { ParameterBag } from '../parameter-bag';
import { ParameterContainer } from '../parameter-container';

export abstract class ConditionParameters extends ParameterContainer {
  protected constructor(parameterBag: ParameterBag = new ParameterBag()) {
    super(parameterBag);
  }

  abstract toString(): string;
}
