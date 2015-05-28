var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Message = require('../models/Message.js');

var streamController = require('../controllers/stream.controller.js');
var groupsController = require('../controllers/groups.controller.js');
var messagesController = require('../controllers/messages.controller.js');
var usersController = require('../controllers/users.controller.js');

/* GET messages listing. */
router.get('/', function(req, res, next) {
	Message.find(function (err, msgs) {
		if (err) return next(err);
		res.json(msgs);
	});
});

/* POST /messages */
router.post('/', groupsController.getUsersInGroup, usersController.getFromUser, messagesController.create);


/* GET /messages/id */
router.get('/:id', function(req, res, next) {
  Message.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /messages/group/id */
router.get('/group/:id', function(req, res, next) {
  Message
    .find({group:req.params.id})
    .populate('from_user', 'name')
    .exec(function (err, msgs) {
      if (err) return next(err);
      res.json(msgs);
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
