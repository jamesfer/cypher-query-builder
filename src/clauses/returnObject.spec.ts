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
    'single object with alias': {
      obj: new ReturnObject<G>(
        {
          nested: { name: new Selector<G>().set('user', 'name') },
        },
        'alias'),
      exp: 'RETURN { nested: { name: user.name } } AS `alias`',
    },
    'multiple objects with alias list': {
      obj: new ReturnObject<G>(
        [
          { person: new Selector<G>().set('user', 'name') },
          { secureInventory: new Selector<G>().set('item', 'price') },
        ],
        ['person', 'inventory']),
      exp: 'RETURN { person: user.name } AS `person`, { secureInventory: item.price } AS `inventory`',
    },
    'multiple objects with alias list with one undefined': {
      obj: new ReturnObject<G>(
        [
          { person: new Selector<G>().set('user', 'name') },
          { secureInventory: new Selector<G>().set('item', 'price') },
          { anything: new Selector<G>().set('item', 'price') },
        ],
        ['person', undefined, 'inventory']),
      exp: 'RETURN { person: user.name } AS `person`, { secureInventory: item.price }, { anything: item.price } AS `inventory`',
    },
    'multiple objects with single alias': {
      obj: new ReturnObject<G>(
        [
          { person: new Selector<G>().set('user', 'name') },
          { secureInventory: new Selector<G>().set('item', 'price') },
        ],
        'alias'),
      exp: 'RETURN { person: user.name } AS `alias`, { secureInventory: item.price }',
    },
    'single object with alias list': {
      obj: new ReturnObject<G>(
        {
          nested: { name: new Selector<G>().set('user', 'name') },
        },
        ['person', 'unknown']),
      exp: 'RETURN { nested: { name: user.name } } AS `person`',
    },
  };

  for (const name in expectations) {
    const { obj, exp } = expectations[name];
    it(`should build ${name}`, () => {
      expect(obj.build()).to.equal(exp);
    });
  }
});
