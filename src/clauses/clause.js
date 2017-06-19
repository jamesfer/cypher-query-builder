class Clause {
  constructor() {
    this.params = {};
  }

  addParam(name, value) {
    while (this.param[name] !== undefined) {
      name += '1';
    }

    this.param[name] = value;
  }

  build() {

  }

  toQuery() {
    return '';
  }

  toString() {
    let query = this.toQuery();
    query.replace(/\$(\w+)/g, (fullMatch, paramName) => {
      if (this.param[paramName] !== undefined) {
        return this.param[paramName];
      }
      return fullMatch;
    });
  }
}
module.exports = Clause;
