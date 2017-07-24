const _ = require('lodash');
const expect = require('chai').expect;

module.exports = function(makeNode) {
  it('should build a node pattern with a variable name', function() {
    let queryObj = makeNode('person');
    expect(queryObj.query).to.equal('(person)');
    expect(queryObj.params).to.be.empty;
  });

  it('should build a node pattern with a label', function() {
    let queryObj = makeNode('', 'Person');
    expect(queryObj.query).to.equal('(:Person)');
    expect(queryObj.params).to.be.empty;
  });

  it('should build a node pattern with multiple labels', function() {
    let queryObj = makeNode('person', ['Person', 'Staff', 'Female']);
    expect(queryObj.query).to.equal('(person:Person:Staff:Female)');
    expect(queryObj.params).to.be.empty;
  });

  it('should build a node pattern with conditions', function() {
    let queryObj = makeNode('person', [], { name: 'Steve', active: true });
    expect(queryObj.query).to.match(/^\(person \{ name: \$[a-zA-Z0-9-_]+, active: \$[a-zA-Z0-9-_]+ \}\)$/);
    expect(_.keys(queryObj.params)).to.have.length(2);
    expect(_.values(queryObj.params)).to.have.members(['Steve', true]);
  });

  it('should build a complete node pattern', function() {
    let queryObj = makeNode(
      'person',
      ['Person', 'Staff', 'Female'],
      { name: 'Steve', active: true }
    );
    expect(queryObj.query).to.match(/^\(person:Person:Staff:Female \{ name: \$[a-zA-Z0-9-_]+, active: \$[a-zA-Z0-9-_]+ \}\)$/);
    expect(_.keys(queryObj.params)).to.have.length(2);
    expect(_.values(queryObj.params)).to.have.members(['Steve', true]);
  });
}
