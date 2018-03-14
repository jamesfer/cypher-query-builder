import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, map, mapValues } from 'lodash';
import record from 'neo4j-driver/types/v1/record';
import integer from 'neo4j-driver/types/v1/integer';

export type NeoInteger = integer | { low: number, high: number };
export type NeoValue = string | boolean | null | number | NeoInteger;
export interface NeoNode {
  identity: NeoInteger;
  labels: string[];
  properties: Dictionary<NeoValue>;
}
export interface NeoRelation {
  identity: NeoInteger;
  start: NeoInteger;
  end: NeoInteger;
  type: string;
  properties: Dictionary<NeoValue>;
}

export type PlainValue = string | boolean | null | number;
export interface Node<P = Dictionary<PlainValue>> {
  identity: string;
  labels: string[];
  properties: P;
}
export interface Relation<P = Dictionary<PlainValue>> {
  identity: string;
  start: string;
  end: string;
  label: string;
  properties: P;
}
export type SanitizedValue = PlainValue | Node | Relation;
export type SanitizedRecord<T = SanitizedValue> = Dictionary<T>;


export class Transformer {
  transformResult(result: { records: record[] }): SanitizedRecord[] {
    return map(result.records, rec => this.transformRecord(rec));
  }

  transformRecord(record: record): SanitizedRecord {
    const recordObj = record.toObject() as Dictionary<NeoValue>;
    return mapValues(recordObj, node => this.transformValue(node));
  }

  transformValue(value: NeoValue | Dictionary<NeoValue>): SanitizedValue {
    if (
      value === null
      || typeof value === 'string'
      || typeof value === 'boolean'
      || typeof value === 'number'
    ) {
      return value as SanitizedValue;
    }
    if (neo4j.isInt(value)) {
      return this.convertInteger(value as NeoInteger);
    }
    if (this.isNode(value)) {
      return this.transformNode(value as any);
    }
    if (this.isRelation(value)) {
      return this.transformRelation(value as any);
    }
    return null;
  }

  isNode(node: Dictionary<any>) {
    return node.identity && node.labels && node.properties;
  }

  transformNode(node: NeoNode): Node {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: this.convertNumbers(node.properties),
    };
  }

  isRelation(rel: Dictionary<any>) {
    return rel.identity && rel.type && rel.properties && rel.start && rel.end;
  }

  transformRelation(rel: NeoRelation): Relation {
    return {
      identity: neo4j.integer.toString(rel.identity),
      start: neo4j.integer.toString(rel.start),
      end: neo4j.integer.toString(rel.end),
      label: rel.type,
      properties: this.convertNumbers(rel.properties),
    };
  }

  convertNumbers(object: Dictionary<NeoValue>): Dictionary<PlainValue> {
    return mapValues(object, (value: NeoValue): PlainValue => {
      if (
        value === null
        || typeof value === 'string'
        || typeof value === 'boolean'
        || typeof value === 'number'
      ) {
        return value as PlainValue;
      }
      return this.convertInteger(value);
    });
  }

  convertInteger(num: NeoInteger) {
    if (neo4j.integer.inSafeRange(num)) {
      return neo4j.integer.toNumber(num);
    }
    return neo4j.integer.toString(num);
  }
}
