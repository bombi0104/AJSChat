'use strict';

require('log-timestamp');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Message = require('../models/Message.js');

var streamCtrl = require('../controllers/stream.controller.js');
var groupsCtrl = require('../controllers/groups.controller.js');

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
exports.create = function(msg, next) {
  var message = new Message({
    group : ObjectId(msg.group),
    from_user : ObjectId(msg.from_user),
    content : msg.content
  });

  message.save(function(err){
    if (err) {
      return next(err);
    }

    // groupsCtrl.updateTime(msg.group);

    // Get saved message info and send to WC
    Message
    .findOne({ _id: message._id})
    .populate('from_user', 'name')
    .exec(function (err, msg) {
      if (err) return next(err);
      next(msg);
    });
  });
}

/**
 * Create new private message to DB
 */
exports.createPrivate = function(msg, next) {
  var message = new Message({
    from_user : ObjectId(msg.from_user),
    content : msg.content
  });

  message.to_users.push(ObjectId(msg.to_users[0]));

  message.save(function(err){
    if (err) {
      return next(err);
    }
    // Get saved message info and send to WC
    Message
    .findOne({ _id: message._id})
    .populate('from_user', 'name')
    .populate('to_users', 'name')
    .exec(function (err, msg) {
      if (err) return next(err);
      next(msg);
    });
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
    .sort({created_at:-1})
    .limit(50)
    .populate('from_user', 'name')
    .exec(function (err, msgs) {
      if (err) return next(err);

      msgs.sort(function(a,b){
        if (a.created_at > b.created_at)
          return 1;
        else if (a.created_at < b.created_at)
          return -1;
        else 
          return 0;
      });

      res.json(msgs);
    });
}

/**
 * Get private messages
 */
exports.getPrivateMessage = function(req, res) {
  Message
    .find({
      'group': {$exists: false},
      $or : [
        {
          'from_user':req.params.user1, 
          'to_users':req.params.user2
        },
        {
          'from_user':req.params.user2, 
          'to_users':req.params.user1
        }
      ]
    })
    .sort({created_at:-1})
    .limit(50)
    .populate('from_user', 'name')
    .populate('to_users', 'name')
    .exec(function (err, msgs) {
      if (err) return next(err);

      msgs.sort(function(a,b){
        if (a.created_at > b.created_at)
          return 1;
        else if (a.created_at < b.created_at)
          return -1;
        else 
          return 0;
      });

      res.json(msgs);
    });
}

/**
 * Get messages in group
 */
exports.getLast50 = function(req, res) {
  Message
    .find({group:req.params.id})
    .sort({created_at:-1})
    .populate('from_user', 'name')
    .exec(function (err, msgs) {
      if (err) return next(err);
      res.json(msgs);
    });
}

exports.getNext = function(req, res, next){
  Message
  .find({group:req.params.id})
  .where('created_at').lt(req.params.time)
  .sort({created_at:-1})
  .limit(50)
  .populate('from_user', 'name')
  .exec(function (err, msgs) {
    if (err) return next(err);

    msgs.sort(function(a,b){
      if (a.created_at > b.created_at)
        return 1;
      else if (a.created_at < b.created_at)
        return -1;
      else 
        return 0;
    });

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