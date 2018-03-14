import {
  camelCase,
  castArray,
  isArray,
  isBoolean,
  isInteger,
  isNumber,
  isObject,
  isString,
  join,
  map,
  reduce,
  isNil,
} from 'lodash';


/**
 * Converts a string to camel case and ensures it is unique in the provided
 * list.
 * @param {string} str
 * @param {Array<string>} existing
 * @return {string}
 */
export function uniqueString(str, existing: string[]) {
  let camelString = camelCase(str);

  // Check if the string already has a number extension
  let number = null;
  const matches = camelString.match(/[0-9]+$/);
  if (matches) {
    number = +matches[0];
    camelString = camelString.substr(0, camelString.length - matches[0].length);
  }

  // Compute all taken suffixes that are similar to the given string
  const regex = new RegExp('^' + camelString + '([0-9]*)$');
  const collectSuffixes = (suffixes, existingString) => {
    const matches = existingString.match(regex);
    if (matches) {
      return [...suffixes, matches[1] ? +matches[1] : 1];
    }
    return suffixes;
  };
  const takenSuffixes = reduce(existing, collectSuffixes, []);

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
export function stringifyValue(value) {
  if (isNumber(value) || isBoolean(value)) {
    return '' + value;
  }
  if (isString(value)) {
    return `'` + value + `'`;
  }
  if (isArray(value)) {
    const str = join(map(value, stringifyValue), ', ');
    return `[ ${str} ]`;
  }
  if (isObject(value)) {
    const pairs = map(value, (el, key) => key + ': ' + stringifyValue(el));
    const str = join(pairs, ', ');
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
export function stringifyLabels(labels, relation = false) {
  if (labels.length === 0) {
    return '';
  }

  const separator = relation ? '|' : ':';
  return ':' + join(castArray(labels), separator);
}


export type PathLength = number | number[] | '*';
/**
 * Converts a path length bounds into a string to put into a relationship.
 * @param  {Array<int>|int} bounds An array of bounds
 * @return {string}
 */
export function stringifyPathLength(bounds?: PathLength): string {
  if (isNil(bounds)) {
    return '';
  }

  let str = '*';
  if (isInteger(bounds)) {
    str += bounds;
  } else if (isArray(bounds)) {
    if (bounds.length >= 1) {
      str += bounds[0];
    }
    str += '..';
    if (bounds.length >= 2) {
      str += bounds[1];
    }
  }

  return str;
}
