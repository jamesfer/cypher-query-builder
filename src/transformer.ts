import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, map, mapValues } from 'lodash';
import Record from 'neo4j-driver/types/v1/record';
import { Node as NeoNode } from 'neo4j-driver/types/v1/graph-types';
import Integer from 'neo4j-driver/types/v1/integer';

export interface Node {
  identity: string;
  labels: string[];
  properties: Dictionary<string | boolean | null | number>;
}

export type NeoValue = Integer | string | boolean | null | { low: number, high: number };

export class Transformer {
  transformResult(result: { records: Record[] }) {
    return map(result.records, rec => this.transformRecord(rec));
  }

  transformRecord(record: Record) {
    return mapValues(record.toObject(), node => {
      return this.isNode(node) ? this.transformNode(node) : node;
    });
  }

  transformNode(node: NeoNode): Node {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: this.convertNumbers(node.properties as {}),
    };
  }

  isNode(node: any) {
    return node.identity && node.labels && node.properties;
  }

  convertNumbers(object: Dictionary<NeoValue>): Dictionary<string | boolean | number | null> {
    return mapValues(object, (value: NeoValue): string | boolean | number | null => {
      if (neo4j.isInt(value as object)) {
        if (neo4j.integer.inSafeRange(value as Integer)) {
          return neo4j.integer.toNumber(value as Integer);
        }
        return neo4j.integer.toString(value as string);
      }
      return value as string;
    });
  }
}
