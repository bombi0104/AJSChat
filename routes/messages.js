var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Message = require('../models/Message.js');

/* GET messages listing. */
router.get('/', function(req, res, next) {
	Message.find(function (err, msgs) {
		if (err) return next(err);
		res.json(msgs);
	});
});

/* POST /messages */
router.post('/', function(req, res, next) {
  var message = new Message({
    group_id:ObjectId(req.body.group_id),
    from_user_id:ObjectId(req.body.from_user_id),
    content:req.body.content
  });

  message.save(function(err){
    if (err) {
      return next(err);
    }
    res.json(message);
  });

  // Message.create(req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
});

/* GET /messages/id */
router.get('/:id', function(req, res, next) {
  Message.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /messages/:id */
router.put('/:id', function(req, res, next) {
  Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /messages/:id */
router.delete('/:id', function(req, res, next) {
  Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
