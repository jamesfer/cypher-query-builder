# Cypher Query Builder
![Build Status](https://travis-ci.org/jamesfer/cypher-query-builder.svg?branch=master)

A flexible and intuitive query builder for Neo4j and Cypher. 
Write queries in Javascript just as you would write them in Cypher.

    let results = await db.matchNode('user', 'User', { email: 'email@email.com' })
      .with('user')
      .create([
        cypher.node('user'),
        cypher.relation('out', '', 'HasPost'),
        cypher.node('post', 'Post', { body: 'Hello!' })
      ])
      .ret(['user', 'post'])
      .run();
      
    // Results:
    // [{ 
    //   user: {
    //     identity: 1234,
    //     labels: [ 'User' ],
    //     properites: { ... },
    //   },
    //   post: {
    //     identity: 4321,
    //     labels: [ 'Post' ],
    //     properties: { ... },
    //   },
    // }]

This package is currently in develop and many things are likely to be 
undocumented or to change without warning. However, all feedback is welcome.

## Usage

### Creating a connection
    // Make sure to include the protocol in the hostname
    let db = new cypher.Connection('bolt://localhost', {
      username: 'root',
      password: 'password',
    });
Cypher query builder uses the official Neo4j Nodejs driver over the bolt 
protocol in the background so you can pass any values into connection that
are accepted by that driver.

The Connection class implements the query builder interface.

    db.matchNode('projects', 'Project')
      .ret('projects')
      .run();
      
`run` will execute the query and return a promise. The results are in the
_standardish_ Neo4j form of: 

    // An array of all rows
    [
      // If you return more than one thing in your RETURN clause
      // there will be multiple properties of each row, like in
      // the first example. In this case there is only one.
      {
        projects: {
          // Internal Neo4j node id, don't rely on this to stay constant.
          identity: 1, 
          
          // All labels attached to the node
          labels: [ 'Project' ],
          
          // Actual properties of the node.
          // Note that Neo4j numbers will automatically be converted to 
          // Javascript numbers. This may cause issues because Neo4j can
          // store larger numbers than can be represented in Javascript.
          // This behaviour is currently in development and may change
          // in the future.
          properties: { name: 'Project 1' },
        },
      },
      ...
    ]

I've found that the best way to extract the data you want is with lodash.

    // Get all the project nodes (including their id, labels and properties).
    let projects = map(results, 'projects');
    
    // Get just the properties of the nodes
    let projectProps = map(results, row => row.projects.properties);
    


