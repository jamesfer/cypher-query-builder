import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, map, mapValues, isArray, isObject } from 'lodash';
import {
  Date as NeoDate,
  DateTime as NeoDateTime,
  Duration,
  Integer,
  LocalTime,
  LocalDateTime,
  Record,
  Time,
} from 'neo4j-driver/types/v1';

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

  protected transformValue(value: unknown): any {
    if (this.isPlainValue(value)) {
      return value;
    }
    if (isArray(value)) {
      return map(value, v => this.transformValue(v));
    }
    if (this.isInteger(value)) {
      return this.transformInteger(value);
    }
    if (this.isNode(value)) {
      return this.transformNode(value);
    }
    if (this.isRelation(value)) {
      return this.transformRelation(value);
    }
    if (this.isDuration(value)) {
      return this.transformDuration(value);
    }
    if (this.isLocalTime(value)) {
      return this.transformLocalTime(value);
    }
    if (this.isTime(value)) {
      return this.transformTime(value);
    }
    if (this.isDate(value)) {
      return this.transformDate(value);
    }
    if (this.isLocalDateTime(value)) {
      return this.transformLocalDateTime(value);
    }
    if (this.isDateTime(value)) {
      return this.transformDateTime(value);
    }
    if (isObject(value)) {
      return this.transformObject(value);
    }
    return null;
  }

  protected isPlainValue(value: unknown): value is PlainValue {
    const type = typeof value;
    return value == null || type === 'string' || type === 'boolean' || type === 'number';
  }

  protected isNode(val: unknown): val is NeoNode {
    if (!isObject(val) || isArray(val)) {
      return false;
    }
    const node = val as NeoNode;
    return !!node.identity
      && !!node.labels
      && !!node.properties;
  }

  protected transformNode(node: NeoNode): any {
    const n: Node = {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: mapValues(node.properties, this.transformValue.bind(this)),
    };
    return n;
  }

  protected isRelation(val: unknown): val is NeoRelation {
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

  protected transformRelation(rel: NeoRelation): any {
    const relation: Relation = {
      identity: neo4j.integer.toString(rel.identity),
      start: neo4j.integer.toString(rel.start),
      end: neo4j.integer.toString(rel.end),
      label: rel.type,
      properties: mapValues(rel.properties, this.transformValue.bind(this)),
    };
    return relation;
  }

  protected isInteger(val: unknown): val is Integer {
    return isObject(val) && neo4j.isInt(val);
  }

  protected transformInteger(num: Integer): any {
    if (neo4j.integer.inSafeRange(num)) {
      return neo4j.integer.toNumber(num);
    }
    return neo4j.integer.toString(num);
  }

  protected transformObject(value: object): any {
    return mapValues(value, v => this.transformValue(v));
  }

  protected isDuration(value: unknown): value is Duration {
    return isObject(value) && neo4j.isDuration(value);
  }

  protected transformDuration(value: Duration): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }

  protected isLocalTime(value: unknown): value is LocalTime {
    return isObject(value) && neo4j.isLocalTime(value);
  }

  protected transformLocalTime(value: LocalTime): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }

  protected isTime(value: unknown): value is Time {
    return isObject(value) && neo4j.isTime(value);
  }

  protected transformTime(value: Time): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }

  protected isDate(value: unknown): value is NeoDate {
    return isObject(value) && neo4j.isDate(value);
  }

  protected transformDate(value: NeoDate): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }

  protected isLocalDateTime(value: unknown): value is LocalDateTime {
    return isObject(value) && neo4j.isLocalDateTime(value);
  }

  protected transformLocalDateTime(value: LocalDateTime): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }

  protected isDateTime(value: unknown): value is NeoDateTime {
    return isObject(value) && neo4j.isDateTime(value);
  }

  protected transformDateTime(value: NeoDateTime): any {
    // Maintain compatibility for v5. Do something different in v6.
    return this.transformObject(value);
  }
}
