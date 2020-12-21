import { Dictionary, map, mapValues, isArray } from 'lodash';
import * as neo4j from 'neo4j-driver';
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

export type Transformer = (record: Record) => Dictionary<any>;

export function defaultTransformer(record: Record): Dictionary<any> {
  return mapValues(record.toObject() as any, node => transformValue(node));
}

export function transformValue(value: any): any {
  if (isPlainValue(value)) {
    return value;
  }
  if (isArray(value)) {
    return map(value, transformValue);
  }
  if (neo4j.isInt(value)) {
    return convertInteger(value);
  }
  if (isNode(value)) {
    return transformNode(value);
  }
  if (isRelation(value)) {
    return transformRelation(value);
  }
  if (typeof value === 'object') {
    return mapValues(value, transformValue);
  }
  return null;
}

export function isPlainValue(value: any): value is PlainValue {
  const type = typeof value;
  return value == null || type === 'string' || type === 'boolean' || type === 'number';
}

export function isNode(node: any): node is NeoNode {
  return node !== null
    && typeof node === 'object'
    && !isArray(node)
    && node.identity
    && node.labels
    && node.properties;
}

export function transformNode(node: NeoNode): Node {
  return {
    identity: neo4j.integer.toString(node.identity),
    labels: node.labels,
    properties: mapValues(node.properties, transformValue),
  };
}

export function isRelation(rel: Dictionary<any>): rel is NeoRelation {
  return rel.identity && rel.type && rel.properties && rel.start && rel.end;
}

export function transformRelation(rel: NeoRelation): Relation {
  return {
    identity: neo4j.integer.toString(rel.identity),
    start: neo4j.integer.toString(rel.start),
    end: neo4j.integer.toString(rel.end),
    label: rel.type,
    properties: mapValues(rel.properties, transformValue),
  };
}

export function convertInteger(num: Integer) {
  if (neo4j.integer.inSafeRange(num)) {
    return neo4j.integer.toNumber(num);
  }
  return neo4j.integer.toString(num);
}
