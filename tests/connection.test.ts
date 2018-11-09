// tslint:disable-next-line import-name
import Observable from 'any-observable';
import { Dictionary, each } from 'lodash';
import { SinonSpy, spy } from 'sinon';
import { v1 as neo4j } from 'neo4j-driver';
import { AuthToken, Config } from 'neo4j-driver/types/v1/driver';
import { Driver } from 'neo4j-driver/types/v1';
import { Connection, Node, Query } from '../src';
import { NodePattern } from '../src/clauses';
import { expect } from '../test-setup';
import { neo4jCredentials, neo4jUrl, waitForNeo } from './utils';

describe('Connection', () => {
  let connection: Connection;
  let driver: Driver;
  let driverCloseSpy: SinonSpy;
  let driverSessionSpy: SinonSpy;
  let sessionRunSpy: SinonSpy;
  let sessionCloseSpy: SinonSpy;

  function makeSessionMock(driver: Driver): Driver {
    const defaultSessionConstructor = driver.session;
    driver.session = function (mode?, bookmark?) {
      const session = defaultSessionConstructor.call(this, mode, bookmark);
      sessionRunSpy = spy(session, 'run');
      sessionCloseSpy = spy(session, 'close');
      return session;
    };
    return driver;
  }

  function driverConstructor(url: string, authToken?: AuthToken, config?: Config) {
    driver = makeSessionMock(neo4j.driver(url, authToken, config));
    driverCloseSpy = spy(driver, 'close');
    driverSessionSpy = spy(driver, 'session');
    return driver;
  }

  // Wait for neo4j to be ready before testing
  before(waitForNeo);

  beforeEach(() => {
    connection = new Connection(neo4jUrl, neo4jCredentials, driverConstructor);
  });

  afterEach(() => connection.close());

  describe('#constructor', () => {
    it('should default to neo4j driver', () => {
      const driverSpy = spy(neo4j, 'driver');
      const connection = new Connection(neo4jUrl, neo4jCredentials);

      expect(driverSpy.calledOnce);

      connection.close();
      driverSpy.restore();
    });

    it('should accept a custom driver constructor function', () => {
      const constructorSpy = spy(driverConstructor);
      const connection = new Connection(neo4jUrl, neo4jCredentials, constructorSpy);
      expect(constructorSpy.calledOnce).to.equal(true);
      expect(constructorSpy.firstCall.args[0]).to.equal(neo4jUrl);
      connection.close();
    });

    it('should pass driver options to the driver constructor', () => {
      const constructorSpy = spy(driverConstructor);
      const driverConfig = { connectionPoolSize: 5 };
      const connection = new Connection(neo4jUrl, neo4jCredentials, {
        driverConfig,
        driverConstructor: constructorSpy,
      });
      expect(constructorSpy.calledOnce).to.equal(true);
      expect(constructorSpy.firstCall.args[0]).to.equal(neo4jUrl);
      expect(constructorSpy.firstCall.args[2]).to.deep.equal(driverConfig);
      connection.close();
    });
  });

  describe('#close', () => {
    it('should close the driver', () => {
      connection.close();
      expect(driverCloseSpy.calledOnce);
    });

    it('should only close the driver once', () => {
      connection.close();
      connection.close();
      expect(driverCloseSpy.calledOnce);
    });
  });

  describe('#session', () => {
    it('should use the driver to create a session', () => {
      connection.session();
      expect(driverSessionSpy.calledOnce);
    });

    it('should return null if the connection has been closed', () => {
      connection.close();
      const result = connection.session();

      expect(driverSessionSpy.notCalled);
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
      const run = () => connection.run(connection.query().matchNode('node'));
      expect(run).to.throw(Error, 'connection is not open');
    });

    it('should run the query through a session', () => {
      const params = {};
      const query = (new Query()).raw('RETURN 1', params);

      const promise = connection.run(query);
      return expect(promise).to.be.fulfilled.then(() => {
        expect(sessionRunSpy.calledOnce);
        expect(sessionRunSpy.calledWith('RETURN 1', params));
      });
    });

    it('should close the session after running a query', () => {
      const promise = connection.run((new Query()).raw('RETURN 1'));
      return expect(promise).to.be.fulfilled
        .then(() => expect(sessionCloseSpy.calledOnce));
    });

    it('should close the session when run() throws', async () => {
      const promise = connection.run((new Query()).raw('RETURN a'));
      return expect(promise).to.be.rejectedWith(Error)
        .then(() => expect(sessionCloseSpy.calledOnce));
    });
  });

  describe('stream', () => {
    const params = {};
    const query = (new Query()).matchNode('n', 'TestStreamRecord').return('n');
    const records = [
      { number: 1 },
      { number: 2 },
      { number: 3 },
    ];

    before('setup session run return value', async () => {
      const connection = new Connection(neo4jUrl, neo4jCredentials);
      await connection
        .unwind(records, 'map')
        .createNode('n', 'TestStreamRecord')
        .setVariables({ n: 'map' })
        .run();
      connection.close();
    });

    after('clear the database', async () => {
      const connection = new Connection(neo4jUrl, neo4jCredentials);
      await connection
        .matchNode('n', 'TestStreamRecord')
        .delete('n')
        .run();
      connection.close();
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

    it('should run the query through a session', () => {
      const observable = connection.stream<Node>(query);
      expect(observable).to.be.an.instanceOf(Observable);

      let count = 0;
      return observable
        .do((row) => {
          expect(row.n.properties).to.deep.equal(records[count]);
          expect(row.n.labels).to.deep.equal(['TestStreamRecord']);
          count += 1;
        })
        .toPromise()
        .then(() => {
          expect(count).to.equal(records.length);
          expect(sessionRunSpy.calledOnce);
          expect(sessionRunSpy.calledWith(query.build(), params));
        });
    });

    it('should close the session after running a query', () => {
      const observable = connection.stream(query);

      expect(observable).to.be.an.instanceOf(Observable);
      return observable.toPromise().then(() => expect(sessionCloseSpy.calledOnce));
    });

    it('should close the session when run() throws', (done) => {
      const query = connection.query().return('a');
      const observable = connection.stream(query);

      expect(observable).to.be.an.instanceOf(Observable);
      observable.subscribe({
        next: () => expect.fail(null, null, 'Observable should not emit any items'),
        error: () => {
          expect(sessionCloseSpy.calledOnce);
          done();
        },
        complete: () => expect.fail(null, null, 'Observable should not complete without an error'),
      });
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
      remove: () => connection.remove({ properties: { node: ['prop1', 'prop2'] } }),
      removeProperties: () => connection.removeProperties({ node: ['prop1', 'prop2'] }),
      removeLabels: () => connection.removeLabels({ node: 'label' }),
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
      it(`${name} should return a query object`, () => {
        expect(fn()).to.be.an.instanceof(Query);
      });
    });
  });
});
