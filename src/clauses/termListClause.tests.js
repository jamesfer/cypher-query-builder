const expect = require('chai').expect;

module.exports = function(makeTermListString, prefix) {
  it('should return a single property', function() {
    let termList = makeTermListString('node');
    expect(termList).to.equal(prefix + 'node');
  });

  it('should return a single renamed property', function() {
    let termList = makeTermListString({'node': 'outerNode'});
    expect(termList).to.equal(prefix + 'node AS outerNode');
  });

  it('should prefix an array of properties with an object key', function() {
    let termList = makeTermListString({'node': ['count', 'score', 'timestamp']});
    expect(termList).to.equal(prefix + 'node.count, node.score, node.timestamp');
  });

  it('should rename a nested object property', function() {
    let termList = makeTermListString({'node': ['count', { 'timestamp': 'created_at' }]});
    expect(termList).to.equal(prefix + 'node.count, node.timestamp AS created_at');
  })

  it('should be able to apply functions to properties', function() {
    let termList = makeTermListString('avg(node.count)');
    expect(termList).to.equal(prefix + 'avg(node.count)');
  });

  it('should join a list of properties', function() {
    let termList = makeTermListString(['startNode', 'rel', 'endNode']);
    expect(termList).to.equal(prefix + 'startNode, rel, endNode');
  });

  it('should produce a complete term list', function() {
    let termList = makeTermListString([
      'startNode',
      'count(rel)',
      {
        'endNode': [
          'score',
          { 'timestamp': 'created_at' }
        ],
      },
    ]);
    expect(termList).to.equal(prefix + 'startNode, count(rel), endNode.score, endNode.timestamp AS created_at');
  });
}
