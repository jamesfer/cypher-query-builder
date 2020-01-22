import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, map, mapValues, isArray, isObject } from 'lodash';
import { Record, Integer } from 'neo4j-driver/types/v1';

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

export interface ITransformer {
  transformRecords<T = any>(records: Record[]): Dictionary<T>[];
  transformRecord<T = any>(record: Record): Dictionary<T>;
}

export class Transformer implements ITransformer {
  transformRecords<T = any>(records: Record[]): Dictionary<T>[] {
    return map(records, rec => this.transformRecord(rec));
  }

  transformRecord<T = any>(record: Record): Dictionary<T> {
    return mapValues(record.toObject() as any, node => this.transformValue(node));
  }

  private transformValue(value: unknown): any {
    if (this.isPlainValue(value)) {
      return value;
    }
    if (isArray(value)) {
      return map(value, v => this.transformValue(v));
    }
    if (this.isInteger(value)) {
      return this.convertInteger(value);
    }
    if (this.isNode(value)) {
      return this.transformNode(value);
    }
    if (this.isRelation(value)) {
      return this.transformRelation(value);
    }
    if (isObject(value)) {
      return mapValues(value, v => this.transformValue(v));
    }
    return null;
  }

  private isPlainValue(value: unknown): value is PlainValue {
    const type = typeof value;
    return value == null || type === 'string' || type === 'boolean' || type === 'number';
  }

  private isNode(val: unknown): val is NeoNode {
    if (!isObject(val) || isArray(val)) {
      return false;
    }
    const node = val as NeoNode;
    return !!node.identity
      && !!node.labels
      && !!node.properties;
  }

  private transformNode(node: NeoNode): Node {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: mapValues(node.properties, this.transformValue.bind(this)),
    };
  }

  private isRelation(val: unknown): val is NeoRelation {
    if (!isObject(val) || isArray(val)) {
      return false;
    }
    const rel = val as NeoRelation;
    return !!rel.identity
      && !!rel.type
      && !!rel.properties
      && !!rel.start
      && !!rel.end;
  }

  private transformRelation(rel: NeoRelation): Relation {
    return {
      identity: neo4j.integer.toString(rel.identity),
      start: neo4j.integer.toString(rel.start),
      end: neo4j.integer.toString(rel.end),
      label: rel.type,
      properties: mapValues(rel.properties, this.transformValue.bind(this)),
    };
  }

  private isInteger(val: unknown): val is Integer {
    return isObject(val) && neo4j.isInt(val);
  }

  private convertInteger(num: Integer) {
    if (neo4j.integer.inSafeRange(num)) {
      return neo4j.integer.toNumber(num);
    }
    return neo4j.integer.toString(num);
  }
}
