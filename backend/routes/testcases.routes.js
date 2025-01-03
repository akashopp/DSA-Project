import express from 'express';
import fs from 'fs';
import path from 'path';

// Fix for __dirname in ES Modules
const __dirname = new URL('.', import.meta.url).pathname;

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { problemName } = req.body;
    console.log("problem name : ", problemName);

    if (!problemName) {
      return res.status(400).json({ message: 'Problem name is required.' });
    }

    // Normalize __dirname and join the relative path
    const testCaseDirectory = path.join(__dirname, `../testcases/${problemName}`);
    
    // Normalize the path and fix any slashes for Windows compatibility
    const normalizedPath = path.normalize(testCaseDirectory);

    // Remove the leading backslash if it exists
    const finalPath = normalizedPath.startsWith(path.sep) ? normalizedPath.slice(1) : normalizedPath;

    console.log("Resolved testcase directory: ", finalPath);

    if (!fs.existsSync(finalPath)) {
      console.log("Directory does not exist:", finalPath);
      return res.status(404).json({ message: 'Test cases directory not found.' });
    }

    const files = fs.readdirSync(finalPath);
    const testCaseNumbers = files
      .filter(file => file.startsWith('input') && file.endsWith('.txt'))
      .map(file => parseInt(file.replace('input', '').replace('.txt', '')))
      .sort((a, b) => a - b);

    if (testCaseNumbers.length === 0) {
      return res.status(404).json({ message: 'No test cases found for this problem.' });
    }

    res.json({ tests: testCaseNumbers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching test cases.' });
  }
});

export default router;