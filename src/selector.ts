/**
 * Selectors can be used to query nested fields in the GraphModel
 *
 * @example
 * ```typescript
 * interface gm = { user: { name: string } };
 * new Selector<gm>().set('user', 'name') };
 * ```
 */
export class Selector<G extends any> {
  get tuple(): [keyof G, any?] {
    if (this._tuple === undefined) {
      throw new Error('Uninitialized selector');
    }
    return this._tuple;
  }
  set<T extends keyof G, A extends keyof G[T]>(key: T, prop? : A) {
    this._tuple = [key, prop];
    return this;
  }

  // tslint:disable-next-line:variable-name
  private _tuple: [keyof G, any?]|undefined;

  toString() {
    const prop : string = (this.tuple[1] !== undefined) ? `.${this.tuple[1]}` : '';
    return `${this.tuple[0]}${prop}`;
  }
}
