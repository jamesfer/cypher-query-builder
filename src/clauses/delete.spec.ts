import { Delete } from './delete';
import { expect } from 'chai';

describe('Delete', () => {
  describe('#build', () => {
    it('should start with DELETE', () => {
      const query = new Delete('node');
      expect(query.build()).to.equal('DELETE node');
    });

    it('should start with DELETE when options are empty', () => {
      const query = new Delete('node', {});
      expect(query.build()).to.equal('DELETE node');
    });

    it('should start with DETACH DELETE when detach is true', () => {
      const query = new Delete('node', { detach: true });
      expect(query.build()).to.equal('DETACH DELETE node');
    });

    it('should support an array of variables', () => {
      const query = new Delete(['node1', 'node2']);
      expect(query.build()).to.equal('DELETE node1, node2');
    });
  });
});
