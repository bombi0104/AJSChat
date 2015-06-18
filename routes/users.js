var express = require('express');
var router = express.Router();
var Users = require('../controllers/users.controller.js');

/* GET users listing. */
router.get('/', Users.getAll, function(req, res){
	res.json(req.users);
});

/* POST /users */
router.post('/', Users.create);

/* GET /users/id */
router.get('/:id', Users.getById);

/* POST /login */
router.post('/login', Users.login);

/* PUT /users/:id */
router.put('/:id', Users.edit);

/* DELETE /users/:id */
router.delete('/:id', Users.delete);


module.exports = router;
