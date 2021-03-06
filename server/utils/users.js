class Users {

  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if(user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  getUserList(room) {
    var roomUsers = [];
    this.users.forEach(function(user) {
      if(user.room === room){
        roomUsers.push(user.name);
      }
    });
    return roomUsers;
  }
}

module.exports = {
  Users
};
