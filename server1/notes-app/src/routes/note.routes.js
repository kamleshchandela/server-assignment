const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

router.post('/', noteController.createNote);
router.post('/bulk', noteController.createBulkNotes);
router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.patch('/:id', noteController.patchNote);
router.delete('/:id', noteController.deleteNote);
router.delete('/bulk', noteController.deleteBulkNotes);

module.exports = router;
