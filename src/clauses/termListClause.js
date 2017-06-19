const _ = require('lodash');
const Clause = require('./clause');

class TermListClause extends Clause {
  constructor(terms) {
    super();

    this.terms = _.concat([], terms);
  }

  toString() {
    return _.join(_.flattenDeep(_.map(this.terms, (term) => {
      if (_.isString(term)) {
        return term;
      }

      if (_.isPlainObject(term)) {
        return _.values(_.mapValues(term, (value, key) => {
          if (_.isString(value)) {
            return key + ' AS ' + value;
          }

          if (_.isArray(value)) {
            return _.map(value, (prop) => {
              if (_.isString(prop)) {
                return key + '.' + prop;
              }

              if (_.isPlainObject(prop)) {
                return _.values(_.mapValues(prop, (propAlias, propName) => {
                  return key + '.' + propName + ' AS ' + propAlias;
                }));
              }
            });
          }
        }));
      }
    })), ', ');
  }
}

module.exports = TermListClause;
