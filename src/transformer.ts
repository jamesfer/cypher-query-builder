import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, map, mapValues } from 'lodash';
import Record from 'neo4j-driver/types/v1/record';
import Integer from 'neo4j-driver/types/v1/integer';

export type NeoInteger = Integer | { low: number, high: number };
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
export interface NodeType {
  identity: string;
  labels: string[];
  properties: Dictionary<PlainValue>;
}
export interface RelationType {
  identity: string;
  start: string;
  end: string;
  label: string;
  properties: Dictionary<PlainValue>;
}
export type SanitizedValue = PlainValue | NodeType | RelationType;
export type SanitizedRecord = Dictionary<SanitizedValue>;

export class Transformer {
  transformResult(result: { records: Record[] }): SanitizedRecord[] {
    return map(result.records, rec => this.transformRecord(rec));
  }

  transformRecord(record: Record): SanitizedRecord {
    let recordObj = record.toObject() as Dictionary<NeoValue>;
    return mapValues(recordObj, node => this.transformValue(node));
  }

  transformValue(value: NeoValue | Dictionary<NeoValue>): SanitizedValue {
    if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
      return value as SanitizedValue;
    }
    else if (neo4j.isInt(value)) {
      return this.convertInteger(value as NeoInteger);
    }
    else if (this.isNode(value)) {
      return this.transformNode(value as any);
    }
    else if (this.isRelation(value)) {
      return this.transformRelation(value as any);
    }
    return null;
  }

  isNode(node: Dictionary<any>) {
    return node.identity && node.labels && node.properties;
  }

  transformNode(node: NeoNode): NodeType {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: this.convertNumbers(node.properties),
    };
  }

  isRelation(rel: Dictionary<any>) {
    return rel.identity && rel.type && rel.properties && rel.start && rel.end;
  }

  transformRelation(rel: NeoRelation): RelationType {
    return {
      identity: neo4j.integer.toString(rel.identity),
      start: neo4j.integer.toString(rel.start),
      end: neo4j.integer.toString(rel.end),
      label: rel.type,
      properties: this.convertNumbers(rel.properties),
    }
  }

  convertNumbers(object: Dictionary<NeoValue>): Dictionary<PlainValue> {
    return mapValues(object, (value: NeoValue): PlainValue => {
      if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
        return value as PlainValue;
      }
      else {
        return this.convertInteger(value);
      }
    });
  }

  convertInteger(num: NeoInteger) {
    if (neo4j.integer.inSafeRange(num)) {
      return neo4j.integer.toNumber(num);
    }
    return neo4j.integer.toString(num);
  }
}
