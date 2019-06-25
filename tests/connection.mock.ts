import { stub, spy, SinonSpy, SinonStub } from 'sinon';
import { Connection } from '../src';

export const defaultUrl = 'bolt://localhost';
export const defaultCredentials = { username: 'neo4j', password: 'admin' };

export function mockConnection(
  url = defaultUrl,
  credentials = defaultCredentials,
) {
  const session = {
    close: spy(),
    run: stub().returns(Promise.resolve(true)),
  };
  const driver = {
    close: spy(),
    session: stub().returns(session),
  };
  const connection = new Connection(url, credentials, () => driver);
  return { session, driver, connection };
}
