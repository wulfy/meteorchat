
Router.configure({
  layoutTemplate: 'chatContainer',
  notFoundTemplate: 'notFound'
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('room', {path: '/room/:_id'});
});

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('listRooms');
    this.next();
  }
});

//permet de définir des données à this.route.
// il est possible aussi de le faire directement dans this.route.
RoomController = RouteController.extend({
  onBeforeAction: function() {
  	//attention suscribe permet de définir les données que le client aura le droit d'accéder pour ce template.
  	//en gros le client souscrit à des données qui lui seront envoyées par le serveur. Si ce n'est pas le cas , il ne reçoit rien.
    Meteor.subscribe('roomData', this.params._id);
    Meteor.subscribe('roomMessages', this.params._id);
    this.next();
  },
  //permet d'envoyer les données directement dans le template (ainsi on peut utiliser "name" de l'objet room présent en BDD)
  data: function() {
  	console.log(ChatsRooms.findOne(this.params._id));
    return ChatsRooms.findOne(this.params._id);
  },
    /*action: function () {
      this.render();
    }*/
});
