const Query = require('./src/query');

let query = new Query();
query.matchNode('node', 'Record');
query.ret('node');
console.log(query.build());
