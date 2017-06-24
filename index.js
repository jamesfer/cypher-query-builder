const Query = require('./src/query');
const Node = require('./src/clauses/node');
const Relation = require('./src/clauses/relation');
const Match = require('./src/clauses/match');
const Return = require('./src/clauses/return');
const Statement = require('./src/statement');
const Connection = require('./src/connection');
const neo4j = require('neo4j-driver').v1;


let con = new Connection('bolt://localhost', { username: 'neo4j', password: 'admin' })
let query = new Query(con);
query.match([
  new Node('node', 'Record'),
  new Relation('out', 'rel', ['Has'], { type: 'date' }),
  new Node(null, 'Field')
]);
query.ret('node');
console.log(query.build());
let result = query.run()
  .then(result => {
    console.log(result);
    con.close();
  });


// Create a driver instance, for the user neo4j with password neo4j.
// It should be enough to have a single driver per database per application.
// var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'admin'));
//
// let session = driver.session();
// session
//   .run('MERGE (alice:Person {name : {nameParam} }) RETURN alice.name AS name', {nameParam: 'Alice'})
//   .then(result => {
//     console.log(result);
//   });
//
// setTimeout(function() {
//   console.log('Nothering');
//   driver.close();
// }, 3000);
