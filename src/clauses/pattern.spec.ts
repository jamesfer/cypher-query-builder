import { Pattern } from './pattern';
import { expect } from 'chai';

describe('Pattern', function() {
  it('should accept no arguments', function() {
    const pattern = new Pattern();
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just a name', function() {
    const pattern = new Pattern('label');
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('label');
  });

  it('should accept just an array of labels', function() {
    const pattern = new Pattern([ 'label1', 'label2' ]);
    expect(pattern.getLabelsString()).to.equal(':label1:label2');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just conditions', function() {
    const pattern = new Pattern({ key: 'value' });
    expect(pattern.getNameString()).to.equal('');
    expect(pattern.getConditionsParamString()).to.equal('{ key: $key }');
    expect(pattern.getLabelsString()).to.equal('');
  });

  it('should accept a name and labels', function() {
    const singleLabelPattern = new Pattern('name', 'label');
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');

    const multiLabelPattern = new Pattern('name', [ 'label1', 'label2' ]);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept an empty array of labels', function() {
    const emptyLabelPattern = new Pattern('name', []);
    expect(emptyLabelPattern.getLabelsString()).to.equal('');
    expect(emptyLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept a name and conditions', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new Pattern('label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal('');
    expect(singleLabelPattern.getNameString()).to.equal('label');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept labels and conditions', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const multiLabelPattern = new Pattern([ 'label1', 'label2' ], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('');
    expect(multiLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept all three parameters', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new Pattern('name', 'label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);

    const multiLabelPattern = new Pattern('name', [ 'label1', 'label2' ], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should not accept any other combinations of parameters', function() {
    expect(() => new Pattern([], 'label')).to.throw(TypeError, 'Name', 'when name is an array');
    expect(() => new Pattern({}, 'label')).to.throw(TypeError, 'Name', 'when name is an object');
    expect(() => new Pattern('', {}, {})).to.throw(TypeError, 'Labels', 'labels is an object');
    expect(() => new Pattern('', '', '' as any)).to.throw(TypeError, 'Conditions', 'conditions is a string');
  });
});
