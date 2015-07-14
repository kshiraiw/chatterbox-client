// YOUR CODE HERE:
var app = {
  init: function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    var ctxt = this;
    this.fetch();
    setInterval(ctxt.fetch, 5000);
 
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
      displayMessages(data);
      displayRooms();
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message){
    $('#chats').append('<div class="message"></div>');
      $('.message').append('<span class="username"></span>');
      $('.message').append('<span class="text"></span>');
      $('.username').text(message.username);
      $('.text').text(message.text)
  },
  addRoom: function(roomname){
    $('#roomSelect').append($('<option>', {
      value: roomname,
      text: roomname
    }));
  },
  addFriend: function(username){
    $('.friendsList').append('<div class="friend"></div>');
    $('.friend').text(username);
  },
  handleSubmit: function(user, note, room){
    message = {
      username: user,
      text: note,
      roomname: room
    }
    this.send(message)
  }
};
var rooms = {};
var displayMessages = function(object){
  if (object.results) {
    for(var i=0; i<object.results.length; i++){
      if (!rooms[object.results[i].roomname]) {
        rooms[object.results[i].roomname] = [];
      }
      rooms[object.results[i].roomname].push({username: object.results[i].username, text: object.results[i].text});
      $('#chats').append('<div class="message"></div>');
      $('.message').append('<div class="username"></div>');
      $('.message').append('<div class="text"></div>');
      $('.username').last().text(object.results[i].username);
      $('.text').last().text(object.results[i].text); //+ object.results[i].username + ':' + object.results[i].text + ':' + object.results[i].updatedAt + '</div>')
    }
    console.log(rooms);
  }
}

var displayRooms = function() {
  $('.rooms').children().remove()
  $('#roomSelect').children().remove();
  for (var room in rooms) {
    app.addRoom(room);
    console.log(room);
      $('.rooms').append('<div class="room"></div>');
      $('.room').last().text(room);

  }
}

$(document).ready(function() {
  app.init();
 $('#chats').on('click', '.username', function(){
    console.log($(this).text());
    app.addFriend($(this).text());
  });
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

});

