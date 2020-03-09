import { Dictionary, isArray } from 'lodash';
import { default as neo4j, Integer } from 'neo4j-driver';
import { NeoNode, NeoRelation, PlainValue } from './transformer';

export function isPlainValue(value: any): value is PlainValue {
  const type = typeof value;
  return value === null || type === 'string' || type === 'boolean' || type === 'number';
}

export function isNode(node: any): node is NeoNode {
  return node !== null
    && typeof node === 'object'
    && !isArray(node)
    && node.identity
    && node.labels
    && node.properties;
}

export function isRelation(rel: Dictionary<any>): rel is NeoRelation {
  return rel.identity && rel.type && rel.properties && rel.start && rel.end;
}

export function convertInteger(num: Integer) {
  if (neo4j.integer.inSafeRange(num)) {
    return neo4j.integer.toNumber(num);
  }
  return neo4j.integer.toString(num);
}
