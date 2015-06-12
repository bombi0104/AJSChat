'use strict';

require('log-timestamp');
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
    .populate('users', 'name email')
    .sort({updated_at:-1})
    .exec(function (err, groups) {
      if (err) return next(err);
      res.json(groups);
    });
}

exports.getGroups = function(req, res, next){
  Group.find({users : req.params.id})
    .populate('users', 'name email')
    .sort({updated_at:-1})
    .exec(function (err, groups) {
      if (err) return next(err);
      //groups.push(req.users);
      res.json(groups.concat(req.users));
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

    getGroupById(group._id, function(gr){
      res.json(gr);
    });
  });
}

/* POST /groups/:id/adduser */
exports.addUsers = function(req, res, next) {
  Group.findById(req.params.id, function (err, group) {
    if (err) return next(err);

    req.body.users.forEach(function(userid){
      group.users.push(ObjectId(userid));
    });

    group.save(function(err){
      if (err) return next(err);
      res.json(group);
    });
  });
}

/**
 * Remove users from group
 **/
exports.removeUsers = function(req, res, next){
  Group.findById(req.params.id, function (err, group) {
    if (err) return next(err);

    req.body.users.forEach(function(userid){
      for (var i = 0; i < group.users.length; i++) {
        if (group.users[i] == userid){
          group.users.splice(i, 1);
          i--;
        }
      };
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
  getGroupById(req.params.id, function(group){
    res.json(group);
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

var getGroupById = function(groupid, next){
  Group.findOne({_id : groupid})
    .populate('users', 'name email')
    .exec(function (err, group) {
      if (err) return next(err);
      next(group);
    });
}

exports.updateTime = function(groupid){
  Group.findOne({_id : groupid})
    .exec(function (err, group) {
      if (err) {
        console.log("GroupsController","updateTime","findOne Error");
        return;
      }

      group.updated_at = Date.now();

      group.save(function(err) {
        if (err) { 
          console.log("GroupsController","updateTime","Save error");
        }
      });
    });
}