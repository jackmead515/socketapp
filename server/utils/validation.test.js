var expect = require('chai').expect;

var {isRealString} = require('./validation');

describe('isRealString - validation.js', () => {
  it('Should identify a non valid string.', (done) => {
    var s = 'ajdsfasdf     ';
    var p = '             adsfasdf';
    var t = '              ';
    var g = '       dafs         asdf     ';
    var y = 3453;

    expect(isRealString(s)).to.equal(true);
    expect(isRealString(p)).to.equal(true);
    expect(isRealString(g)).to.equal(true);

    expect(isRealString(t)).to.equal(false);
    expect(isRealString(y)).to.equal(false);

    done();
  })
});
