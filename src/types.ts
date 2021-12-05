export type ValueOf<T> = T[keyof T];
export type StringKeyOf<T extends {
  [key: string]: any,
}> = Extract<keyof T, string>;

export type TypedDictionary<K extends string, V = any> = {
  [key in K]? : V
};
