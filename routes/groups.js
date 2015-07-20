var express = require('express');
var router = express.Router();

var groups = require('../controllers/groups.controller.js');
var users = require('../controllers/users.controller.js');

/* GET groups listing. */
router.get('/', groups.getAll);
/* GET groups by userid */
router.get('/user/:id', groups.getGroupsOfUser);
/* GET groups by userid */
router.get('/user2/:id', users.getAll, groups.getGroupsAndUsers);
/* POST /groups */
router.post('/', groups.createGroup);
/* POST /groups/:id/adduser */
router.post('/:id/addUsers', groups.addUsers);
router.post('/:id/removeUsers', groups.removeUsers);
/* GET /groups/id */
router.get('/:id', groups.getById);
/* PUT /groups/:id */
router.put('/:id', groups.edit);
/* DELETE /groups/:id */
router.delete('/:id', groups.delete);


module.exports = router;
