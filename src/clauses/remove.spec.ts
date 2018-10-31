import { Remove } from './remove';
import { expect } from '../../test-setup';

describe('Remove', () => {
  describe('#build', () => {
    it('should accept a single label', () => {
      const clause = new Remove({ labels: { node: 'Active' } });
      expect(clause.build()).to.equal('REMOVE node:Active');
    });

    it('should accept multiple labels', () => {
      const clause = new Remove({ labels: { node: ['Active', 'Accepted'] } });
      expect(clause.build()).to.equal('REMOVE node:Active:Accepted');
    });

    it('should accept labels for multiple nodes', () => {
      const clause = new Remove({ labels: { node: ['Active', 'Accepted'], node2: 'InTransit' } });
      expect(clause.build()).to.equal('REMOVE node:Active:Accepted, node2:InTransit');
    });

    it('should accept a single property', () => {
      const clause = new Remove({ properties: { node: 'age' } });
      expect(clause.build()).to.equal('REMOVE node.age');
    });

    it('should accept multiple properties', () => {
      const clause = new Remove({ properties: { node: ['age', 'password'] } });
      expect(clause.build()).to.equal('REMOVE node.age, node.password');
    });

    it('should accept properties for multiple nodes', () => {
      const clause = new Remove({ properties: { node: ['age', 'password'], node2: 'contacted' } });
      expect(clause.build()).to.equal('REMOVE node.age, node.password, node2.contacted');
    });
  });
});
