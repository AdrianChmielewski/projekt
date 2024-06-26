const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://192.168.39.78:27017/meetingApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/users', require('./routes/users'));
app.use('/meetings', require('./routes/meetings'));
app.use('/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
