import { termListStatementTests } from './termListStatement.tests';

export function returnTests(makeReturn) {
  termListStatementTests(makeReturn, 'RETURN ');
};
