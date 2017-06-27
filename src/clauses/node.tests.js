const expect = require('chai').expect;

module.exports = function(makeNode) {
  it('should build a node pattern with a variable name', function() {
    let queryObj = makeNode('person');
    expect(queryObj.query).to.equal('(person)');
  });

  it('should build a node pattern with a label', function() {
    let queryObj = makeNode('', 'Person');
    expect(queryObj.query).to.equal('(:Person)');
  });

  it('should build a node pattern with multiple labels', function() {
    let queryObj = makeNode('person', ['Person', 'Staff', 'Female']);
    expect(queryObj.query).to.equal('(person:Person:Staff:Female)');
  });

  it.skip('should build a node pattern with conditions', function() {
    let queryObj = makeNode('person', [], { name: 'Steve', active: true });
    expect(queryObj.query).to.equal('(person {name: "Steve", active: true})');
  });

  it.skip('should build a complete node pattern', function() {
    let queryObj = makeNode(
      'person',
      ['Person', 'Staff', 'Female'],
      { name: 'Steve', active: true }
    );
    expect(queryObj.query).to.equal('(person:Person:Staff:Female {name: "Steve", active: true})');
  });
}
