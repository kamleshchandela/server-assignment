const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

router.post('/', noteController.createNote);
router.post('/bulk', noteController.createNotesBulk);
router.get('/', noteController.getNotes);
router.get('/category/:category', noteController.getNotesByCategory);
router.get('/status/:isPinned', noteController.getNotesByPinnedStatus);
router.get('/filter', noteController.filterNotes);
router.get('/filter/pinned', noteController.filterPinnedNotes);
router.get('/filter/category', noteController.filterByCategoryQuery);
router.get('/filter/date-range', noteController.filterByDateRange);
router.get('/paginate', noteController.paginateNotes);
router.get('/paginate/category/:category', noteController.paginateNotesByCategory);
router.get('/:id/summary', noteController.getNoteSummary);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.replaceNote);
router.patch('/:id', noteController.updateNote);
router.delete('/bulk', noteController.deleteNotesBulk);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
