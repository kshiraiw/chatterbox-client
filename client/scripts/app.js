// YOUR CODE HERE:
var app = {
  init: function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(){
    $.get(this.server, function( data ) {
      processData(data);
      app.clearRooms();
      displayRooms();
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  clearRooms: function() {
    $('.rooms').children().remove()
    $('#roomSelect').children().remove();
  },
  addMessage: function(message){
    displayMessages(message);
  },
  addRoom: function(roomname){
    $('#roomSelect').append($('<option>', {
      value: roomname,
      text: roomname
    }));
    $('.rooms').append('<div class="room"></div>');
    $('.room').last().text(roomname);
  },
  addFriend: function(username){
    if (!friends[username]) {
      $('.friendsList').append('<div class="friend bold"></div>');
      $('.friend').last().text(username);
      friends[username] = users[username];
      app.clearMessages();
      app.clearRooms();
      app.fetch();
    } 
  },
  handleSubmit: function(user, note, room){
    message = {
      username: user,
      text: note,
      roomname: room
    }
    this.addMessage(message);
    this.send(message);
  }
};
var rooms = {};
var friends = {};
var users = {};

var processData = function(object){
  if (object.results) {
    for(var i=0; i<object.results.length; i++){
      users[object.results[i].username] = users[object.results[i].username] || [];
      rooms[object.results[i].roomname] = rooms[object.results[i].roomname] || [];
      var messageObject = {username: object.results[i].username, text: object.results[i].text};
      rooms[object.results[i].roomname].push(messageObject);
      users[object.results[i].username].push(messageObject);
      displayMessages(messageObject);
    }
  }
}

var displayMessages = function(messageObject) {
  $('#chats').prepend('<div class="message"></div>');
  $('.message').first().append('<div class="username"></div>');
  $('.message').first().append('<div class="text"></div>');
  $('.username').first().text(messageObject.username);
  $('.text').first().text(messageObject.text);
  if (friends[messageObject.username]) {
    $('.username').first().addClass('bold');
    $('.text').first().addClass('bold'); 
  }
}

var displayRooms = function() {
  for (var room in rooms) {
    app.addRoom(room);
  }
}

$(document).ready(function() {
  app.init();
 $('#chats').on('click', '.username', function(){
    app.addFriend($(this).text());
  });
 $('.rooms').on('click', '.room', function() {
    app.clearMessages();
    var messArray = rooms[$(this).text()];
    for (var i = 0; i < messArray.length; i++) {
      displayMessages(messArray[i]);
    }
  })
 $('#send').on('submit', function(e){
    e.preventDefault();
    var roomValue = $('#roomSelect').val();
    if($('#room').val()){
      roomValue = $('#room').val();
      app.addRoom(roomValue);
    }
    app.handleSubmit($('#name').val(), $('#note').val(), roomValue);
    console.log("submitted")
    $('#name').val("");
    $('#note').val("");
    $('#room').val(""); 
  });
  $('button.refresh').on('click', function() {
    app.clearMessages();
    app.clearRooms();
    app.fetch();
  });
  $('.createRoom').on('click', function() {
    $('#room').toggle()
  });
  $('.friendsList').on('click', '.friend', function() {
    app.clearMessages();
    var friendMess = friends[$(this).text()];
    for (var i = 0; i < friendMess.length; i++) {
      displayMessages(friendMess[i]);
    }
  });

});

