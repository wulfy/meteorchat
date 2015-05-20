ChatsRooms = new Mongo.Collection('ChatsRooms');
ChatsData = new Mongo.Collection('ChatsData');
UsersSatus = new Mongo.Collection('UsersSatus');

function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function dump(varObject){
	var data = "";
	for (var key in varObject) {
	   if (varObject.hasOwnProperty(key)) {
	       var obj = varObject[key];
	        for (var prop in obj) {
	          // important check that this is objects own property 
	          // not from prototype prop inherited
	          if(obj.hasOwnProperty(prop)){
	            data += obj[prop];
	          }
	       }
	    }
	}
	return Base64.encode(data);
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

    },
    isAlive : function(userId,roomId){
    	console.log("islive "+ userId);
    	currentTimeStamp = new Date().getTime();
    	//console.log("isalive : " + userId + " - timestamp : " + currentTimeStamp);
    	cursor = UsersSatus.find({userid:userId,roomid:roomId});
    	userData = Meteor.users.find(userId).fetch();
    	userName = userData[0].username;
    	if(cursor.count()>0)
    		UsersSatus.update({userid:userId,roomid:roomId},{ $set: {lastActionTime:currentTimeStamp, idle : false,username: userName}});
    	else
    		UsersSatus.insert({userid:userId,roomid:roomId, username: userName, lastActionTime:currentTimeStamp, idle : false});
    	//console.log("modified = "+ result);
    	
    },
    isConnected : function(userId){
    	console.log("check "+ userId);

    	return !(typeof UsersSatus[userId] === 'undefined');
    }

});

Meteor.onConnection (function(connection){
	//Base64.encode(connection.httpHeaders);
	//console.log("connection detected " + dump(connection.httpHeaders));
	//UsersSatus = connection.httpHeaders;
});

Accounts.onLogin(function(data){
	//console.log("login detected " + dump(data));

	/*currentTimeStamp = new Date().getTime();
	userid = data.user._id;
	console.log("login in : "+ data.user.username + " " + data.user._id + " results ");

	if((UsersSatus.find(userid).count()) <= 0 ){
		console.log("inserting");
		UsersSatus.insert({_id: userid, username: data.user.username, lastActionTime : currentTimeStamp, idle : false});
	}else
		UsersSatus.update(userid, {$set : { lastActionTime : currentTimeStamp, username: data.user.username, idle : false}});*/
	//UsersSatus[userid] = currentTimeStamp;
});


//vérifie toutes les 8secondes qu'un utilisateur est toujours connecté
//todo: vérifier si un setinterval est fiable (sa précision dépend de la charge serveur il me semble)
Meteor.setInterval(function(){
	currentTimeStamp = new Date().getTime() - 4000;
	console.log("checking connected users : timestamp " + currentTimeStamp);
	results = UsersSatus.find({lastActionTime : {$lt:currentTimeStamp} , idle:false},{});
	results.map(
			function(data) { 
				console.log("data : " + data._id + " disconnected - timestamp " + data.idle); 
				UsersSatus.update(data._id, {$set : {idle : true}});
			}
			
			);

	/*UsersSatus.foreach(function(element, index){
		if(element < currentTimeStamp){
			 UsersSatus.splice(index, 1);
			 console.log("user : " + index + " disconnected - timestamp " + element); 
			}
	});*/

}, 8000);

    Meteor.publish("listRooms", function () {
    		return ChatsRooms.find({}, {sort: {name:1}});
    	});

 	 Meteor.publish("roomData", function (roomId) {
    		return ChatsRooms.find(roomId);
    	});
 	 Meteor.publish("roomMessages", function (roomId) {
    		return ChatsData.find({roomId:roomId},{sort: {createdAt: 1}});
    	});
 	 Meteor.publish("userStatus", function () {

    		return UsersSatus.find({});
    	});

		Meteor.publish(null, function() {
		  return Meteor.users.find({}, {
		    fields: {
		      username: 1,
		      profile: 1,
		    }
		  });
		 });

}