var express = require('express');
var router = express.Router();

var Groups = require('../controllers/groups.controller.js');
var Messages = require('../controllers/messages.controller.js');
var Users = require('../controllers/users.controller.js');

/* GET messages listing. */
router.get('/', Messages.getAll);
/* POST /messages */
router.post('/', Groups.getUsersInGroup, Users.getFromUser, Messages.create);
/* GET /messages/id */
router.get('/:id', Messages.getById);
/* GET /messages/group/id */
router.get('/group/:id', Messages.getMessageInGroup);
/* PUT /messages/:id */
router.put('/:id', Messages.edit);
/* DELETE /messages/:id */
router.delete('/:id', Messages.delete);


module.exports = router;
