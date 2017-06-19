const _ = require('lodash');

class ClauseContainer {
	constructor(clauses = null) {
		this.clauses = clauses || [];
	}

	/**
	 * Constructs a query object for this part of the query.
	 * @return {object}
	 */
	build() {
		return this.mergeClauses(this.clauses);
	}

	/**
	 * Merges all of its child clauses together by concatenating the queries in
	 * order with a delimiter and merging each param object.
	 * @param {String} [delimiter='\n']
	 * @return {object}
	 */
	mergeClauses(clauses, delimiter = '\n') {
		let queryObjs = _.map(this.clauses, clause => clause.build());
		return {
			query: _.join(_.map(queryObjs, 'query'), delimiter),
			params: _.assign({}, ..._.map(queryObjs, 'params')),
		};
	}
}
