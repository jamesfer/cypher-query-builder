import { Dictionary } from 'lodash';
import { Record, Integer } from 'neo4j-driver/types';

export type NeoValue = string | boolean | null | number | Integer;
export interface NeoNode {
  identity: Integer;
  labels: string[];
  properties: Dictionary<NeoValue>;
}
export interface NeoRelation {
  identity: Integer;
  start: Integer;
  end: Integer;
  type: string;
  properties: Dictionary<NeoValue>;
}

export type PlainValue = string | boolean | null | number;
export type PlainArray = string[] | boolean[] | number[];
export interface Node<P = Dictionary<PlainValue | PlainArray>> {
  identity: string;
  labels: string[];
  properties: P;
}
export interface Relation<P = Dictionary<PlainValue | PlainArray>> {
  identity: string;
  start: string;
  end: string;
  label: string;
  properties: P;
}

export interface Transformer<R> {
  (record: Record): R;
}
