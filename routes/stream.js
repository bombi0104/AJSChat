var express = require('express');
var router = express.Router();
var events = require('events');
var eventEmitter = new events.EventEmitter();

var streamController = require('../controllers/stream.controller.js');

/* GET stream listing. Connect method*/
router.get('/:uid', function(req, res, next) {
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
       
  function sendChat(chat) {
    sse("chat", chat);
  }
});

/**
 * Send message to all connection
 */
router.post('/', function(req, res, next){
  eventEmitter.emit('Chat', req.body);
  res.json({result:'OK'});
});

/* Server send event start */
function startSees(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  /* Send method */
  return function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

module.exports = router;
