import { Pattern } from './pattern';
import { expect } from 'chai';

class ConcretePattern extends Pattern {
  build() {
    return '';
  }
}

describe('Pattern', () => {
  it('should accept no arguments', () => {
    const pattern = new ConcretePattern();
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just a name', () => {
    const pattern = new ConcretePattern('label');
    expect(pattern.getLabelsString()).to.equal('');
    expect(pattern.getNameString()).to.equal('label');
  });

  it('should accept just an array of labels', () => {
    const pattern = new ConcretePattern(['label1', 'label2']);
    expect(pattern.getLabelsString()).to.equal(':label1:label2');
    expect(pattern.getLabelsString(true)).to.equal(':label1|label2');
    expect(pattern.getNameString()).to.equal('');
  });

  it('should accept just conditions', () => {
    const pattern = new ConcretePattern({ key: 'value' });
    expect(pattern.getNameString()).to.equal('');
    expect(pattern.getConditionsParamString()).to.equal('{ key: $key }');
    expect(pattern.getLabelsString()).to.equal('');
  });

  it('should accept a name and labels', () => {
    const singleLabelPattern = new ConcretePattern('name', 'label');
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');

    const multiLabelPattern = new ConcretePattern('name', ['label1', 'label2']);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept an empty array of labels', () => {
    const emptyLabelPattern = new ConcretePattern('name', []);
    expect(emptyLabelPattern.getLabelsString()).to.equal('');
    expect(emptyLabelPattern.getNameString()).to.equal('name');
  });

  it('should accept a name and conditions', () => {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new ConcretePattern('label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal('');
    expect(singleLabelPattern.getNameString()).to.equal('label');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept labels and conditions', () => {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const multiLabelPattern = new ConcretePattern(['label1', 'label2'], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('');
    expect(multiLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);
  });

  it('should accept all three parameters', () => {
    const conditions = { key: 'value' };
    const conditionsString = '{ key: $key }';

    const singleLabelPattern = new ConcretePattern('name', 'label', conditions);
    expect(singleLabelPattern.getLabelsString()).to.equal(':label');
    expect(singleLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString())
      .to.equal(conditionsString);

    const multiLabelPattern = new ConcretePattern('name', ['label1', 'label2'], conditions);
    expect(multiLabelPattern.getLabelsString()).to.equal(':label1:label2');
    expect(multiLabelPattern.getNameString()).to.equal('name');
    expect(singleLabelPattern.getConditionsParamString()).to.equal(conditionsString);
  });

  it('should not accept any other combinations of parameters', () => {
    expect(() => new ConcretePattern([], 'label'))
      .throws(TypeError, 'Name', 'when name is an array');
    expect(() => new ConcretePattern({}, 'label'))
      .throws(TypeError, 'Name', 'when name is an object');
    expect(() => new ConcretePattern('', {}, {}))
      .throws(TypeError, 'Labels', 'labels is an object');
    expect(() => new ConcretePattern('', '', '' as any))
      .throws(TypeError, 'Conditions', 'conditions is a string');
  });
});
