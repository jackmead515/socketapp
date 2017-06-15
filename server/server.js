const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const util = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected!');

  socket.emit('newMessage',
    util.generateMessage('Admin', 'Welcome to Chat App!'));

  socket.broadcast.emit('newMessage',
    util.generateMessage('Admin', 'New user joined!'));

  //socket.emit - send to current socket
  //io.emit - send to all sockets
  //socket.broadcast.emit - send to all sockets but current

  socket.on('createMessage', (data, callback) => {
    data.createdAt = util.getDate();
    socket.broadcast.emit('newMessage', data);
    callback();
    //io.emit('newMessage', data);
  });

  socket.on('createLocationMessage', (data, callback) => {
    data.createdAt = util.getDate();
    socket.broadcast.emit('newLocationMessage', util.generateLocationMessage(data.from, data.lat, data.lng));
    callback();
    //io.emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });
});

server.listen(port, () => {
  console.log(`Server booted on port: ${port}`);
});
