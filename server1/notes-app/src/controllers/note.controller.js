const Note = require('../models/note.model');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const mongoose = require('mongoose');

const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const note = await Note.create({ title, content, category, isPinned });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notes array is required'
      });
    }

    const notesToInsert = notes.map(note => ({
      title: note.title,
      content: note.content,
      category: note.category || 'personal',
      isPinned: note.isPinned || false
    }));

    const createdNotes = await Note.insertMany(notesToInsert);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, category, isPinned },
      { new: true, overwrite: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const patchNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body cannot be empty'
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note patched successfully',
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID'
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'IDs array is required'
      });
    }

    const validIds = ids.filter(id => isValidObjectId(id));

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid IDs provided'
      });
    }

    const result = await Note.deleteMany({ _id: { $in: validIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  updateNote,
  patchNote,
  deleteNote,
  deleteBulkNotes
};
