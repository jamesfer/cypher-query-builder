const expect = require('chai').expect;

module.exports = function(makeNodeString) {
  it('should build a node pattern with a variable name', function() {
    let string = makeNodeString('person');
    expect(string).to.equal('(person)');
  });

  it('should build a node pattern with a label', function() {
    let string = makeNodeString('', 'Person');
    expect(string).to.equal('(:Person)');
  });

  it('should build a node pattern with multiple labels', function() {
    let string = makeNodeString('person', ['Person', 'Staff', 'Female']);
    expect(string).to.equal('(person:Person:Staff:Female)');
  });

  it('should build a node pattern with conditions', function() {
    let string = makeNodeString('person', [], { name: 'Steve', active: true });
    expect(string).to.equal('(person {name: "Steve", active: true})');
  });

  it('should build a complete node pattern', function() {
    let string = makeNodeString(
      'person',
      ['Person', 'Staff', 'Female'],
      { name: 'Steve', active: true }
    );
    expect(string).to.equal('(person:Person:Staff:Female {name: "Steve", active: true})');
  });
}
