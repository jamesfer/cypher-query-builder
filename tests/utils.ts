import { Connection, Credentials } from '../src';
import IHookCallbackContext = Mocha.IHookCallbackContext;

export const neo4jUrl: string = process.env.NEO4J_URL as string;
export const neo4jCredentials: Credentials = {
  username: process.env.NEO4J_USER as string,
  password: process.env.NEO4J_PASS as string,
};

export async function waitForNeo(this: IHookCallbackContext) {
  if (this && 'timeout' in this) {
    this.timeout(40000);
  }

  let attempts = 0;
  const connection = new Connection(neo4jUrl, neo4jCredentials);
  while (attempts < 30) {
    // Wait a short time before trying again
    if (attempts > 0) await new Promise(res => setTimeout(res, 1000));

    try {
      // Attempt a query and exit the loop if it succeeds
      attempts += 1;
      await connection.query().return('1').run();
      break;
    } catch {}
  }
  connection.close();
}
