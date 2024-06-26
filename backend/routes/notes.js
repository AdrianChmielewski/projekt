const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Add a new note
router.post('/', async (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newNote = new Note({ title, content, date });

  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get notes by date
router.get('/byDate', async (req, res) => {
  const { date } = req.query;
  try {
    const notes = await Note.find({ date: new Date(date) });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
