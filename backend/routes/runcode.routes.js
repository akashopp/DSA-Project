import express from 'express'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // For converting URL to file path
import { dirname } from 'path'; // For getting directory name from a file path
// Promisify the exec function to use async/await
import { exec, spawn } from 'child_process';
import util from 'util';


const execPromisified = util.promisify(exec);
const router = express.Router();

// Get the current directory path
const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = dirname(__filename); // Get directory name from file path

router.post('/compile', async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).send({ output: 'Language and code are required.' });
  }

  const filename =
    language === 'cpp'
      ? 'solution.cpp'
      : language === 'java'
      ? 'Solution.java'
      : 'solution.py';
  const execFileName =
    language === 'cpp'
      ? 'solution.exe'
      : language === 'java'
      ? 'Solution.class'
      : 'solution.py';

  const filePath = path.join(__dirname, filename);
  const compiledFilePath = path.join(__dirname, execFileName);

  fs.writeFileSync(filePath, code);

  let compileCmd;
  if (language === 'cpp') {
    compileCmd = `g++ -o "${compiledFilePath}" "${filePath}"`;
  } else if (language === 'java') {
    compileCmd = `javac "${filePath}"`;
  } else if (language === 'python') {
    compileCmd = 'python --version'; // Python doesn't require compilation
  }

  try {
    if (language !== 'python') {
      const { stderr } = await execPromisified(compileCmd, { timeout: 3000 });
      if (stderr) {
        return res.status(500).send({ output: `Compilation Error: ${stderr}` });
      }
    }
    res.status(200).send({ message: 'Compilation successful.' });
  } catch (err) {
    return res.status(500).send({ output: `Compilation Error: ${err.message}` });
  }
});

// Define the POST route for running code
router.post('/run', (req, res) => {
  const { language, input } = req.body;

  const execFileName =
    language === 'cpp'
      ? 'solution.exe'
      : language === 'java'
      ? 'Solution.class'
      : 'solution.py';

  const compiledFilePath = path.join(__dirname, execFileName);

  if (!fs.existsSync(compiledFilePath)) {
    return res.status(400).send({ output: 'Executable file not found. Please compile the code first.' });
  }

  let runCmd;
  let processArgs = [];
  if (language === 'cpp') {
    runCmd = compiledFilePath;
  } else if (language === 'java') {
    runCmd = 'java';
    processArgs = ['-cp', __dirname, 'Solution'];
  } else if (language === 'python') {
    runCmd = 'pypy3';
    processArgs = [compiledFilePath];
  }

  const runProcess = spawn(runCmd, processArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
  
  const timer = setTimeout(() => {
    runProcess.kill('SIGKILL'); // Forcefully kill the process
  }, 1500);

  if (input) {
    runProcess.stdin.write(input);
    runProcess.stdin.end();
  }

  let output = '';
  let errors = '';

  runProcess.stdout.on('data', (data) => {
    output += data;
  });

  runProcess.stderr.on('data', (data) => {
    errors += data;
  });

  runProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({
        output: `${errors || 'Unknown runtime error / Timeout (Execution > 7s)'}`,
      });
    }
    res.send({ output: output || 'No output generated' });
  });
});


// Define a new DELETE route to delete compiled files after execution
router.delete('/delete-executable', (req, res) => {
  const { language } = req.body; // Identify the language type

  // Determine the filename of the compiled executable based on the language
  const compiledFilePath =
    language === 'cpp'
      ? path.join(__dirname, 'solution.exe') // C++ executable
      : language === 'java'
      ? path.join(__dirname, 'Solution.class') // Java compiled file
      : null;

  // console.log(compiledFilePath, fs.existsSync(compiledFilePath));

  // If a compiled file exists, delete it
  if (compiledFilePath && fs.existsSync(compiledFilePath)) {
    fs.unlink(compiledFilePath, (err) => {
      if (err) {
        return res.status(500).send({ output: `Error deleting executable: ${err.message}` });
      }
      // console.log(`Deleted ${compiledFilePath}`);
      res.status(200).send({ message: 'Compiled executable deleted successfully.' });
    });
  } else {
    return res.status(404).send({ output: 'Compiled file not found.' });
  }
});


// Define the POST route for submitting code
router.post('/submit', async (req, res) => {
  const { language, problemName, testNumber } = req.body;
  console.log("running :", problemName, " test :", testNumber);
  if (!problemName || !testNumber) {
    return res.status(400).send({ output: 'Problem name and test number are required.' });
  }

  const testCaseDir = path.join(__dirname, '..', 'testcases', problemName);
  const inputFile = path.join(testCaseDir, `input${testNumber}.txt`);
  const expectedOutputFile = path.join(testCaseDir, `output${testNumber}.txt`);

  const execFileName =
    language === 'cpp'
      ? 'solution.exe'
      : language === 'java'
      ? 'Solution.class'
      : 'solution.py';

  const compiledFilePath = path.join(__dirname, execFileName);

  if (!fs.existsSync(compiledFilePath)) {
    return res.status(400).send({ output: 'Executable file not found. Please compile the code first.' });
  }

  const child = spawn(
    language === 'cpp' ? compiledFilePath : language === 'java' ? 'java' : 'pypy3',
    language === 'java' ? ['-cp', __dirname, 'Solution'] : [compiledFilePath],
    { stdio: [fs.openSync(inputFile, 'r'), 'pipe', 'pipe'] }
  );

  const timer = setTimeout(() => {
    child.kill('SIGKILL'); // Forcefully kill the process
  }, 1500);

  let output = '';
  let errors = '';

  child.stdout.on('data', (data) => {
    output += data;
  });

  child.stderr.on('data', (data) => {
    errors += data;
  });

  child.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ output: `Runtime Error: ${errors || 'Time Limit Exceeded'}` });
    }

    const expectedOutput = fs.readFileSync(expectedOutputFile, 'utf8');
    const isPass = output.trim() === expectedOutput.trim();
    const status = isPass ? 'Passed' : 'Failed';
    const message = isPass
      ? 'Test passed successfully'
      : `Expected: ${expectedOutput.trim()}, but got: ${output.trim()}`;
    console.log('output : ', output);
    console.log('expected : ', expectedOutput);
    console.log('status : ', status);
    res.send({ output: output.trim(), status, message });
  });
});

export default router;