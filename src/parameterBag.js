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
		this.parent = null;
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
		if (this.parent) {
			param = this.parent.addParam(value, name);
		}
		else {
			if (!name) {
				name = this.getName();
			}

			param = new Parameter(name, value);
		}

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

	addExistingParam(param) {
		if (this.parent) {
			this.parent.addExistingParam(param);
		}
		else {
			let existing = _.find(this.parameters, { name: param.name });
			if (existing) {
				param.name = this.getName();
			}
		}
		this.parameters.push(param);
	}

	/**
	 * Sets the parent of this parameter bag. All existing params will be added
	 * to the parent and possibly renamed to avoid collisions.
	 * @param {ParameterBag} parent
	 */
	setParent(parent) {
		if (this.parent === null) {
			this.parent = parent;
			this.parameters.forEach(param => parent.addExistingParam(param));
		}
	}
}

module.exports = ParameterBag;
module.exports.Parameter = Parameter;
