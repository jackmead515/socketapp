var expect = require('chai').expect;

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage - message.js', () => {
  it('Should generate correct message object.', (done) => {
      var message = generateMessage('Jack', 'A message.');
      expect(message.from).to.equal('Jack');
      expect(message.text).to.equal('A message.');
      expect(message).to.have.property('createdAt');
      done();
  });
});

describe('generateLocationMessage - message.js', () => {
  it('Should generate correct url.', (done) => {
      var message = generateLocationMessage('Jack', 5, 5);
      expect(message.from).to.equal('Jack');
      expect(message.url).to.equal('https://www.google.com/maps?q=5,5');
      expect(message).to.have.property('createdAt');
      done();
  });
});
