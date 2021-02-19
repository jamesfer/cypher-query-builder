import { describe } from 'mocha';
import { Selector } from './selector';
import { expect } from '../test-setup';

type graph = { user : { name : string, id : number}, item : { price : number }};
describe('Selector', () => {
  describe('toString', () => {
    const expectations : {[key : string] : [Selector<any>, string]} = {
      'with graph model and without property':
          [new Selector<graph>().set('user'), 'user'],
      'with graph model and with property':
                [new Selector<graph>().set('user', 'name'), 'user.name'],
    };
    for (const name in expectations) {
      it(`${name} should build`, () => {
        const [obj, exp] = expectations[name];
        expect((<Selector<any>>obj).toString()).to.equal(exp);
      });
    }
  });
});
