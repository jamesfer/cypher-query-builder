const Query = require('./src/query');
const Node = require('./src/clauses/node');
const Relation = require('./src/clauses/relation');
const Match = require('./src/clauses/match');
const Return = require('./src/clauses/return');
const Statement = require('./src/statement');

let query = new Query();
query.match([
  new Node('node', 'Record'),
  new Relation('out', 'rel', ['Has', 'Recent'], { type: 'date' }),
  new Node(null, 'Field')
]);
query.ret('node');
console.log(query.build());

// let node = new Node('node', 'Record');
// let match = new Match(node);
// let ret = new Return('node');
// let query = new Query();
// query.addStatement(match);
// query.addStatement(ret);
// console.log(match.build());
