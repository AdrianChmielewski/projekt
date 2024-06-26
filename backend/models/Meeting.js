const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
});

module.exports = mongoose.model('Meeting', meetingSchema);