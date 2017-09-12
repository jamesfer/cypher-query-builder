const _ = require('lodash');
const expect = require('chai').expect;
const utils = require('./utils');

describe('#uniqueString', function() {
  it('should return the given string unchanged if existing is an empty array', function() {
    let uniqueString = utils.uniqueString('aUniqueString', []);
    expect(uniqueString).to.equal('aUniqueString');
  });

  it('should convert a string to camel case', function() {
    let uniqueString = utils.uniqueString('a variable name', []);
    expect(uniqueString).to.equal('aVariableName');
  });

  it('should append a unique number to the end of the input', function() {
    let uniqueString = utils.uniqueString('aString', ['aString1', 'aString2']);
    expect(uniqueString).to.equal('aString3');
  });

  it('should convert to camel case before calculating unique suffix', function() {
    let uniqueString = utils.uniqueString('a variable name', ['aVariableName1']);
    expect(uniqueString).to.equal('aVariableName2');
  });

  it('should count an existing string with no number suffix as the number 1', function() {
    let uniqueString = utils.uniqueString('aString', ['aString']);
    expect(uniqueString).to.equal('aString2');
  });

  it('should only consider exactly matching strings when calculating the next number suffix', function() {
    let uniqueString = utils.uniqueString('aString', ['aLongString', 'aStringTwo']);
    expect(uniqueString).to.equal('aString');
  });

  it('should ignore duplicate existing names', function() {
    let uniqueString = utils.uniqueString('aString', ['aString', 'aString1', 'aString1']);
    expect(uniqueString).to.equal('aString2');
  });

  it('should attempt to use trailing numbers on the given string', function() {
    let uniqueString = utils.uniqueString('aString456', ['aString5', 'aString6']);
    expect(uniqueString).to.equal('aString456');

    uniqueString = utils.uniqueString('aString2', ['aString5', 'aString6']);
    expect(uniqueString).to.equal('aString2');
  });

  it('should alter the suffix of the given string if it is already taken', function() {
    let uniqueString = utils.uniqueString('aString7', ['aString6', 'aString7', 'aString8']);
    expect(uniqueString).to.equal('aString9');
  });
});
