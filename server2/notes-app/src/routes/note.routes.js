const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

router.post('/', noteController.createNote);
router.post('/bulk', noteController.createNotesBulk);
router.get('/', noteController.getNotes);

module.exports = router;
