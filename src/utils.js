const _ = require('lodash');

/**
 * Converts labels into a string that can be put into a pattern.
 *
 * @param {string|array<string>} labels
 * @return {string}
 */
module.exports.stringifyLabels = function stringifyLabels(labels) {
  labels = _.concat([], labels);
  return _.join(_.map(labels, label => ':' + label), '');
};


/**
 * Converts conditions into a string that could be inserted into a pattern.
 * @param {object} conditions
 * @return {string}
 */
module.exports.stringifyConditions = function stringifyConditions(conditions) {
  if (_.isEmpty(conditions)) {
    return '';
  }

  let pairs = _.filter(_.toPairs(conditions), clause => {
    return !_.isObject(conditions[1]);
  });
  return '{' + _.join(_.map(pairs, pair => {
    let quote = '';
    if (_.isString(pair[1])) {
      quote = '"';
    }

    return pair[0] + ': ' + quote + pair[1] + quote;
  }), ', ')+ '}';
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
