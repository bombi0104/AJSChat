var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Group = require('../models/Group.js');
var User = require('../models/User.js');

/* GET groups listing. */
router.get('/', function(req, res, next) {
	Group.find(function (err, groups) {
		if (err) return next(err);
		res.json(groups);
	});
});

/* POST /groups */
router.post('/', function(req, res, next) {
  console.log('req.body : ', req.body);
  var group = new Group({name:req.body.name});
  group.save(function(err){
    if (err) {
      console.log('error 2');
      return next(err);
    }
    //res.json(group);
    req.body.users.forEach(function(userid){
      console.log('Add user to group : ', userid);
      group.addUser(userid);
    });

    res.json(group);
  });

  // req.body.users.forEach(function(userid){
  //   console.log('userid = ', userid);
  //   User.findById(userid, function (err, user) {
  //     if (err) {
  //       console.log('error 1', userid);
  //       return next(err);
  //     }
  //     console.log(user);
  //     group.users.push(user); //Co van de gi khong ?

  //     group.save(function(err){
  //       if (err) {
  //         console.log('error 2');
  //       return next(err);
  //       }
  //     });
  //   });
  // });



  // Khong save o day thi khong dua vao db dc thi phai. 
  // Co cach nao dua object ra ngoai de save khong ?
  // group.save(function(err){
  //   if (err) {
  //     console.log('error 2');
  //     return next(err);
  //   }
  //   res.json(group);
  // });


  // Group.create(req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
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
