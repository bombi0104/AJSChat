'use strict';

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Message = require('../models/Message.js');

var streamController = require('../controllers/stream.controller.js');
var groupsController = require('../controllers/groups.controller.js');

/**
 * Get all messages.
 */
exports.getAll = function(req, res){
  Message.find(function (err, msgs) {
    if (err) return next(err);
    res.json(msgs);
  });
}

/**
 * Create new message to DB
 */
exports.create = function(req, res) {
  var message = new Message({
    group : ObjectId(req.body.group),
    from_user : ObjectId(req.body.from_user),
    content : req.body.content
  });

  message.save(function(err){
    if (err) {
      return next(err);
    }

    message.from_user = req.from_user;

    res.json(message);

    // Send realtime message to all user
    streamController.sendMessage(message, req.users);
  });
}

/**
 * Get message by id
 */
exports.getById = function(req, res) {
  Message
    .findOne({ _id: eq.params.id})
    .populate('from_user')
    .exec(function (err, msg) {
      if (err) return next(err);
      res.json(msg);
    });
}

/**
 * Get messages in group
 */
exports.getMessageInGroup = function(req, res) {
  Message
    .find({group:req.params.id})
    .populate('from_user', 'name')
    .exec(function (err, msgs) {
      if (err) return next(err);
      res.json(msgs);
    });
}

/* PUT /messages/:id */
/**
 * Edit a message
 */
exports.edit = function(req, res){
  Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/**
 * Delete message by id
 */
exports.delete = function(req, res){
  Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}