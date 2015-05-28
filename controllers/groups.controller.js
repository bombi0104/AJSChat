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

/**
 * print log
 */
exports.printlog = function(req, res, next){
	console.log("user.controller param name = ", req.params.name);
	// next();
}