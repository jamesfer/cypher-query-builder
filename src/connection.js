const Query = require('./query');
const neo4j = require('neo4j-driver').v1;
const nodeCleanup = require('node-cleanup');
const Transformer = require('./transformer');

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
		this.transformer = new Transformer();
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

	/**
	 * Returns a new query that uses this connection.
	 * @return {Query}
	 */
	query() {
		return new Query(this);
	}

	/**
	 * Runs a query in a session using this connection.
	 * @param {Query} query
	 * @return {Promise<Array>}
	 */
	run(query) {
		if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (!query.statements.length) {
      throw Error('Cannot run query: no statements attached to the query.');
    }

    let queryObj = query.buildQueryObject();
		let session = this.session();
    return session.run(queryObj.query, queryObj.params)
      .then(result => {
        session.close();
        return this.transformer.transformResult(result);
      })
      .catch(error => {
        session.close();
        return Promise.reject(error);
      });
	}
}


/** Query shortcut methods. */

[
	'matchNode',
	'match',
	'createNode',
	'create',
	'ret',
].forEach(name => {
	Connection.prototype[name] = function () {
		return Query.prototype[name].apply(this.query(), arguments);
	}
});


module.exports = Connection;
