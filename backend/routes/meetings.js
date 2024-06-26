const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Add a new meeting
router.post('/', async (req, res) => {
  const { topic, date, participants } = req.body;
  console.log('Received meeting data:', req.body);
  if (!topic || !date || !participants || !Array.isArray(participants) || participants.length === 0) {
    console.log('Validation error:', { topic, date, participants });
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newMeeting = new Meeting({ topic, date, participants });

  try {
    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    console.log('Error saving meeting:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get meetings by date
router.get('/byDate', async (req, res) => {
  const { date } = req.query;
  try {
    const meetings = await Meeting.find({ date: new Date(date) }).populate('participants');
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
