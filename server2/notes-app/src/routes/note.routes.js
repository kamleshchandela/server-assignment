const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

router.post('/', noteController.createNote);

module.exports = router;
