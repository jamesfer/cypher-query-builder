import {
  camelCase,
  castArray,
  isArray,
  isBoolean,
  isNil,
  isNumber,
  isObject,
  isString,
  map,
  reduce,
  Many,
} from 'lodash';

/**
 * Converts a string to camel case and ensures it is unique in the provided
 * list.
 * @param {string} str
 * @param {Array<string>} existing
 * @return {string}
 */
export function uniqueString(str: string, existing: string[]) {
  let camelString = camelCase(str);

  // Check if the string already has a number extension
  let number = null;
  const matches = camelString.match(/[0-9]+$/);
  if (matches) {
    number = +matches[0];
    camelString = camelString.substr(0, camelString.length - matches[0].length);
  }

  // Compute all taken suffixes that are similar to the given string
  const regex = new RegExp(`^${camelString}([0-9]*)$`);
  const takenSuffixes = reduce(
    existing,
    (suffixes, existingString) => {
      const matches = existingString.match(regex);
      if (matches) {
        const [, suffix] = matches;
        suffixes.push(suffix ? +suffix : 1);
      }
      return suffixes;
    },
    [] as number[],
  );

  // If there was no suffix on the given string or it was already taken,
  // compute the new suffix.
  if (!number || takenSuffixes.indexOf(number) !== -1) {
    number = Math.max(0, ...takenSuffixes) + 1;
  }

  // Append the suffix if it is not 1
  return camelString + (number === 1 ? '' : number);
}

/**
 * Converts a Javascript value into a string suitable for a cypher query.
 * @param {object|Array|string|boolean|number} value
 * @return {string}
 */
export function stringifyValue(value: any): string {
  if (isNumber(value) || isBoolean(value)) {
    return `${value}`;
  }
  if (isString(value)) {
    return `'${value}'`;
  }
  if (isArray(value)) {
    const str = map(value, stringifyValue).join(', ');
    return `[ ${str} ]`;
  }
  if (isObject(value)) {
    const pairs = map(value, (el, key) => `${key}: ${stringifyValue(el)}`);
    const str = pairs.join(', ');
    return `{ ${str} }`;
  }
  return '';
}

/**
 * Converts labels into a string that can be put into a pattern.
 *
 * @param {string|array<string>} labels
 * @param relation When true, joins labels by a | instead of :
 * @return {string}
 */
export function stringifyLabels(labels: Many<string>, relation = false) {
  if (labels.length === 0) {
    return '';
  }
  return `:${castArray(labels).join(relation ? '|' : ':')}`;
}

export type PathLength = '*'
  | number
  | [number | null | undefined]
  | [number | null | undefined, number | null | undefined];

/**
 * Converts a path length bounds into a string to put into a relationship.
 * @param  {Array<int>|int} bounds An array of bounds
 * @return {string}
 */
export function stringifyPathLength(bounds?: PathLength): string {
  if (isNil(bounds)) {
    return '';
  }

  if (bounds === '*') {
    return '*';
  }

  if (isNumber(bounds)) {
    return `*${bounds}`;
  }

  const lower = isNil(bounds[0]) ? '' : `${bounds[0]}`;
  const upper = isNil(bounds[1]) ? '' : `${bounds[1]}`;
  return lower || upper ? `*${lower}..${upper}` : '*';
}
