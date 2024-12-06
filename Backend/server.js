const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const problemRoutes = require('./routes/problem.routes'); // Import the problem routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Main route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Use problem routes
app.use('/problems', problemRoutes); // Set up routes for problems

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});