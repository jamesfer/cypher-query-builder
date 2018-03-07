import { Pattern } from './pattern';
import { expect } from 'chai';

class ConcretePattern extends Pattern {
  build() {
    return '';
  }
}

describe('Pattern', function() {
  it('should accept no arguments', function() {
    const pattern = new ConcretePattern();
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just a name', function() {
    const pattern = new ConcretePattern('label');
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('label');
  });

  it('should accept just an array of labels', function() {
    const pattern = new ConcretePattern([ 'label1', 'label2' ]);
    expect(pattern.getLabelsString()).to.equal(':label1:label2');
    expect(pattern.getLabelsString(true)).to.equal(':label1|label2');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just conditions', function() {
    const pattern = new ConcretePattern({ key: 'value' });
    expect(pattern.getNameString()).to.equal('');
    expect(pattern.getConditionsParamString()).to.equal('{ key: $key }');
    expect(pattern.getLabelsString()).to.equal('');
  });

  it('should accept a name and labels', function() {
    const singleLabelPattern = new ConcretePattern('name', 'label');
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');

    const multiLabelPattern = new ConcretePattern('name', [ 'label1', 'label2' ]);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept an empty array of labels', function() {
    const emptyLabelPattern = new ConcretePattern('name', []);
    expect(emptyLabelPattern.getLabelsString()).to.equal('');
    expect(emptyLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept a name and conditions', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new ConcretePattern('label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal('');
    expect(singleLabelPattern.getNameString()).to.equal('label');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept labels and conditions', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const multiLabelPattern = new ConcretePattern([ 'label1', 'label2' ], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('');
    expect(multiLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept all three parameters', function() {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new ConcretePattern('name', 'label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);

    const multiLabelPattern = new ConcretePattern('name', [ 'label1', 'label2' ], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should not accept any other combinations of parameters', function() {
    expect(() => new ConcretePattern([], 'label')).to.throw(TypeError, 'Name', 'when name is an array');
    expect(() => new ConcretePattern({}, 'label')).to.throw(TypeError, 'Name', 'when name is an object');
    expect(() => new ConcretePattern('', {}, {})).to.throw(TypeError, 'Labels', 'labels is an object');
    expect(() => new ConcretePattern('', '', '' as any)).to.throw(TypeError, 'Conditions', 'conditions is a string');
  });
});
