export class Selector<G> {
  get tuple(): [keyof G, any] {
    if (this._tuple === undefined) {
      throw new Error('Uninitialized selector');
    }
    return this._tuple;
  }
  set<T extends keyof G, A extends keyof G[T]>(key: T, prop : A) {
    this._tuple = [key, prop];
    return this;
  }

  // tslint:disable-next-line:variable-name
  private _tuple: [keyof G, any]|undefined;
}
