import { camelCase, isNumber, isArray, isString, isObject, isBoolean, isInteger, join, map, reduce, castArray } from 'lodash';

interface AnyClass<T> {
  new (...args: any[]): T;
}
// interface Class00<T> {
//   new (): T;
// }
// interface Class01<T> {
//   new (): T;
// }
// interface Class02<T> {
//   new (): T;
// }
// interface Class03<T> {
//   new (): T;
// }
//
// interface Class1<T, A1> {
//   new (a1: A1): T;
// }
// interface Class2<T, A1, A2> {
//   new (a1: A1, a2: A2): T;
// }
// interface Class3<T, A1, A2, A3> {
//   new (a1: A1, a2: A2, a3: A3): T;
// }
// interface Class4<T, A1, A2, A3, A4> {
//   new (a1: A1, a2: A2, a3: A3, a4: A4): T;
// }

/**
 * Returns a function that constructs the given class with the given params.
 */
// export function construct<T>(cls: Class<T>, cb?: (c: T) => T): () => T;
// export function construct<T, A1>(cls: Class1<T, A1>, cb?: (c: T) => T): (a1: A1) => T;
// export function construct<T, A1, A2>(cls: Class2<T, A1, A2>, cb?: (c: T) => T): (a1: A1, a2: A2) => T;
// export function construct<T, A1, A2, A3>(cls: Class3<T, A1, A2, A3>, cb?: (c: T) => T): (a1: A1, a2: A2, a3: A3) => T;
// export function construct<T, A1, A2, A3, A4>(cls: Class4<T, A1, A2, A3, A4>, cb?: (c: T) => T): (a1: A1, a2: A2, a3: A3, a4: A4) => T;
export function construct<T, R = T>(cls: AnyClass<T>, cb?: (c: T) => R): (...args: any[]) => R {
  return function(...args) {
    let obj = new (cls.bind.apply(cls, [cls, ...args]))();
    return cb ? cb(obj) : obj;
  }
}


/**
 * Converts a string to camel case and ensures it is unique in the provided
 * list.
 * @param {string} str
 * @param {Array<string>} existing
 * @return {string}
 */
export function uniqueString(str, existing: string[]) {
  str = camelCase(str);

  // Check if the string already has a number extension
  let number = null;
  let matches = str.match(/[0-9]+$/);
  if (matches) {
    number = +matches[0];
    str = str.substr(0, str.length - matches[0].length);
  }

  // Compute all taken suffixes that are similar to the given string
  let regex = new RegExp('^' + str + '([0-9]*)$');
  let takenSuffixes = reduce(existing, (suffixes, existingString) => {
    let matches = existingString.match(regex);
    if (matches) {
      return [...suffixes, matches[1] ? +matches[1] : 1];
    }
    return suffixes;
  }, []);

  // If there was no suffix on the given string or it was already taken,
  // compute the new suffix.
  if (!number || takenSuffixes.indexOf(number) !== -1) {
    number = (Math.max(...takenSuffixes) || 0) + 1;
  }

  // Append the suffix if it is not 1
  return str + (number === 1 ? '' : number);
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
    let str = join(map(value, el => stringifyValue), ', ');
    return `[ ${str} ]`;
  }
  if (isObject(value)) {
    let str = join(map(value, (el, key) => {
      return key + ': ' + stringifyValue(el);
    }), ', ');
    return `{ ${str} }`;
  }
  return '';
}


/**
 * Converts labels into a string that can be put into a pattern.
 *
 * @param {string|array<string>} labels
 * @return {string}
 */
export function stringifyLabels(labels) {
  return reduce(castArray(labels), (str, l) => str + ':' + l, '');
}


export type PathLength = number | number[] | '*'
/**
 * Converts a path length bounds into a string to put into a relationship.
 * @param  {Array<int>|int} bounds An array of bounds
 * @return {string}
 */
export function stringifyPathLength(bounds?: PathLength): string {
  if (!bounds) {
    return '';
  }

  let str = '*';
  if (isInteger(bounds)) {
    str += bounds;
  }
  else if (isArray(bounds)) {
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
