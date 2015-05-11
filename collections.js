ChatsRooms = new Mongo.Collection('ChatsRooms');
ChatsData = new Mongo.Collection('ChatsData');

function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
}



if (Meteor.isServer) {
Meteor.methods({
       
    postMessage: function(text,roomId){
	   	ChatsData.insert({
	      roomId: roomId,
	      text: text,
	      username: Meteor.user().username,
	      userid: Meteor.userId(),
	      createdAt: new Date()
	    });
    },
    getMessages: function(roomId){
    	return ChatsData.find({roomId:roomId},{sort: {createdAt: 1}})
    },
    getRooms: function() {
    	return ChatsRooms.find({}, {sort: {name:1}});
    },
    getRoomById: function(roomId) {
    	return ChatsRooms.find(roomId, {});
    },
    getRoomByName: function(roomName) {
    	return ChatsRooms.find({name:roomName}, {});
    },
    newRoom: function (name,isPrivate) {
    	console.log("adding room");
    	//must be connected
    	if (! Meteor.userId()) {
        	throw new Meteor.Error("not-authorized");
      	}

      	var autorizedList = -1;

      	if(isPrivate)
      		autorizedList[Meteor.userId()] = Meteor.user().username;

      	ChatsRooms.insert({
        name: name,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
        autorized:-1
      });

    },
    addAutorized : function (roomId,username) {

    	var chatRoom = ChatsRooms.find(roomId, {});
    	var autorizedList = chatRoom.autorizedList;

    	if(isArray(autorizedList))
    	{
    		autorizedList[username] = username;
    		ChatsRooms.update(roomId, { $set: { autorizedList: autorizedList } });
    	}

    }

});

    Meteor.publish("listRooms", function () {
    		return ChatsRooms.find({}, {sort: {name:1}});
    	});

 	 Meteor.publish("roomData", function (roomId) {
    		return ChatsRooms.find(roomId);
    	});
 	 Meteor.publish("roomMessages", function (roomId) {
    		return ChatsData.find({roomId:roomId},{sort: {createdAt: 1}});
    	});
/*Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {
    fields: {
      admin: 1,
      bookmarkedRecipeNames: 1,
      'services.twitter.profile_image_url_https': 1
    }
  });*/

}