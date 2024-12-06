const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Create the Problem model using the schema
const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;