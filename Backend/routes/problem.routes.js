const express = require('express');
const Problem = require('../models/problem.model');

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving problems' });
  }
});

router.put('/update/:id', async (req, res) => {
  const { status } = req.body;  // The status (true/false) sent from the frontend
  
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,      // The ID of the problem
      { status: status },  // The updated status
      { new: true }        // Return the updated document
    );
    
    if (!updatedProblem) {
      return res.status(404).send('Problem not found');
    }
    
    res.send(updatedProblem);  // Respond with the updated problem
  } catch (error) {
    console.error('Error updating problem status:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;