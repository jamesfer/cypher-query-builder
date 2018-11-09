import { neo4jCredentials, neo4jUrl, waitForNeo } from './utils';
import { Connection } from '../src';
import { expect } from '../test-setup';
import { Dictionary, isNil } from 'lodash';
import { node, relation } from '../src/clauses';

function expectResults(
  results: any[],
  length?: number | null,
  properties?: string[] | null,
  cb?: null | ((row: any) => any),
) {
  expect(results).to.be.an.instanceOf(Array);

  if (!isNil(length)) {
    expect(results).to.have.lengthOf(length);
  }

  results.forEach((row) => {
    expect(row).to.be.an.instanceOf(Object);

    if (!isNil(properties)) {
      expect(row).to.have.own.keys(properties);
    }

    if (!isNil(cb)) {
      cb(row);
    }
  });
}

function expectNode(record: any, labels?: string[], properties?: Dictionary<any>) {
  expect(record).to.be.an.instanceOf(Object)
    .and.to.have.keys(['identity', 'properties', 'labels']);

  expect(record.identity).to.be.a('string')
    .and.to.match(/[0-9]+/);

  expect(record.labels).to.be.an.instanceOf(Array);
  record.labels.forEach((label: string) => expect(label).to.be.a('string'));
  if (labels) {
    expect(record.labels).to.have.members(labels);
  }

  expect(record.properties).to.be.an('object');
  if (properties) {
    expect(record.properties).to.eql(properties);
  }
}

function expectRelation(relation: any, label?: string, properties?: Dictionary<any>) {
  expect(relation).to.be.an.instanceOf(Object)
    .and.to.have.keys(['identity', 'properties', 'label', 'start', 'end']);

  expect(relation.identity).to.be.a('string')
    .and.to.match(/[0-9]+/);
  expect(relation.start).to.be.a('string')
    .and.to.match(/[0-9]+/);
  expect(relation.end).to.be.a('string')
    .and.to.match(/[0-9]+/);

  expect(relation.label).to.be.a('string');
  if (label) {
    expect(relation.label).to.equal(label);
  }

  expect(relation.properties).to.be.an('object');
  if (properties) {
    expect(relation.properties).to.eql(properties);
  }
}

describe('scenarios', () => {
  let db: Connection;

  before(waitForNeo);
  before(() => db = new Connection(neo4jUrl, neo4jCredentials));
  before(() => db.matchNode('node').detachDelete('node').run());
  after(() => db.matchNode('node').detachDelete('node').run());
  after(() => db.close());

  describe('node', () => {
    it('should create a node', async () => {
      const results = await db.createNode('person', 'Person', { name: 'Alan', age: 45 })
        .return('person')
        .run();

      expectResults(results, 1, ['person'], (row) => {
        expectNode(row.person, ['Person'], { name: 'Alan', age: 45 });
      });
    });

    it('should create a node without returning anything', async () => {
      const results = await db.createNode('person', 'Person', { name: 'Steve', age: 42 })
        .run();

      expectResults(results, 0);
    });

    it('should fetch multiple nodes', async () => {
      const results = await db.matchNode('person', 'Person')
        .return('person')
        .run();

      expectResults(results, 2, ['person'], (row) => {
        expectNode(row.person, ['Person']);
        expect(row.person.properties).to.have.keys(['name', 'age']);
      });
    });

    it('should fetch a property of a set of nodes', async () => {
      const results = await db.matchNode('person', 'Person')
        .return({ 'person.age': 'yearsOld' })
        .run();

      expectResults(results, 2, ['yearsOld'], row => expect(row.yearsOld).to.be.an('number'));
    });

    it('should return an array property', async () => {
      const results = await db.createNode('arrNode', 'ArrNode', {
        values: [1, 2, 3],
      })
        .return('arrNode')
        .run();

      expectResults(results, 1, ['arrNode'], (row) => {
        expectNode(row.arrNode, ['ArrNode'], {
          values: [1, 2, 3],
        });
      });
    });

    it('should return a relationship', async () => {
      const results = await db.create([
        node('person', 'Person', { name: 'Alfred', age: 64 }),
        relation('out', 'hasJob', 'HasJob', { since: 2004 }),
        node('job', 'Job', { name: 'Butler' }),
      ])
        .return(['person', 'hasJob', 'job'])
        .run();

      expectResults(results, 1, ['person', 'hasJob', 'job'], (row) => {
        expectNode(row.person, ['Person'], { name: 'Alfred', age: 64 });
        expectRelation(row.hasJob, 'HasJob', { since: 2004 });
        expectNode(row.job, ['Job'], { name: 'Butler' });
      });
    });

    it('should handle an array of nodes and relationships', async () => {
      // Create relationships
      await db.create([
        node(['City'], { name: 'Cityburg' }),
        relation('out', ['Road'], { length: 10 }),
        node(['City'], { name: 'Townsville' }),
        relation('out', ['Road'], { length: 5 }),
        node(['City'], { name: 'Rural hideout' }),
        relation('out', ['Road'], { length: 14 }),
        node(['City'], { name: 'Village' }),
      ])
        .run();

      const results = await db.raw('MATCH p = (:City)-[:Road*3]->(:City)')
        .return({ 'relationships(p)': 'rels', 'nodes(p)': 'nodes' })
        .run();

      expectResults(results, 1, ['rels', 'nodes'], (row) => {
        expect(row.rels).to.be.an.instanceOf(Array)
          .and.to.have.a.lengthOf(3);
        row.rels.forEach((rel: any) => {
          expectRelation(rel, 'Road');
          expect(rel.properties).to.have.own.keys(['length']);
        });

        expect(row.nodes).to.be.an.instanceOf(Array)
          .and.to.have.a.lengthOf(4);
        row.nodes.forEach((node: any) => {
          expectNode(node, ['City']);
          expect(node.properties).to.have.own.keys(['name']);
        });
      });
    });
  });

  describe('literals', () => {
    it('should handle value literals', async () => {
      const results = await db.return([
        '1 AS numberVal',
        '"string" AS stringVal',
        'null AS nullVal',
        'true AS boolVal',
      ])
        .run();

      expectResults(results, 1, null, (row) => {
        expect(row).to.have.own.property('numberVal', 1);
        expect(row).to.have.own.property('stringVal', 'string');
        expect(row).to.have.own.property('nullVal', null);
        expect(row).to.have.own.property('boolVal', true);
      });
    });

    it('should handle an array literal', async () => {
      const results = await db.return('range(0, 5)').run();

      expectResults(results, 1, ['range(0, 5)'], (row) => {
        expect(row['range(0, 5)']).to.eql([0, 1, 2, 3, 4, 5]);
      });
    });

    it('should handle a map literal', async () => {
      const results = await db.return('{ a: 1, b: true, c: "a string" } as map').run();

      expectResults(results, 1, ['map'], (row) => {
        expect(row.map).to.eql({ a: 1, b: true, c: 'a string' });
      });
    });

    it('should handle a nested array literal', async () => {
      const results = await db.return('{ a: [1, 2, 3], b: [4, 5, 6] } as map').run();

      expectResults(results, 1, ['map'], (row) => {
        expect(row.map).to.eql({ a: [1, 2, 3], b: [4, 5, 6] });
      });
    });

    it('should handle a nested map literal', async () => {
      const results = await db.return('[{ a: "name", b: true }, { c: 1, d: null }] as arr').run();

      expectResults(results, 1, ['arr'], (row) => {
        expect(row.arr).to.eql([
          { a: 'name', b: true },
          { c: 1, d: null },
        ]);
      });
    });
  });
});
