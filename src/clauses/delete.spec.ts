import { Delete } from './delete';
import { expect } from 'chai';

describe('Delete', function() {
  describe('#build', function() {
    it('should start with DETACH DELETE', function() {
      let query = new Delete('node');
      expect(query.build()).to.equal('DETACH DELETE node');
    });

    it('should start with DELETE when detach is false', function() {
      const query = new Delete('node', { detach: false });
      expect(query.build()).to.equal('DELETE node');
    });

    it('should support an array of variables', function() {
      let query = new Delete(['node1', 'node2']);
      expect(query.build()).to.equal('DETACH DELETE node1, node2');
    });
  });
});
