import { Query } from './query';
import { expect } from '../test-setup';
import { Dictionary, each } from 'lodash';
import { NodePattern } from './clauses';
import { Connection } from './connection';
import { mockConnection } from './connection.mock';
import { stub } from 'sinon';

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
        expect(query.getStatements().length === 1);
      });
    });
  });

  describe('#run', function() {
    it('should throw if there is no attached connection object', function() {
      let query = new Query();
      expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
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
});
