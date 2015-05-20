if (Meteor.isClient) {

var alive = 0;
function isAlive(live){
	console.log("li");
	alive = live;
}

function getConnected(currentroomid){
	if(currentroomid)
		return UsersSatus.find({idle:false,roomid:currentroomid});
	else
		return UsersSatus.find({idle:false});
}

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

	Template.roomItem.helpers({
		nbconnected: function(){
			return getConnected(this._id).count();
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
		  },
	  nbUsers:function(){
	  	return getConnected(this._id).count();//Meteor.users.find().count();
	  },
	  sessionUser:function(){
	  	Session.get("userId");
	  },
	  users:function(){
	  	return UsersSatus.find({idle:false,userid:{$ne:Meteor.userId()},roomid:this._id});
	  }
	});

	Template.user.helpers({
		isActiveuser:function(){
			var isidle = true;
			
	  	 	userCursor =  UsersSatus.find({userid:this.userid,roomid:this.roomid});//faster than findone
		  	 userCursor.forEach(function(user){

		  	 	isidle = user.idle;
			});
		  	 return !isidle;
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

	Template.room.rendered = function() {
		var self = this;
		this.autorun(function(a) {
			var data = Template.currentData(self.view);
			if(!data) return;

			roomId = data._id; //"dbQW4W8PSxoQQ3TLX";//don t know how to get roomid here :(
			Meteor.setInterval(function(){
				Meteor.call("isAlive",Meteor.userId(),roomId);
				console.log("i m connected ! "+ Meteor.userId() + " " +roomId)
			},2000);


		});

		
	};
}