import { Connection } from './connection';
import { expect } from 'chai';
import { NodePattern } from './clauses';
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';
import { SinonSpy, SinonStub, spy } from 'sinon';
import { each, Dictionary } from 'lodash';
import {
  defaultCredentials, defaultUrl,
  mockConnection,
} from './connection.mock';
import { Observable } from 'rxjs';

interface MockSession {
  close: SinonSpy;
  run: SinonStub;
}

interface MockDriver {
  close: SinonSpy;
  session: SinonStub;
}

describe('Connection', () => {
  let connection: Connection;
  let session: MockSession;
  let driver: MockDriver;
  beforeEach(() => {
    ({ connection, session, driver } = mockConnection());
  });


  describe('#constructor', () => {
    it('should default to neo4j driver', () => {
      const driverSpy = spy(neo4j, 'driver');
      const connection = new Connection(defaultUrl, defaultCredentials);

      expect(driverSpy.calledOnce);

      connection.close();
      driverSpy.restore();
    });
  });

  describe('#close', () => {
    it('should close the driver', () => {
      connection.close();
      expect(driver.close.calledOnce);
    });

    it('should only close the driver once', () => {
      connection.close();
      connection.close();
      expect(driver.close.calledOnce);
    });
  });

  describe('#session', () => {
    it('should use the driver to create a session', () => {
      connection.session();
      expect(driver.session.calledOnce);
    });

    it('should return null if the connection has been closed', () => {
      connection.close();
      const result = connection.session();

      expect(driver.session.notCalled);
      expect(result).to.equal(null);
    });
  });

  describe('#run', () => {
    it('should throw if there are no clauses in the query', () => {
      const run = () => connection.run(connection.query());
      expect(run).to.throw(Error, 'no clauses');
    });

    it('should throw if the connection has been closed', () => {
      connection.close();

      const run = () => connection.run(connection.query());
      expect(run).to.throw(Error, 'connection is not open');
    });

    it('should run the query through a session', () => {
      session.run.returns(Promise.resolve(true));
      const params = {};
      const query = (new Query()).raw('This is a query', params);

      const promise = connection.run(query);
      return expect(promise).to.be.fulfilled.then(() => {
        expect(session.run.calledOnce);
        expect(session.run.calledWith('This is a query', params));
      });
    });

    it('should close the session after running a query', () => {
      session.run.returns(Promise.resolve(true));
      const promise = connection.run((new Query()).raw(''));

      return expect(promise).to.be.fulfilled.then(() => {
        expect(session.close.calledOnce);
      });
    });

    it('should close the session when run() throws', async () => {
      session.run.returns(Promise.reject('Error'));
      const promise = connection.run((new Query()).raw(''));

      return expect(promise).to.be.rejectedWith('Error')
        .then(() => {
          expect(session.close.calledOnce);
        });
    });
  });

  describe('stream', () => {
    const params = {};
    const query = (new Query()).raw('This is a query', params);
    const expectedResults = [
      { number: 1 },
      { number: 2 },
      { number: 3 },
    ];
    // Convert the expected results into a 'record'
    const records = expectedResults.map(value => ({
      toObject() { return value; },
    }));

    beforeEach('setup session run return value', () => {
      session.run.returns(Observable.from(records));
    });

    it('should throw if there are no clauses in the query', () => {
      const stream = () => connection.stream(connection.query());
      expect(stream).to.throw(Error, 'no clauses');
    });

    it('should throw if the connection has been closed', () => {
      connection.close();
      const stream = () => connection.stream(query);
      expect(stream).to.throw(Error, 'connection is not open');
    });

    it('should run the query through a session', (done) => {
      const observable = connection.stream(query);
      expect(observable).to.be.an.instanceOf(Observable);

      let count = 0;
      observable.subscribe(
        // On next
        (row) => {
          expect(row).to.deep.equal(expectedResults[count]);
          count += 1;
        },
        // On error
        undefined,
        // On complete
        () => {
          expect(session.run.calledOnce);
          expect(session.run.calledWith('This is a query', params));
          done();
        },
      );
    });

    it('should close the session after running a query', (done) => {
      const observable = connection.stream(query);

      expect(observable).to.be.an.instanceOf(Observable);
      observable.subscribe(undefined, undefined, () => {
        expect(session.close.calledOnce);
        done();
      });
    });

    it('should close the session when run() throws', (done) => {
      session.run.returns(Observable.throw('error'));
      const observable = connection.stream(query);

      expect(observable).to.be.an.instanceOf(Observable);
      observable.subscribe(
        () => expect.fail(null, null, 'Observable should not emit any items'),
        () => {
          expect(session.close.calledOnce);
          done();
        },
        () => expect.fail(null, null, 'Observable should not complete without an error'),
      );
    });
  });

  describe('query methods', () => {
    const methods: Dictionary<Function> = {
      query: () => connection.query(),
      matchNode: () => connection.matchNode('Node'),
      match: () => connection.match(new NodePattern('Node')),
      optionalMatch: () => connection.optionalMatch(new NodePattern('Node')),
      createNode: () => connection.createNode('Node'),
      create: () => connection.create(new NodePattern('Node')),
      return: () => connection.return('node'),
      with: () => connection.with('node'),
      unwind: () => connection.unwind([1, 2, 3], 'number'),
      delete: () => connection.delete('node'),
      detachDelete: () => connection.detachDelete('node'),
      set: () => connection.set({}, { override: false }),
      setLabels: () => connection.setLabels({}),
      setValues: () => connection.setValues({}),
      setVariables: () => connection.setVariables({}, false),
      skip: () => connection.skip(1),
      limit: () => connection.limit(1),
      where: () => connection.where([]),
      orderBy: () => connection.orderBy('name'),
      raw: () => connection.raw('name'),
    };

    each(methods, (fn, name) => {
      it(name + ' should return a query object', () => {
        expect(fn()).to.be.an.instanceof(Query);
      });
    });
  });
});
