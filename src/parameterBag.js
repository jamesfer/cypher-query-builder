const _ = require('lodash');

class Parameter {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}

	setName(name) {
		this.name = name;
	}

	toString() {
		return '$' + this.name;
	}
}

class ParameterBag {
	constructor() {
		this.count = 0;
		this.parameters = [];
		// this.parent = null;
	}

	/**
	 * Constructs a unique name for this parameter bag.
	 * @return {string}
	 */
	getName() {
		this.count += 1;
		return 'p' + this.count;
	}

	/**
	 * Adds a new parameter to this bag. If this bag has a parent, it will also
	 * be added to the parent.
	 * @param {*} value
	 * @param {string} [name=null]
	 */
	addParam(value, name = null) {
		let param = null;
		if (!name) {
			name = this.getName();
		}
		param = new Parameter(name, value);
		this.parameters.push(param);
		return param;
	}

	/**
	 * Returns the params in a name: value object suitable for putting into a
	 * query object.
	 * @return {object}
	 */
	getParams(){
		return _.fromPairs(_.map(this.parameters, (param) => {
			return [param.name, param.value]
		}));
	}
}

module.exports = ParameterBag;
module.exports.Parameter = Parameter;
