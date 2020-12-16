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

export class Transformer {
  transformRecords<T= any>(records: Record[]): Dictionary<T>[] {
    return map(records, rec => this.transformRecord<T>(rec));
  }

  transformRecord<T = any>(record: Record): Dictionary<T> {
    return mapValues(record.toObject() as any, node => this.transformValue(node));
  }

  private transformValue(value: any): any {
    if (this.isPlainValue(value)) {
      return value;
    }
    if (isArray(value)) {
      return map(value, v => this.transformValue(v));
    }
    if (neo4j.isInt(value)) {
      return this.convertInteger(value);
    }
    if (this.isNode(value)) {
      return this.transformNode(value);
    }
    if (this.isRelation(value)) {
      return this.transformRelation(value);
    }
    if (typeof value === 'object') {
      return mapValues(value, v => this.transformValue(v));
    }
    return null;
  }

  private isPlainValue(value: any): value is PlainValue {
    const type = typeof value;
    return value == null || type === 'string' || type === 'boolean' || type === 'number';
  }

  private isNode(node: any): node is NeoNode {
    return node !== null
      && typeof node === 'object'
      && !isArray(node)
      && node.identity
      && node.labels
      && node.properties;
  }

  private transformNode(node: NeoNode): Node {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: mapValues(node.properties, this.transformValue.bind(this)),
    };
  }

  private isRelation(rel: Dictionary<any>): rel is NeoRelation {
    return rel.identity && rel.type && rel.properties && rel.start && rel.end;
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

  private convertInteger(num: Integer) {
    if (neo4j.integer.inSafeRange(num)) {
      return neo4j.integer.toNumber(num);
    }
    return neo4j.integer.toString(num);
  }
}
