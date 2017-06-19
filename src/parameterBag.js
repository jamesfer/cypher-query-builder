class Parameter {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}

	setName(name) {
		this.name = name;
	}

	toString() {
		return '$' + name;
	}
}

class ParameterBag {
	constructor() {
		this.count = 0;
		this.parameters = [];
	}

	addParam(value, name = null) {
		if (!name) {
			name = 'p' + (this.count ? this.count : '');
		}

		let param = new Parameter(name, value);
		this.parameters.push(param);
		return param;
	}
}

module.exports = ParameterBag;
