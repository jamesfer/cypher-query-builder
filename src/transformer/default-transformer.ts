import { Dictionary, isArray, map, mapValues } from 'lodash';
import { default as neo4j, Record } from 'neo4j-driver';
import { NeoNode, NeoRelation, Node, Relation } from './transformer';
import { convertInteger, isNode, isPlainValue, isRelation } from './transformer-utils';

function transformNode(node: NeoNode): Node {
  return {
    identity: neo4j.integer.toString(node.identity),
    labels: node.labels,
    properties: mapValues(node.properties, transformValue),
  };
}

function transformRelation(rel: NeoRelation): Relation {
  return {
    identity: neo4j.integer.toString(rel.identity),
    start: neo4j.integer.toString(rel.start),
    end: neo4j.integer.toString(rel.end),
    label: rel.type,
    properties: mapValues(rel.properties, transformValue),
  };
}

function transformValue(value: any): any {
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

export function defaultTransformer<T>(record: Record): Dictionary<T> {
  return mapValues(record.toObject() as any, transformValue);
}
