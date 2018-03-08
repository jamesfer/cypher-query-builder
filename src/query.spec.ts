import { Query } from './query';
import { expect } from '../test-setup';
import { Dictionary, each } from 'lodash';
import { NodePattern } from './clauses';
import { mockConnection } from './connection.mock';
import { spy, stub } from 'sinon';
import { ClauseCollection } from './clause-collection';

describe('Query', function() {
  describe('query methods', function() {
    const query = new Query();
    const methods: Dictionary<Function> = {
      matchNode: () => query.matchNode('Node'),
      match: () => query.match(new NodePattern('Node')),
      optionalMatch: () => query.optionalMatch(new NodePattern('Node')),
      createNode: () => query.createNode('Node'),
      create: () => query.create(new NodePattern('Node')),
      return: () => query.return('node'),
      with: () => query.with('node'),
      unwind: () => query.unwind([ 1, 2, 3 ], 'number'),
      delete: () => query.delete('node'),
      detachDelete: () => query.detachDelete('node'),
      set: () => query.set({}, { override: false }),
      setLabels: () => query.setLabels({}),
      setValues: () => query.setValues({}),
      setVariables: () => query.setVariables({}, false),
      skip: () => query.skip(1),
      limit: () => query.limit(1),
      where: () => query.where([]),
      orderBy: () => query.orderBy('name'),
      raw: () => query.raw('name'),
    };

    each(methods, (fn, name) => {
      it(name + ' should return a chainable query object', function() {
        expect(fn()).to.equal(query);
        expect(query.getClauses().length === 1);
      });
    });
  });

  describe('proxied methods', function() {
    const methods: (keyof ClauseCollection)[] = [
      'build',
      'toString',
      'buildQueryObject',
      'interpolate',
      'getClauses',
    ];

    class TestQuery extends Query {
      getClauseCollection() {
        return this.clauses;
      }
    }

    const query = new TestQuery();

    each(methods, method => {
      const methodSpy = spy(query.getClauseCollection(), method);
      query[method]();
      expect(methodSpy.calledOnce).to.be.true;
      methodSpy.restore();
    });
  });

  describe('#run', function() {
    it('should reject the promise if there is no attached connection object', function() {
      let query = new Query();
      return expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
    });

    it('should run the query on its connection', function() {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      const query = (new Query(connection)).raw('Query');
      return expect(query.run()).to.be.fulfilled.then(() => {
        expect(runStub.calledOnce);
      });
    });
  });

  describe('#stream', function() {
    it('should throw if there is no attached connection object', function () {
      let query = new Query();
      expect(() => query.stream()).to.throw(Error, 'no connection object available');
    });

    it('should run the query on its connection', function () {
      const { connection } = mockConnection();
      const streamStub = stub(connection, 'stream');
      const query = (new Query(connection)).raw('Query');
      query.stream();
      expect(streamStub.calledOnce);
    });
  });

  describe('#first', function() {
    it('should reject the promise if there is no attached connection object', function() {
      let query = new Query();
      return expect(query.first()).to.be.rejectedWith(Error, 'no connection object available');
    });

    it('should run the query on its connection and return the first result', function() {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      const firstRecord = { number: 1 };
      runStub.returns([ firstRecord, { number: 2 }, { number: 3 } ]);

      const query = (new Query(connection)).raw('Query');
      return expect(query.first()).to.be.fulfilled.then(result => {
        expect(runStub.calledOnce);
        expect(result).to.equal(firstRecord);
      });
    });

    it('should return undefined if the query returns no results', function() {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      runStub.returns([]);

      const query = (new Query(connection)).raw('Query');
      return expect(query.first()).to.be.fulfilled.then(result => {
        expect(runStub.calledOnce);
        expect(result).to.equal(undefined);
      });
    })
  });
});
