var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var Group = require('../models/Group.js');
var User = require('../models/User.js');

/* GET groups listing. */
router.get('/', function(req, res, next) {
	Group.find(function (err, groups) {
		if (err) return next(err);
		res.json(groups);
	});
});

/* GET groups by userid */
router.get('/user/:id', function(req, res, next) {
  Group.find({users : req.params.id})
  //.populate('from_user', 'name')
    .exec(function (err, groups) {
      if (err) return next(err);
      res.json(groups);
    });
});

/* POST /groups */
router.post('/', function(req, res, next) {
  console.log('req.body : ', req.body);
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
});

/* POST /groups/:id/adduser */
router.post('/:id/adduser', function(req, res, next) {
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
});

/* GET /groups/id */
router.get('/:id', function(req, res, next) {
  Group.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /groups/:id */
router.put('/:id', function(req, res, next) {
  Group.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /groups/:id */
router.delete('/:id', function(req, res, next) {
  Group.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
