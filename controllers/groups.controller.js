'use strict';

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var Group = require('../models/Group.js');
var User = require('../models/User.js');

/**
 * Get users_id in group by Name
 */
exports.getUsersInGroup = function(req, res, next){
  Group.findById(req.body.group, function (err, group) {
    if (err) return next(err);

    console.log("getUsersInGroup : ", group);
    req.users = group.users;
    next();
  });
}

/* GET groups listing. */
exports.getAll = function(req, res, next){
	Group.find(function (err, groups) {
		if (err) return next(err);
		res.json(groups);
	});
}

/* GET groups by userid */
exports.getGroupsOfUser = function(req, res, next){
  Group.find({users : req.params.id})
    .populate('users', 'name')
    .exec(function (err, groups) {
      if (err) return next(err);
      res.json(groups);
    });
}

/* POST /groups */
exports.createGroup = function(req, res, next) {
  var group = new Group({name:req.body.name});
  req.body.users.forEach(function(userid){
    group.users.push(ObjectId(userid));
  });

  group.save(function(err){
    if (err) {
      return next(err);
    }
    res.json(group);
  });
}

/* POST /groups/:id/adduser */
exports.addUserToGroup = function(req, res, next) {
  console.log('req.body : ', req.body);
  Group.findById(req.params.id, function (err, group) {
    if (err) return next(err);

    req.body.users.forEach(function(userid){
      group.users.push(ObjectId(userid));
    });

    group.save(function(err){
      if (err) {
        return next(err);
      }
      res.json(group);
    });
  });
}

/* GET /groups/id */
exports.getById = function(req, res, next) {
  Group.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/* PUT /groups/:id */
exports.edit = function(req, res, next) {
  Group.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/* DELETE /groups/:id */
exports.delete = function(req, res, next) {
  Group.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}