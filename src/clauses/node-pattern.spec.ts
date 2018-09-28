import { expect } from 'chai';
import { keys, values } from 'lodash';
import { NodePattern } from './node-pattern';

describe('Node', () => {
  describe('#build', () => {
    const conditions = { name: 'Steve', active: true };

    it('should build a node pattern with a variable name', () => {
      const node = new NodePattern('person');
      const queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with a label', () => {
      const node = new NodePattern('person', 'Person');
      const queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with multiple labels', () => {
      const node = new NodePattern('person', ['Person', 'Staff', 'Female']);
      const queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person:Staff:Female)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with just labels', () => {
      const node = new NodePattern(['Person', 'Staff', 'Female']);
      const queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(:Person:Staff:Female)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with just conditions', () => {
      const node = new NodePattern(conditions);
      const queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('({ name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with a name and conditions', () => {
      const node = new NodePattern('person', conditions);
      const queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with labels and conditions', () => {
      const node = new NodePattern(['Person', 'Staff'], conditions);
      const queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(:Person:Staff { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with condensed conditions', () => {
      const node = new NodePattern('person', [], conditions);
      node.setExpandedConditions(false);
      const queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person $conditions)');
      expect(keys(queryObj.params)).to.have.length(1);
      expect(values(queryObj.params)).to.have.members([conditions]);
    });

    it('should build a node pattern with expanded conditions', () => {
      const node = new NodePattern('person', [], conditions);
      const queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a complete node pattern', () => {
      const node = new NodePattern(
        'person',
        ['Person', 'Staff', 'Female'],
        conditions,
      );
      let queryObj = node.buildQueryObject();

      const pattern = '(person:Person:Staff:Female { name: $name, active: $active })';
      expect(queryObj.query).to.equal(pattern);
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);

      node.setExpandedConditions(false);
      queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person:Staff:Female $conditions)');
      expect(keys(queryObj.params)).to.have.length(1);
      expect(values(queryObj.params)).to.have.members([conditions]);
    });
  });
});
