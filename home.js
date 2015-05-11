if (Meteor.isClient) {

	Template.home.helpers({
		rooms: function(){
			console.log("listrooms");
			return ChatsRooms.find({}, {sort: {name:1}});
		}
	});

	//handle form event
	Template.home.events({
		// Add an event for the new button to Template.task.events
	  "submit .new-room": function (event) {
	  	var text = event.target.text.value;
	  	console.log("calling newRoom");
	    Meteor.call("newRoom",text,false);
	  } 
	});

	Template.room.events({
	  "submit .new-message": function (event) {
	  	var text = event.target.text.value;
	  	console.log("calling newMessage");
	    Meteor.call("postMessage",text,this._id);
	  } 
	});

	//permet de remplir des données dans une variable
	//alors que router permet de lier des données au template
	Template.room.helpers({
	  messages:function(){
		  	return ChatsData.find({roomId:this._id},{sort: {createdAt: 1}});
		  }
	});

   Template.message.helpers({
	  isCurrentUser:function(userId){
	  		return userId == Meteor.userId();
	  }
	});
	  

	Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

}