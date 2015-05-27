var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find(function (err, users) {
		if (err) return next(err);
		res.json(users);
	});
});

/* POST /users */
router.post('/', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /users/id */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST /login */
router.post('/login', function(req, res, next) {
  console.log("Login body : ",req.body);
  User.findOne({name:req.body.username, password:req.body.password})
      .select('name token')
      .exec(function (err, user) {
        if (err) return handleError(err);

        console.log("Found user : ",user);
        res.json(user);
      })
});

/* PUT /users/:id */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /users/:id */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
