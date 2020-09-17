import { Driver, Session } from 'neo4j-driver';
import { stub, spy } from 'sinon';
import { Connection } from '../src';

export const defaultUrl = 'bolt://localhost';
export const defaultCredentials = { username: 'neo4j', password: 'admin' };

export function mockConnection(
  url = defaultUrl,
  credentials = defaultCredentials,
) {
  const session: Session = {
    close: spy(),
    run: stub().returns(Promise.resolve(true)),
    beginTransaction: stub(),
    readTransaction: stub(),
    writeTransaction: stub(),
    lastBookmark: stub(),
  };
  const driver: Driver = {
    close: spy(),
    session: stub().returns(session),
    rxSession: stub(),
    verifyConnectivity: stub(),
    supportsMultiDb: stub(),
  };
  const connection = new Connection(url, credentials, () => driver);
  return { session, driver, connection };
}
