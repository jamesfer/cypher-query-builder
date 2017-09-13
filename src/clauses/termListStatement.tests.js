const expect = require('chai').expect;

module.exports = function(makeTermList, prefix) {
  it('should return a single property', function() {
    let termList = makeTermList('node');
    expect(termList.query).to.equal(prefix + 'node');
    expect(termList.params).to.be.empty;
  });

  it('should return a single renamed property', function() {
    let termList = makeTermList({'node': 'outerNode'});
    expect(termList.query).to.equal(prefix + 'node AS outerNode');
    expect(termList.params).to.be.empty;
  });

  it('should prefix an array of properties with an object key', function() {
    let termList = makeTermList({'node': ['count', 'score', 'timestamp']});
    expect(termList.query).to.equal(prefix + 'node.count, node.score, node.timestamp');
    expect(termList.params).to.be.empty;
  });

  it('should rename a nested object property', function() {
    let termList = makeTermList({'node': ['count', { 'timestamp': 'created_at' }]});
    expect(termList.query).to.equal(prefix + 'node.count, node.timestamp AS created_at');
    expect(termList.params).to.be.empty;
  })

  it('should be able to apply functions to properties', function() {
    let termList = makeTermList('avg(node.count)');
    expect(termList.query).to.equal(prefix + 'avg(node.count)');
    expect(termList.params).to.be.empty;
  });

  it('should join a list of properties', function() {
    let termList = makeTermList(['startNode', 'rel', 'endNode']);
    expect(termList.query).to.equal(prefix + 'startNode, rel, endNode');
    expect(termList.params).to.be.empty;
  });

  it('should produce a complete term list', function() {
    let termList = makeTermList([
      'startNode',
      'count(rel)',
      {
        'endNode': [
          'score',
          { 'timestamp': 'created_at' }
        ],
      },
    ]);
    expect(termList.query).to.equal(prefix + 'startNode, count(rel), endNode.score, endNode.timestamp AS created_at');
    expect(termList.params).to.be.empty;
  });
}
