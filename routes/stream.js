var express = require('express');
var router = express.Router();

var streamController = require('../controllers/stream.controller.js');

/* GET stream listing. Connect method */
router.get('/:uid', streamController.registUser);

// Send message to all connection
router.post('/', streamController.chat);

module.exports = router;
