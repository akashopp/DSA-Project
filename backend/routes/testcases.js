import express from 'express';
import TestCase from '../models/testcase.model.js'; // Assuming the model is located in models/testcase.model.js
const router = express.Router();

// GET /testcases/:id - Get test cases by testcase id
router.get('/:id', async (req, res) => {
    try {
        // Extract the 'id' parameter from the request URL
        const { id } = req.params;

        // If no 'id' is provided, return an error
        if (!id) {
            return res.status(400).json({ message: 'Test case ID is required.' });
        }

        // Search for the test case by the provided ID
        const testcase = await TestCase.findById(id);
        if (!testcase) {
            return res.status(404).json({ message: 'Test case not found.' });
        }

        // Return the test case found
        res.json(testcase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching test case.' });
    }
});

// POST /testcases - Create a new test case
router.post('/', async (req, res) => {
    try {
        const { name, tests } = req.body;

        // Validate input data
        if (!name || !tests || !Array.isArray(tests)) {
            return res.status(400).json({ message: 'Invalid data. Please provide the problem name and an array of tests.' });
        }

        // Create a new TestCase document
        const newTestCase = new TestCase({
            name,
            tests
        });

        // Save the new test case to the database
        await newTestCase.save();
        res.status(201).json(newTestCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating new test case.' });
    }
});

// Export the router to use in the main app
export default router;