var expect = require('chai').expect;

var {Users} = require('./users');

describe('Users class - users.js', () => {

  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node'
    }, {
      id: '2',
      name: 'Jen',
      room: 'Node'
    }, {
      id: '3',
      name: 'Batman',
      room: 'Gotham'
    }];
  });

  it('Should add new user', (done) => {
    var user = {
      id: '123',
      name: 'Jack',
      room: 'MyRoom'
    };

    var resUser = users.addUser(user.id, user.name, user.room);
    expect(resUser.name).to.equal(user.name);

    done();
  });

  it('Should get user names in room: Node', (done) => {
    var list = users.getUserList('Node');
    expect(list[0]).to.equal('Mike');
    expect(list[1]).to.equal('Jen');

    done();
  });

  it('Should return user by id.', (done) => {

    var user = users.getUser('3');
    expect(user.id).to.equal('3');
    expect(user.name).to.equal('Batman');
    expect(user.room).to.equal('Gotham');

    done();
  });

  it('Should remove user', (done) => {

    expect(users.users.length).to.equal(3);

    var resUser = users.removeUser('2');

    expect(resUser.id).to.equal('2');
    expect(resUser.name).to.equal('Jen');
    expect(resUser.room).to.equal('Node');

    expect(users.users.length).to.equal(2);

    done();
  });


});
