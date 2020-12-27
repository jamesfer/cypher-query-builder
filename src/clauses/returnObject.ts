import { Clause } from '../clause';
import { Many } from 'lodash';

/**
 * Clause to create an object formed RETURN
 *
 * @typeParam P - (optional) defines the allowed property names
 */
export class ReturnObject
  <P extends string = string, T extends [string, string] = [string, string]>
  extends Clause
{
  constructor(private readonly specs : Many<Record<P, T|string>>) {
    super();
  }

  build(): string {
    return '';
  }
}
