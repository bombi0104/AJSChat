'use strict';
var messagesCtrl = require('../controllers/messages.controller.js');
var userCtrl = require('../controllers/users.controller.js');

// Websocket - Socket.io controller
module.exports = function (io) {
	
	io.on( "connection", function(socket)
	{
		console.log( "A user connected" );

		socket.on('message', function(msg) {
			console.log( "Msg: ", msg);
			if (msg.group) {
				// Create group messages
				messagesCtrl.create(msg, function(reMsg){
					io.emit('message', reMsg);
				});
			} else {
				// Create private messages
				messagesCtrl.createPrivate(msg, function(reMsg){
					io.emit('message', reMsg);
				});
			}
		});

		socket.on("users_status", function(data) {
			if (data.cmd === "LOGIN") {
				io.emit("users_status", data);
				socket.userid = data.userid;
				
				// Set user status to db.
				userCtrl.updateStatus(data.userid, true);
			}
		});

		socket.on('disconnect', function(){
			console.log('Disconnected : ', socket.userid);
			io.emit("users_status", {cmd:"LOGOUT", userid:socket.userid});
			// Set user status to db.
			userCtrl.updateStatus(socket.userid, false);

			console.log( "Disconnected" );
		})
	});
};