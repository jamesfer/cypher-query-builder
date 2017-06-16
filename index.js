const builder = require('./builder');


// console.log(builder.node('PERSON', {name: true}), builder.relation('out', 'LIKES', {rating: 7}), builder.node('PERSON', {}, 'friends'));


console.log(builder.ret({image: ['status', 'url'], owner: ['name', 'address']}));
