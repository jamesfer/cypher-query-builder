import { Query } from './query';
import { expect } from '../test-setup';
import { Dictionary, each } from 'lodash';
import { node, NodePattern } from './clauses';
import { mockConnection } from '../tests/connection.mock';
import { spy, stub } from 'sinon';
import { ClauseCollection } from './clause-collection';

describe('Query', () => {
  describe('query methods', () => {
    const methods: Dictionary<(q: Query) => Query> = {
      matchNode: q => q.matchNode('Node'),
      match: q => q.match(new NodePattern('Node')),
      optionalMatch: q => q.optionalMatch(new NodePattern('Node')),
      createNode: q => q.createNode('Node'),
      create: q => q.create(new NodePattern('Node')),
      return: q => q.return('node'),
      with: q => q.with('node'),
      unwind: q => q.unwind([1, 2, 3], 'number'),
      delete: q => q.delete('node'),
      detachDelete: q => q.detachDelete('node'),
      set: q => q.set({}, { override: false }),
      setLabels: q => q.setLabels({}),
      setValues: q => q.setValues({}),
      setVariables: q => q.setVariables({}, false),
      skip: q => q.skip(1),
      limit: q => q.limit(1),
      where: q => q.where([]),
      orderBy: q => q.orderBy('name'),
      raw: q => q.raw('name'),
      merge: q => q.merge(node('name')),
      onCreateSet: q => q.onCreate.set({ labels: { a: 'Label' } }),
      onCreateSetLabels: q => q.onCreate.setLabels({ a: 'Label' }),
      onCreateSetValues: q => q.onCreate.setValues({ a: 'name' }),
      onCreateSetVariables: q => q.onCreate.setVariables({ a: 'steve' }),
      onMatchSet: q => q.onMatch.set({ labels: { a: 'Label' } }),
      onMatchSetLabels: q => q.onMatch.setLabels({ a: 'Label' }),
      onMatchSetValues: q => q.onMatch.setValues({ a: 'name' }),
      onMatchSetVariables: q => q.onMatch.setVariables({ a: 'steve' }),
    };

    each(methods, (fn, name) => {
      it(`${name} should return a chainable query object`, () => {
        const query = new Query();
        expect(fn(query)).to.equal(query);
        expect(query.getClauses().length === 1);
        expect(query.build()).to.equal(`${query.getClauses()[0].build()};`);
      });
    });
  });

  describe('proxied methods', () => {
    class TestQuery extends Query {
      getClauseCollection() {
        return this.clauses;
      }
    }

    const query = new TestQuery();

    const methods: (keyof ClauseCollection)[] = [
      'build',
      'toString',
      'buildQueryObject',
      'interpolate',
      'getClauses',
    ];

    each(methods, (method) => {
      const methodSpy = spy(query.getClauseCollection(), method);
      query[method]();
      expect(methodSpy.calledOnce).to.be.true;
      methodSpy.restore();
    });
  });

  describe('#run', () => {
    it('should reject the promise if there is no attached connection object', () => {
      const query = new Query();
      return expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
    });

    it('should run the query on its connection', () => {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      runStub.returns(Promise.resolve());
      const query = (new Query(connection)).raw('Query');
      return expect(query.run()).to.be.fulfilled.then(() => {
        expect(runStub.calledOnce);
      });
    });
  });

  describe('#stream', () => {
    it('should throw if there is no attached connection object', () => {
      const query = new Query();
      expect(() => query.stream()).to.throw(Error, 'no connection object available');
    });

    it('should run the query on its connection', () => {
      const { connection } = mockConnection();
      const streamStub = stub(connection, 'stream');
      const query = (new Query(connection)).raw('Query');
      query.stream();
      expect(streamStub.calledOnce);
    });
  });

  describe('#first', () => {
    it('should reject the promise if there is no attached connection object', () => {
      const query = new Query();
      return expect(query.first()).to.be.rejectedWith(Error, 'no connection object available');
    });

    it('should run the query on its connection and return the first result', () => {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      const firstRecord = { number: 1 };
      runStub.returns(Promise.resolve([firstRecord, { number: 2 }, { number: 3 }]));

      const query = (new Query(connection)).raw('Query');
      return expect(query.first()).to.be.fulfilled.then((result) => {
        expect(runStub.calledOnce);
        expect(result).to.equal(firstRecord);
      });
    });

    it('should return undefined if the query returns no results', () => {
      const { connection } = mockConnection();
      const runStub = stub(connection, 'run');
      runStub.returns(Promise.resolve([]));

      const query = (new Query(connection)).raw('Query');
      return expect(query.first()).to.be.fulfilled.then((result) => {
        expect(runStub.calledOnce);
        expect(result).to.equal(undefined);
      });
    });
  });
});
