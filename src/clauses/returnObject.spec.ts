import { expect } from 'chai';
import { ReturnObject } from './returnObject';
import { Selector } from '../selector';

interface G { user: { name: string }; item: { price: number }; }
type Testcase = { obj: ReturnObject<any>, exp: string };
describe('returnObject', () => {
  const expectations: { [index: string]: Testcase } = {
    'single object by string': {
      obj: new ReturnObject<G>({ person: 'user.name' }),
      exp: 'RETURN { person: user.name }',
    },
    'single object by selector': {
      obj: new ReturnObject<G>({ person: new Selector<G>().set('user', 'name') }),
      exp: 'RETURN { person: user.name }',
    },
    'single object multiple fields': {
      obj: new ReturnObject<G>({
        person: new Selector<G>().set('user', 'name'),
        inventory: 'item.anything',
        secureInventory: new Selector<G>().set('item', 'price'),
      }),
      exp: 'RETURN { person: user.name, inventory: item.anything, secureInventory: item.price }',
    },
    'multiple objects': {
      obj: new ReturnObject<G>([
        { person: new Selector<G>().set('user', 'name') },
        { secureInventory: new Selector<G>().set('item', 'price') },
      ]),
      exp: 'RETURN { person: user.name }, { secureInventory: item.price }',
    },
    'nested object': {
      obj: new ReturnObject<G>({
        nested: { name: new Selector<G>().set('user', 'name') },
      }),
      exp: 'RETURN { nested: { name: user.name } }',
    },
  };

  for (const name in expectations) {
    const { obj, exp } = expectations[name];
    it(`should build ${name}`, () => {
      expect(obj.build()).to.equal(exp);
    });
  }
});
