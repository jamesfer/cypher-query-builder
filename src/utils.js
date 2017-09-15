const _ = require('lodash');


/**
 * Returns a function that constructs the given class with the given params.
 */
module.exports.construct = function (cls, cb = null) {
  return function() {
    let obj = new (cls.bind.apply(cls, [cls, ...arguments]))();
    return cb ? cb(obj) : obj;
  }
};


/**
 * Converts a string to camel case and ensures it is unique in the provided
 * list.
 * @param {string} str
 * @param {Array<string>} existing
 * @return {string}
 */
module.exports.uniqueString = function(str, existing) {
  str = _.camelCase(str);

  // Check if the string already has a number extension
  let number = null;
  let matches = str.match(/[0-9]+$/);
  if (matches) {
    number = +matches[0];
    str = str.substr(0, str.length - matches[0].length);
  }

  // Compute all taken suffixes that are similar to the given string
  let regex = new RegExp('^' + str + '([0-9]*)$');
  let takenSuffixes = _.reduce(existing, (suffixes, existingString) => {
    let matches = existingString.match(regex);
    if (matches) {
      return [...suffixes, matches[1] ? +matches[1] : 1];
    }
    return suffixes;
  }, []);

  // If there was no suffix on the given string or it was already taken,
  // compute the new suffix.
  if (!number || takenSuffixes.indexOf(number) !== -1) {
    number = (_.max(takenSuffixes) || 0) + 1;
  }

  // Append the suffix if it is not 1
  return str + (number === 1 ? '' : number);
};


/**
 * Converts labels into a string that can be put into a pattern.
 *
 * @param {string|array<string>} labels
 * @return {string}
 */
module.exports.stringifyLabels = function stringifyLabels(labels) {
  return _.reduce(_.castArray(labels), (str, l) => str + ':' + l, '');
};


/**
 * Converts a path length bounds into a string to put into a relationship.
 * @param  {Array<int>|string} bounds An array of bounds
 * @return {string}
 */
module.exports.stringifyPathLength = function stringifyPathLength(bounds) {
  if (!bounds) {
    return '';
  }

  let str = '*';
  if (_.isInteger(bounds)) {
    str += bounds;
  }
  else if (_.isArray(bounds)) {
    if (bounds.length >= 1) {
      str += bounds[0];
    }
    str += '..';
    if (bounds.length >= 2) {
      str += bounds[1];
    }
  }

  return str;
};
