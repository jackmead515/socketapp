const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const util = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //For Heroku...
var app = express();
var server = http.createServer(app);
var io = socketio(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  //socket.emit - send to current socket
  //io.emit - send to all sockets
  //socket.broadcast.emit - send to all sockets but current

  socket.on('join', (params, callback) => {

    if(isRealString(params.name) && isRealString(params.room)) {
      socket.join(params.room);
      // socket.leave('roomname') -> leaves a room

      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      socket.emit('newMessage',
        util.generateMessage('Admin', 'Welcome to Chat App!'));

      socket.broadcast.to(params.room).emit('newMessage',
        util.generateMessage('Admin', params.name + ' has joined!'));

      callback();
    } else {
      callback('Name and room name are required.');
    }

  });

  socket.on('createMessage', (data, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(data.text)) {
        io.to(user.room).emit('newMessage', util.generateMessage(user.name, data.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (data, callback) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', util.generateLocationMessage(user.name, data.lat, data.lng));
    }

    callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', util.generateMessage('Admin', user.name + ' has disconnected.'));
    }
  });


});

server.listen(port, () => {
  console.log(`Server booted on port: ${port}`);
});
