'use strict';
var messagesCtrl = require('../controllers/messages.controller.js');

// Websocket - Socket.io controller
module.exports = function (io) {
	
	io.on( "connection", function(socket)
	{
		console.log( "A user connected" );

		socket.on('message', function(msg) {
			console.log( "Msg: ", msg);
			messagesCtrl.create4WC(msg, function(reMsg){
				socket.broadcast.emit('message', reMsg);
			});
		});

		socket.on('disconnect', function(){
			console.log( "Disconnected" );
		})
	});
};