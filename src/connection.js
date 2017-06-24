const Query = require('./query');
const neo4j = require('neo4j-driver').v1;
const nodeCleanup = require('node-cleanup');

let connections = [];

// Closes all open connections
nodeCleanup(function() {
	connections.forEach(con => {
		con.close();
	});
	connections = [];
});

class Connection {
	constructor(url, credentials) {
		this.url = url;
		this.auth = neo4j.auth.basic(credentials.username, credentials.password);
		this.driver = neo4j.driver(this.url, this.auth);
		this.open = true;
		connections.push(this);
	}

	/**
	 * Closes the connect if it is open.
	 */
	close() {
		if (this.open) {
			this.driver.close();
			this.open = false;
		}
	}

	/**
	 * Opens and returns a session.
	 */
	session() {
		if (this.open) {
			return this.driver.session();
		}
		return null;
	}


	/** Query shortcut methods. */

	matchNode(varName, labels = [], clauses = {}) {
		let query = new Query(this);
		query.matchNode(varName, labels, clauses);
		return query;
	}

	match(patterns, settings) {
		let query = new Query(this);
		query.match(patterns, settings);
		return query;
	}

	createNode(varName, labels = [], clauses = {}) {
		let query = new Query(this);
		query.createNode(varName, labels, clauses);
		return query;
	}

	create(patterns) {
		let query = new Query(this);
		query.create(patterns);
		return query;
	}

	ret(terms) {
		let query = new Query(this);
		query.ret(terms);
		return query;
	}
}


module.exports = Connection;
