import express from 'express';
import Problem from '../models/problem.model.js';  // Use default import
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

export default router;