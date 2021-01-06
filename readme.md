# Cypher Query Builder
[![Build Status](https://github.com/jamesfer/cypher-query-builder/workflows/CI/badge.svg)](https://github.com/jamesfer/cypher-query-builder/actions)
[![Coverage Status](https://coveralls.io/repos/github/jamesfer/cypher-query-builder/badge.svg?branch=master)](https://coveralls.io/github/jamesfer/cypher-query-builder?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) 

<a href="https://www.patreon.com/jamesfer" title="Become a patreon"> 
  <img alt="Become a patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="200">
</a>

A flexible and intuitive query builder for Neo4j and Cypher.
Write queries in Javascript just as you would write them in Cypher.

- Easy to use fluent interface
- Support for streaming records using observables
- Full Typescript declarations included in package

```javascript
let results = await db.matchNode('user', 'User', { active: true })
  .where({ 'user.age': greaterThan(18) })
  .with('user')
  .create([
    cypher.node('user', ''),
    cypher.relation('out', '', 'HasVehicle'),
    cypher.node('vehicle', 'Vehicle', { colour: 'red' })
  ])
  .ret(['user', 'vehicle'])
  .run();

// Results:
// [{
//   user: {
//     identity: 1234,
//     labels: [ 'User' ],
//     properties: { ... },
//   },
//   vehicle: {
//     identity: 4321,
//     labels: [ 'Vehicle' ],
//     properties: { ... },
//   },
// }]
```

## Contents

- [Quick start](#quick-start)
  - [Installation](#installation)
  - [Importing](#importing)
  - [Connecting](#connecting)
  - [Querying](#querying)
  - [Processing](#processing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Quick start

### Installation

```
npm install --save cypher-query-builder
```
or

```
yarn install cypher-query-builder
```

### Importing

CommonJS/Node

```javascript
const cypher = require('cypher-query-builder');
// cypher.Connection
// cypher.greaterThan
// ....
```

ES6

```javascript
import { Connection, greaterThan } from 'cypher-query-builder';
```

### Connecting

```javascript
const cypher = require('cypher-query-builder');

// Make sure to include the protocol in the hostname
let db = new cypher.Connection('bolt://localhost', {
  username: 'root',
  password: 'password',
});
```

Cypher query builder uses the official Neo4j Nodejs driver over the bolt
protocol in the background so you can pass any values into connection that
are accepted by that driver.

### Querying

ES6

```javascript
db.matchNode('projects', 'Project')
  .return('projects')
  .run()
  .then(function (results) {
    // Do something with results
  });
```

ES2017

```javascript
const results = await db.matchNode('projects', 'Project')
  .return('projects')
  .run();
```

`run` will execute the query and return a promise. The results are in the
_standardish_ Neo4j form an array of records:

```javascript
const results = [
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
      // This behaviour is currently in consideration and may change
      // in the future.
      properties: { name: 'Project 1' },
    },
  },
  // ...
]
```

You can also use the `stream` method to download the results as an observable.

```javascript
const results = db.matchNode('project', 'Project')
  .ret('project')
  .stream();

results.subscribe(row => console.log(row.project.properties.name));
```

### Processing

To extract the results, you can use ES5 array methods or a library like lodash:

```javascript
// Get all the project nodes (including their id, labels and properties).
let projects = results.map(row => row.projects);

// Get just the properties of the nodes
let projectProps = results.map(row => row.projects.properties);
```

## Documentation

All the reference documentation can be found [here](http://jamesfer.me/cypher-query-builder).
However, the two most useful pages are probably:

 - The [Connection](https://jamesfer.me/cypher-query-builder/classes/connection.html) class, for 
   details on creating and using a connection.
 - The [Query](https://jamesfer.me/cypher-query-builder/classes/query.html) class, for details on 
   all the available clauses, and building and running queries.

## Contributing

Please feel free to submit any bugs or questions you may have in an 
[issue](https://github.com/jamesfer/cypher-query-builder/issues). I'm very open to discussing 
suggestions or new ideas so don't hesitate to reach out.

Maintaining the library does take some time out of my schedule so if you'd like to show your 
appreciation please consider donating. Even the smallest amount is really encouraging.

<a href="https://www.patreon.com/jamesfer" title="Become a patreon"> 
  <img alt="Become a patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="200">
</a>

## License

MIT License

Copyright (c) 2018 James Ferguson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
