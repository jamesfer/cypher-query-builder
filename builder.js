const _ = require('lodash');

class Builder {
  match(patterns) {
    if (patterns.length > 0 && !_.isArray(patterns[0])) {
      patterns = [patterns];
    }
    let clause = _.join(_.map(patterns, pattern => _.join(pattern, '')), ', ');
    return 'MATCH ' + clause;
  }

  optionalMatch(patterns) {
    return 'OPTIONAL ' + this.match(patterns);
  }

  ret(props) {
    if (_.isString(props)) {
      props = [props];
    }

    if (_.isArray(props)) {
      props = _.map(props, prop => {
        if (_.indexOf(prop, '.') === -1) {
          prop = 'node.' + prop;
        }
        return prop;
      });
    }
    else if (_.isPlainObject(props)) {
      props = _.flatten(_.values(_.mapValues(props, (propNames, varName) => {
        return _.map(propNames, propName => {
          return varName + '.' + propName;
        });
      })));
    }

    return 'RETURN ' + _.join(props, ', ');
  }

  node(labels, clauses = {}, varName = '') {
    let labelString = this.stringifyLabels(labels);
    let clauseString = this.stringifyClauses(clauses);
    let internalString = _.trim(`${varName}${labelString} ${clauseString}`);
    return '(' + internalString + ')';
  }

  // TODO: support -- relations
  relation(dir, labels, clauses = {}, varName = '', pathLengthBounds) {
    let labelString = this.stringifyLabels(labels);
    let clauseString = this.stringifyClauses(clauses);
    let pathLengthString = this.stringifyPathLength(pathLengthBounds);
    let internalString = _.trim(`${varName}${labelString}${pathLengthString} ${clauseString}`);

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    }

    return arrows[dir][0] + internalString + arrows[dir][1];
  }

  /**
   * Converts labels into a string that can be put into a pattern.
   *
   * @param {string|array<string>} labels
   * @return {string}
   */
  stringifyLabels(labels) {
    labels = _.concat([], labels);
    return _.join(_.map(labels, label => ':' + label), '');
  }

  /**
   * Converts clauses into a string that could be inserted into a pattern.
   * @param {object} clauses
   * @return {string}
   */
  stringifyClauses(clauses) {
    if (_.isEmpty(clauses)) {
      return '';
    }

    let pairs = _.filter(_.toPairs(clauses), clause => {
      return !_.isObject(clauses[1]);
    });
    return '{' + _.join(_.map(pairs, pair => {
      let quote = '';
      if (_.isString(pair[1])) {
        quote = '\'';
      }

      return pair[0] + ': ' + quote + pair[1] + quote;
    }), ', ')+ '}';
  }

  stringifyPathLength(bounds) {
    if (!bounds) {
      return '';
    }

    if (bounds === '*') {
      return '*';
    }

    if (_.isArray(bounds)) {
      let str = '*';
      if (bounds.length >= 1) {
          str += bounds[0];
      }
      if (bounds.length >= 2) {
        str += '..' + bounds[1];
      }
    }
  }
}

module.exports = new Builder();
