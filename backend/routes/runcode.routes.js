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

// Define the POST route for running code
router.post('/run', async (req, res) => {
  const { language, code, input } = req.body;

  // Log the incoming request body
  // console.log('Request body:', req.body);
  // console.log(__dirname);

  // Temporary file names for code and output
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
      ? 'Solution'
      : 'solution.py';

  // Write user code to the respective file
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, code);

  // Log the file write and path
  // console.log(`File written to ${filePath}`);

  // Ensure the file exists before compiling
  if (!fs.existsSync(filePath)) {
    return res.status(500).send({ output: `File ${filePath} not found after writing.` });
  }

  // Set the working directory to the one where the code file is located
  const workingDir = __dirname;

  // Commands to compile and run code based on the language
  let compileCmd, runCmd;
  if (language === 'cpp') {
    compileCmd = `g++ -o ${execFileName} ${filePath}`;
    runCmd = path.join(workingDir, execFileName); // Correct path for Windows
  } else if (language === 'java') {
    compileCmd = `javac ${filePath}`;
    runCmd = `java -cp ${workingDir} Solution`; // Ensure to run from the correct directory
  } else if (language === 'python') {
    compileCmd = 'python --version'; // Python doesn't need compilation, just verify it's available
    runCmd = `python ${filePath}`;
  } else {
    return res.status(400).send({ output: 'Unsupported language' });
  }

  // Log the command setup for debugging
  // console.log(`Language: ${language}`);
  // console.log(`Filename: ${filename}`);
  // console.log(`Exec Filename: ${execFileName}`);
  // console.log(`Compile Command: ${compileCmd}`);
  // console.log(`Run Command: ${runCmd}`);

  // Make sure both commands are valid
  if (!compileCmd || !runCmd) {
    return res.status(500).send({ output: 'Invalid command setup' });
  }

  try {
    // Compile the code (if necessary)
    const { stdout, stderr } = await execPromisified(compileCmd, { cwd: workingDir, timeout: 3000 });

    // If there are compilation errors, return them
    if (stderr) {
      return res.status(500).send({ output: `Compilation Error: ${stderr}` });
    }

    // Run the code
    const runProcess = exec(runCmd, { cwd: workingDir, timeout: 3000 });

    // If input is provided, write it to the process's stdin
    if (input) {
      runProcess.stdin.write(input);
      runProcess.stdin.end(); // End the stdin stream
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
          output: `${errors || 'Unknown execution error / Timeout (Execution > 7s)\n Check your input!'}`,
        });
      }

      res.send({ output: output || 'No output generated' });
    });
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      // Timeout error
      return res.status(500).send({ output: 'Execution Timeout: Code took too long to run.' });
    }
    return res.status(500).send({ output: `Execution Error: ${err.message}` });
  }
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
  const { language, code, problemName, testNumber } = req.body;
  console.log("running :", problemName, " test :", testNumber);

  if (!problemName || !testNumber) {
    return res.status(400).send({ output: 'Problem name and test number are required.' });
  }

  const testCaseDir = path.join(__dirname, '..', 'testcases', problemName);

  if (!fs.existsSync(testCaseDir)) {
    return res.status(404).send({ output: `Test case directory for ${problemName} not found.` });
  }

  const inputFile = path.join(testCaseDir, `input${testNumber}.txt`);
  const expectedOutputFile = path.join(testCaseDir, `output${testNumber}.txt`);

  if (!fs.existsSync(inputFile)) {
    return res.status(404).send({ output: `Input file for test number ${testNumber} not found.` });
  }

  if (!fs.existsSync(expectedOutputFile)) {
    return res.status(404).send({ output: `Expected output file for test number ${testNumber} not found.` });
  }

  const filename = language === 'cpp'
    ? 'solution.cpp'
    : language === 'java'
    ? 'Solution.java'
    : 'solution.py';

  const execFileName = language === 'cpp'
    ? 'solution.exe'
    : language === 'java'
    ? 'Solution.class'
    : 'solution.py';

  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, code);

  let compileCmd;
  const compiledFilePath = path.join(__dirname, execFileName);
  let compileNeeded = false;

  if (language === 'cpp') {
    if (!fs.existsSync(compiledFilePath)) {
      compileNeeded = true;
      compileCmd = `g++ -o "${compiledFilePath}" "${filePath}"`;
    }
  } else if (language === 'java') {
    if (!fs.existsSync(compiledFilePath) || fs.statSync(filePath).mtime > fs.statSync(compiledFilePath).mtime) {
      compileNeeded = true;
      compileCmd = `javac "${filePath}"`;
    }
  }

  try {
    if (compileNeeded) {
      const { stdout, stderr } = await execPromisified(compileCmd, { timeout: 3000 });
      if (stderr) {
        return res.status(500).send({ output: `Compilation Error: ${stderr}` });
      }
    }

    let runCmd;
    if (language === 'cpp') {
      runCmd = compiledFilePath;
    } else if (language === 'java') {
      runCmd = `java`;
    } else if (language === 'python') {
      runCmd = `python`;
    }

    const processArgs = language === 'java'
      ? ['-cp', __dirname, 'Solution']
      : [compiledFilePath];

    const child = spawn(runCmd, processArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

    const timer = setTimeout(() => {
      child.kill('SIGKILL'); // Forcefully kill the process
    }, 3000);

    const inputStream = fs.createReadStream(inputFile);
    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);

      if (code !== 0) {
        return res.status(500).send({ output: `Runtime Error: ${errorOutput.trim() || 'Time Limit Exceeded'}` });
      }

      const expectedOutput = fs.readFileSync(expectedOutputFile, 'utf8');
      console.log('output : ', output);
      console.log('expected : ', expectedOutput);
      const isPass = output.trim() === expectedOutput.trim();
      const status = isPass ? 'Passed' : 'Failed';
      const message = isPass ? 'Test passed successfully' : `Expected: ${expectedOutput.trim()}, but got: ${output.trim()}`;

      res.send({ output: output.trim(), status, message });
      console.log('status : ', status);
    });

    inputStream.pipe(child.stdin);
  } catch (err) {
    return res.status(500).send({ output: `Execution Error: ${err.message}` });
  }
});

export default router;