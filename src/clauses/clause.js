class Clause {
  /**
   * Turns the clause into a query structure.
   * @param {ParameterBag} [parameterBag=null]
   * @return {object} Query object with two properties: query and params.
   */
  toQuery(parameterBag = null) {
    return {
      query: '',
      params: {},
    };
  }

  toString() {
    // let query = this.toQuery();
    // query.replace(/\$(\w+)/g, (fullMatch, paramName) => {
    //   if (this.param[paramName] !== undefined) {
    //     return this.param[paramName];
    //   }
    //   return fullMatch;
    // });
    return JSON.stringify(this.toQuery());
  }
}
module.exports = Clause;
