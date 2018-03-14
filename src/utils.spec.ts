import { uniqueString } from './utils';
import { expect } from '../test-setup';

describe('#uniqueString', () => {
  it('should return the given string unchanged if existing is an empty array', () => {
    const str = uniqueString('aUniqueString', []);
    expect(str).to.equal('aUniqueString');
  });

  it('should convert a string to camel case', () => {
    const str = uniqueString('a variable name', []);
    expect(str).to.equal('aVariableName');
  });

  it('should append a unique number to the end of the input', () => {
    const str = uniqueString('aString', ['aString1', 'aString2']);
    expect(str).to.equal('aString3');
  });

  it('should convert to camel case before calculating unique suffix', () => {
    const str = uniqueString('a variable name', ['aVariableName1']);
    expect(str).to.equal('aVariableName2');
  });

  it('should count an existing string with no number suffix as the number 1', () => {
    const str = uniqueString('aString', ['aString']);
    expect(str).to.equal('aString2');
  });

  it('should only consider exactly matching strings', () => {
    const str = uniqueString('aString', ['aLongString', 'aStringTwo']);
    expect(str).to.equal('aString');
  });

  it('should ignore duplicate existing names', () => {
    const str = uniqueString('aString', ['aString', 'aString1', 'aString1']);
    expect(str).to.equal('aString2');
  });

  it('should attempt to use trailing numbers on the given string', () => {
    let str = uniqueString('aString456', ['aString5', 'aString6']);
    expect(str).to.equal('aString456');

    str = uniqueString('aString2', ['aString5', 'aString6']);
    expect(str).to.equal('aString2');
  });

  it('should alter the suffix of the given string if it is already taken', () => {
    const str = uniqueString('aString7', ['aString6', 'aString7', 'aString8']);
    expect(str).to.equal('aString9');
  });
});
