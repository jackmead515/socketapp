var socket = io();

socket.on('connect', function() {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error.');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server!');
});

socket.on('updateUserList', function(users) {
  var ol = $('<ol></ol>');

  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});

function scrollToBottom() {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

var getFormatedTime = function(time)  {
    return moment(time).format('h:mm a');
};

function createNewMessage(text) {
  socket.emit('createMessage', {text: text}, function() {
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
