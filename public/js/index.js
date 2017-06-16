var socket = io();

socket.on('connect', function() {
  console.log('Connected to server!');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server!');
});

socket.on('newMessage', function(data) {
  /*var li = $('<li></li>');
  var small = $('<small></small>');
  small.text(' | ' + getFormatedTime(data.createdAt));
  li.text(data.from + ": " + data.text);
  li.append(small);
  $('#messages').append(li);*/

  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    text: data.text,
    timeStamp: getFormatedTime(data.createdAt)
  });

  $('#messages').append(html);
});

socket.on('newLocationMessage', function(data) {
  /*var li = $('<li></li>');
  var a = $('<a target="_blank">My location!</a>');
  var small = $('<small></small>');
  small.text(' | ' + getFormatedTime(data.createdAt));
  a.attr('href', data.url);
  li.text(data.from + ": ");
  li.append(a);
  li.append(small);
  $('#messages').append(li);*/

  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    url: data.url,
    timeStamp: getFormatedTime(data.createdAt)
  });

  $('#messages').append(html);
});

var getFormatedTime = function(time)  {
    return moment(time).format('h:mm a');
};

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
