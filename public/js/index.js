var socket = io();

socket.on('connect', function() {
  console.log('Connected to server!');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server!');
});

socket.on('newMessage', function(data) {
  var li = $('<li></li>');
  li.text(data.from + ": " + data.text);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(data) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My location!</a>');
  a.attr('href', data.url);
  li.text(data.from + ": ");
  li.append(a);
  $('#messages').append(li);
});

function createNewMessage(text) {
  var data = {
    from: 'Jack',
    text: text
  };
  socket.emit('createMessage', data, function() {
    console.log("Message was recieved.");
  });
}

$('#chat-form').on('submit', function(e) {
  e.preventDefault();
  var input = $('[name=message]');
  createNewMessage(input.val());
  input.val('');
});

var locationButton = $('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position) {
      locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      from: 'Jack',
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }, function() {
      console.log("Location was recieved.");
    });
  }, function() {
    alert('Unable to fetch location.');
    locationButton.removeAttr('disabled').text('Send Location');
  });
});
