import { patternStatementTests } from './patternStatement.tests';

export function createTests(makeCreateString) {
  patternStatementTests(makeCreateString, 'CREATE ');
};
