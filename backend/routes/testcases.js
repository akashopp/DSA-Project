// router.js or wherever your router is defined
import express from 'express';
import { getTestCases } from '../gettests.js'; // Import the function from gettests.js
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Extract the 'problemName' from the request body
    const { problemName } = req.body;
    console.log("problem name : ", problemName);

    // If no 'problemName' is provided, return an error
    if (!problemName) {
      return res.status(400).json({ message: 'Problem name is required.' });
    }

    // Call the getTestCases function with the problemName
    const { testCases, error } = await getTestCases(problemName);

    if (error) {
      return res.status(404).json({ message: error });
    }

    // Return the test cases found
    res.json({ tests: testCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching test cases.' });
  }
});

export default router;