export type ValueOf<T> = T[keyof T];
export type StringKeyOf<T extends {
  [key: string]: any,
}> = Extract<keyof T, string>;
