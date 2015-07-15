var Message = Backbone.Model.extend({
  initialize: function(message){
    this.set(message);
  },
  url: 'https://api.parse.com/1/classes/chatterbox' 
});

var MessageView = Backbone.Model.extend({

});


var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox' ,
  parse: function(response){
    return response.results;
  }
})









var MessagesView = Backbone.View.extend({
  
  initialize: function(){
    this.$el = $('#chats');
    this.model.on('sync', this.render, this);
    console.log(this.model)
  },
  render: function(){

    console.log('hi')
    var html = [
    '<ul>',
    '</ul>'
    ].join("");

    this.$el.html(html);
    this.model.forEach(function(message) {
      $('#chats').find('ul').append('<li></li>');
      $('li').last().text(message.get('text'));
    });
    // this.$el.find('ul').append(this.model.forEach(function(message){
    //   console.log(message.get('text'))
    //   return '<li>' + message.get('text') + '</li>';
    // }));
    return this.$el;
  }
});

