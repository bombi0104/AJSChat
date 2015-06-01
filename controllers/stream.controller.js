'use strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();

/**
 * Get user by Name
 */
exports.registUser = function(req, res){
	var sse = startSees(res);
	eventEmitter.on('Chat', sendChat)
    
    console.log("New connection : ", req.params.uid);

  	req.once("end", function() {
    	eventEmitter.removeListener("Chat", sendChat);
    	console.log("Remove connection : ", req.params.uid);
  	});

  	req.on("close", function() {
    	eventEmitter.removeListener("Chat", sendChat);
    	console.log("Remove connection onClose : ", req.params.uid);  
  	});
       
    function sendChat(chat, users) {
      console.log("sendChat's users : ", users);
      if (users.indexOf(req.params.uid) >= 0 ){
        sse("chat", chat);
      }
  	}
}

/**
 * Send message to all connection and return OK code.
 */
exports.chat = function(req, res){
  	eventEmitter.emit('Chat', req.body);
  	res.json({result:'OK'});
}

/**
 * Send message to all connection
 */
exports.sendMessage = function(data, users){
	eventEmitter.emit('Chat', data, users);
}

/**
 * print log
 */
exports.printlog = function(req, res, next){
	console.log("user.controller param name = ", req.params.name);
	// next();
}

/* Server send event start */
function startSees(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  return function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}