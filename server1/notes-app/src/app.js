const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notes Management API is running',
    endpoints: {
      createNote: 'POST /api/notes',
      createBulkNotes: 'POST /api/notes/bulk',
      getAllNotes: 'GET /api/notes',
      getNoteById: 'GET /api/notes/:id',
      updateNote: 'PUT /api/notes/:id',
      patchNote: 'PATCH /api/notes/:id',
      deleteNote: 'DELETE /api/notes/:id',
      deleteBulkNotes: 'DELETE /api/notes/bulk'
    }
  });
});

app.use('/api/notes', require('./routes/note.routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
