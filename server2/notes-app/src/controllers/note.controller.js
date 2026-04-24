const Note = require('../models/note.model');

// @desc    Create a single note
// @route   POST /api/notes
// @access  Public
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
        data: null
      });
    }

    const note = await Note.create({
      title,
      content,
      category,
      isPinned
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Create multiple notes
// @route   POST /api/notes/bulk
// @access  Public
exports.createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'notes array is required and cannot be empty',
        data: null
      });
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    res.status(200).json({
      success: true,
      message: 'Notes fetched successfully',
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Public
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
        data: null
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note fetched successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Full replace a note
// @route   PUT /api/notes/:id
// @access  Public
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
        data: null
      });
    }

    // PUT should replace the whole document. 
    // Mongoose findByIdAndUpdate with { overwrite: true } can be used, 
    // but usually in Express we just update all fields.
    // If a field is missing in req.body, it should be set to its default or undefined.
    
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, category, isPinned },
      { new: true, runValidators: true, overwrite: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note replaced successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Partial update a note
// @route   PATCH /api/notes/:id
// @access  Public
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
        data: null
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update',
        data: null
      });
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Delete a single note
// @route   DELETE /api/notes/:id
// @access  Public
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
        data: null
      });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Delete multiple notes
// @route   DELETE /api/notes/bulk
// @access  Public
exports.deleteNotesBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ids array is required and cannot be empty',
        data: null
      });
    }

    const result = await Note.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get notes by category
// @route   GET /api/notes/category/:category
// @access  Public
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ['work', 'personal', 'study'];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Allowed: work, personal, study',
        data: null
      });
    }

    const notes = await Note.find({ category });

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get notes by pinned status
// @route   GET /api/notes/status/:isPinned
// @access  Public
exports.getNotesByPinnedStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;

    if (isPinned !== 'true' && isPinned !== 'false') {
      return res.status(400).json({
        success: false,
        message: 'isPinned must be true or false',
        data: null
      });
    }

    const pinned = isPinned === 'true';
    const notes = await Note.find({ isPinned: pinned });

    res.status(200).json({
      success: true,
      message: pinned ? 'Fetched all pinned notes' : 'Fetched all unpinned notes',
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get note summary (no content)
// @route   GET /api/notes/:id/summary
// @access  Public
exports.getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
        data: null
      });
    }

    const note = await Note.findById(id).select('-content');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note summary fetched successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Filter notes by category and/or pinned status
// @route   GET /api/notes/filter
// @access  Public
exports.filterNotes = async (req, res) => {
  try {
    const { category, isPinned } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isPinned) {
      query.isPinned = isPinned === 'true';
    }

    const notes = await Note.find(query);

    res.status(200).json({
      success: true,
      message: 'Notes fetched successfully',
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Filter pinned notes, optionally by category
// @route   GET /api/notes/filter/pinned
// @access  Public
exports.filterPinnedNotes = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isPinned: true };

    if (category) {
      query.category = category;
    }

    const notes = await Note.find(query);

    res.status(200).json({
      success: true,
      message: 'Pinned notes fetched successfully',
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Filter notes by category name (query param)
// @route   GET /api/notes/filter/category
// @access  Public
exports.filterByCategoryQuery = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Query param 'name' is required",
        data: null
      });
    }

    const notes = await Note.find({ category: name });

    res.status(200).json({
      success: true,
      message: `Notes filtered by category: ${name}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};
