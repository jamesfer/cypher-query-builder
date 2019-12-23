import { Dictionary, each } from 'lodash';
import * as neo4j from 'neo4j-driver';
import { Driver, Session } from 'neo4j-driver/types';
import { AuthToken, Config } from 'neo4j-driver/types/driver';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SinonSpy, SinonStub, spy, stub } from 'sinon';
import { Connection, Node, Query } from '../src';
import { NodePattern } from '../src/clauses';
import { expect } from '../test-setup';
import { neo4jCredentials, neo4jUrl, waitForNeo } from './utils';

type ArgumentTypes<T extends (...args: any) => any>
  = T extends (...a: infer Args) => any ? Args : never;
type SinonSpyFor<T extends (...args: any) => any>
  = SinonSpy<ArgumentTypes<T>, ReturnType<T>>;
type SinonStubFor<T extends (...args: any) => any>
  = SinonStub<ArgumentTypes<T>, ReturnType<T>>;

describe('Connection', () => {
  let connection: Connection;
  let driver: Driver;
  let driverCloseSpy: SinonSpyFor<Driver['close']>;
  let driverSessionStub: SinonStubFor<Driver['session']>;
  let sessionRunSpy: SinonSpyFor<Session['run']>;
  let sessionCloseSpy: SinonSpyFor<Session['close']>;
  const stubSession = stub<[Session], void>();

  function attachSessionSpies(session: Session): void {
    sessionRunSpy = spy(session, 'run');
    sessionCloseSpy = spy(session, 'close');
  }

  function makeSessionMock(createSession: Driver['session']): Driver['session'] {
    return (...args) => {
      const session = createSession(...args);
      stubSession(session);
      return session;
    };
  }

  function driverConstructor(url: string, authToken?: AuthToken, config?: Config) {
    driver = neo4j.driver(url, authToken, config);
    const mock = makeSessionMock(driver.session.bind(driver));
    driverSessionStub = stub(driver, 'session').callsFake(mock);
    driverCloseSpy = spy(driver, 'close');
    return driver;
  }

  // Wait for neo4j to be ready before testing
  before(waitForNeo);

  beforeEach(() => {
    stubSession.callsFake(attachSessionSpies);
    connection = new Connection(neo4jUrl, neo4jCredentials, driverConstructor);
  });

  afterEach(() => connection.close());

  describe('#constructor', () => {
    it('should default to neo4j driver', async () => {
      const driverSpy = spy(neo4j, 'driver');
      const connection = new Connection(neo4jUrl, neo4jCredentials);

      expect(driverSpy.calledOnce);

      await connection.close();
      driverSpy.restore();
    });

    it('should accept a custom driver constructor function', async () => {
      const constructorSpy = spy(driverConstructor);
      const connection = new Connection(neo4jUrl, neo4jCredentials, constructorSpy);
      expect(constructorSpy.calledOnce).to.equal(true);
      expect(constructorSpy.firstCall.args[0]).to.equal(neo4jUrl);
      await connection.close();
    });

    it('should pass driver options to the driver constructor', async () => {
      const constructorSpy = spy(driverConstructor);
      const driverConfig = { maxConnectionPoolSize: 5 };
      const connection = new Connection(neo4jUrl, neo4jCredentials, {
        driverConfig,
        driverConstructor: constructorSpy,
      });
      expect(constructorSpy.calledOnce).to.equal(true);
      expect(constructorSpy.firstCall.args[0]).to.equal(neo4jUrl);
      expect(constructorSpy.firstCall.args[2]).to.deep.equal(driverConfig);
      await connection.close();
    });
  });

  describe('#close', () => {
    it('should close the driver', async () => {
      await connection.close();
      expect(driverCloseSpy.calledOnce);
    });

    it('should only close the driver once', async () => {
      await connection.close();
      await connection.close();
      expect(driverCloseSpy.calledOnce);
    });
  });

  describe('#session', () => {
    it('should use the driver to create a session', () => {
      connection.session();
      expect(driverSessionStub.calledOnce);
    });

    it('should return null if the connection has been closed', async () => {
      await connection.close();
      const result = connection.session();

      expect(driverSessionStub.notCalled);
      expect(result).to.equal(null);
    });
  });

  describe('#run', () => {
    it('should reject if there are no clauses in the query', async () => {
      const promise = connection.run(connection.query());
      await expect(promise).to.be.rejectedWith(Error, 'no clauses');
    });

    it('should reject if the connection has been closed', async () => {
      await connection.close();
      const promise = connection.run(connection.query().return('1'));
      await expect(promise).to.be.rejectedWith(Error, 'connection is not open');
    });

    it('should reject if a session cannot be opened', async () => {
      const connectionSessionStub = stub(connection, 'session').returns(null);
      const promise = connection.run(connection.query().return('1'));
      await expect(promise).to.be.rejectedWith(Error, 'connection is not open');
      connectionSessionStub.restore();
    });

    it('should run the query through a session', async () => {
      const params = {};
      const query = new Query().raw('RETURN 1', params);

      const promise = connection.run(query);
      await expect(promise).to.be.fulfilled.then(() => {
        expect(sessionRunSpy.calledOnce);
        expect(sessionRunSpy.calledWith('RETURN 1', params));
      });
    });

    it('should close the session after running a query', async () => {
      const promise = connection.run((new Query()).raw('RETURN 1'));
      await expect(promise).to.be.fulfilled
        .then(() => expect(sessionCloseSpy.calledOnce));
    });

    it('should close the session when run() throws', async () => {
      const promise = connection.run((new Query()).raw('RETURN a'));
      await expect(promise).to.be.rejectedWith(Error)
        .then(() => expect(sessionCloseSpy.calledOnce));
    });

    describe('when session.close throws', async () => {
      const message = 'Fake error';
      let sessionCloseStub: SinonStubFor<Session['close']>;

      beforeEach(() => {
        stubSession.resetBehavior();
        stubSession.callsFake((session) => {
          sessionCloseStub = stub(session, 'close').throws(new Error(message));
        });
      });

      it('the error should bubble up', async () => {
        const promise = connection.run(new Query().raw('RETURN 1'));
        await expect(promise).to.be.rejectedWith(Error, message);
      });

      it('does not call session.close again', async () => {
        try {
          await connection.run(new Query().raw('RETURN a'));
        } catch (e) {}
        expect(sessionCloseStub.calledOnce);
      });
    });
  });

  describe('stream', () => {
    const params = {};
    const query = new Query().matchNode('n', 'TestStreamRecord').return('n');
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
      await connection.close();
    });

    after('clear the database', async () => {
      const connection = new Connection(neo4jUrl, neo4jCredentials);
      await connection
        .matchNode('n', 'TestStreamRecord')
        .delete('n')
        .run();
      await connection.close();
    });

    it('should return errored observable if there are no clauses in the query', () => {
      const observable = connection.stream(connection.query());
      expect(observable).to.be.an.instanceOf(Observable);

      observable.subscribe({
        next: () => expect.fail(null, null, 'Observable should not emit anything'),
        error(error) {
          expect(error).to.be.instanceOf(Error);
          expect(error.message).to.include('no clauses');
        },
        complete: () => expect.fail(null, null, 'Observable should not complete successfully'),
      });
    });

    it('should return errored observable if the connection has been closed', async () => {
      await connection.close();
      const observable = connection.stream(new Query().return('1'));
      expect(observable).to.be.an.instanceOf(Observable);

      observable.subscribe({
        next: () => expect.fail(null, null, 'Observable should not emit anything'),
        error(error) {
          expect(error).to.be.instanceOf(Error);
          expect(error.message).to.include('connection is not open');
        },
        complete: () => expect.fail(null, null, 'Observable should not complete successfully'),
      });
    });

    it('should run the query through a session', () => {
      const observable = connection.stream<Node>(query);
      expect(observable).to.be.an.instanceOf(Observable);

      let count = 0;
      return observable.pipe(
        tap((row) => {
          expect(row.n.properties).to.deep.equal(records[count]);
          expect(row.n.labels).to.deep.equal(['TestStreamRecord']);
          count += 1;
        }),
      )
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
        error() {
          expect(sessionCloseSpy.calledOnce);
          done();
        },
        complete: () => expect.fail(null, null, 'Observable should not complete without an error'),
      });
    });
  });

  describe('query methods', () => {
    const methods: Dictionary<Function> = {
      create: () => connection.create(new NodePattern('Node')),
      createNode: () => connection.createNode('Node'),
      createUnique: () => connection.createUnique(new NodePattern('Node')),
      createUniqueNode: () => connection.createUniqueNode('Node'),
      delete: () => connection.delete('node'),
      detachDelete: () => connection.detachDelete('node'),
      limit: () => connection.limit(1),
      match: () => connection.match(new NodePattern('Node')),
      matchNode: () => connection.matchNode('Node'),
      merge: () => connection.merge(new NodePattern('Node')),
      onCreateSet: () => connection.onCreate.set({}, { merge: false }),
      onCreateSetLabels: () => connection.onCreate.setLabels({}),
      onCreateSetValues: () => connection.onCreate.setValues({}),
      onCreateSetVariables: () => connection.onCreate.setVariables({}, false),
      onMatchSet: () => connection.onMatch.set({}, { merge: false }),
      onMatchSetLabels: () => connection.onMatch.setLabels({}),
      onMatchSetValues: () => connection.onMatch.setValues({}),
      onMatchSetVariables: () => connection.onMatch.setVariables({}, false),
      optionalMatch: () => connection.optionalMatch(new NodePattern('Node')),
      orderBy: () => connection.orderBy('name'),
      query: () => connection.query(),
      raw: () => connection.raw('name'),
      remove: () => connection.remove({ properties: { node: ['prop1', 'prop2'] } }),
      removeProperties: () => connection.removeProperties({ node: ['prop1', 'prop2'] }),
      removeLabels: () => connection.removeLabels({ node: 'label' }),
      return: () => connection.return('node'),
      returnDistinct: () => connection.returnDistinct('node'),
      set: () => connection.set({}, { merge: false }),
      setLabels: () => connection.setLabels({}),
      setValues: () => connection.setValues({}),
      setVariables: () => connection.setVariables({}, false),
      skip: () => connection.skip(1),
      unwind: () => connection.unwind([1, 2, 3], 'number'),
      where: () => connection.where([]),
      with: () => connection.with('node'),
    };

    each(methods, (fn, name) => {
      it(`${name} should return a query object`, () => {
        expect(fn()).to.be.an.instanceof(Query);
      });
    });
  });
});
