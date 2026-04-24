const express = require('express');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/note.routes');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/notes', noteRoutes);

module.exports = app;
