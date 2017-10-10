import { v1 as neo4j } from 'neo4j-driver';
import { map, mapValues } from 'lodash';

export class Transformer {
  transformResult(result) {
    return map(result.records, rec => this.transformRecord(rec));
  }

  transformRecord(record) {
    return mapValues(record.toObject(), node => {
      return this.isNode(node) ? this.transformNode(node) : node;
    });
  }

  transformNode(node) {
    return {
      identity: neo4j.integer.toString(node.identity),
      labels: node.labels,
      properties: this.convertNumbers(node.properties),
    };
  }

  isNode(node) {
    return node.identity && node.labels && node.properties;
  }

  convertNumbers(object, recursive = true) {
    return mapValues(object, value => {
      if (!neo4j.isInt(value)) {
        return value;
      }
      if (neo4j.integer.inSafeRange(value)) {
        return neo4j.integer.toNumber(value);
      }
      return neo4j.integer.toString(value);
    });
  }
}
