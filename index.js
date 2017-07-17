module.exports = Object.assign({
	Connection: require('./src/connection'),
	Query: require('./src/query'),
}, require('./src/clauses'));
