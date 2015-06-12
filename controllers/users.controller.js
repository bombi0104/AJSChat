'use strict';

require('log-timestamp');
var mongoose = require('mongoose');
var User = require('../models/User.js');

/**
 * Get user by Name
 */
exports.getFromUser = function(req, res, next){
  User.findById(req.body.from_user, function (err, user) {
    if (err) return next(err);
    req.from_user = user;
    next();
  });
}

/* GET users listing. */
exports.getAll = function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    req.users = users;
    next();
    // res.json(users);
  });
}

/* POST /users */
exports.create = function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/* GET /users/id */
exports.getById = function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/* POST /login */
exports.login = function(req, res, next) {
//   console.log("Login body : ",req.body);
  User.findOne({email:req.body.email, password:req.body.password})
      .select('name token')
      .exec(function (err, user) {
        if (err) return handleError(err);

        console.log("Found user : ",user);
        res.json(user);
      })
}

/* PUT /users/:id */
exports.edit = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}

/* DELETE /users/:id */
exports.delete = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
}