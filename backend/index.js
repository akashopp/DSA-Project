import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // Import CORS package
import { fileURLToPath } from 'url'; // For converting URL to file path
import { dirname } from 'path'; // For getting directory name from a file path
import testCaseRoutes from './routes/testcases.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

const app = express();
const port = 5000;

dotenv.config()

// Get the current directory path
const __filename = fileURLToPath(import.meta.url); // Convert URL to file path
const __dirname = dirname(__filename); // Get directory name from file path

// Promisify the exec function to use async/await
import util from 'util';
const execPromisified = util.promisify(exec);

// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use('/testcases', testCaseRoutes)



// Define the POST route for running code
app.post('/run', async (req, res) => {
  const { language, code, input } = req.body;

  // Log the incoming request body
  console.log('Request body:', req.body);

  // Temporary file names for code and output
  const filename =
    language === 'cpp'
      ? 'solution.cpp'
      : language === 'java'
      ? 'Solution.java'
      : 'solution.py';
  const execFileName =
    language === 'cpp'
      ? 'solution'
      : language === 'java'
      ? 'Solution'
      : 'solution.py';

  // Write user code to the respective file
  fs.writeFileSync(path.join(__dirname, filename), code);

  // Commands to compile and run code based on the language
  let compileCmd, runCmd;

  if (language === 'cpp') {
    compileCmd = `g++ -o ${execFileName} ${filename}`;
    runCmd = `.\\${execFileName}`; // Correct the path for Windows
  } else if (language === 'java') {
    compileCmd = `javac ${filename}`;
    runCmd = `java ${execFileName}`;
  } else if (language === 'python') {
    compileCmd = 'python --version';
    runCmd = `python ${filename}`;
  } else {
    return res.status(400).send({ output: 'Unsupported language' });
  }

  // Log the command setup for debugging
  console.log(`Language: ${language}`);
  console.log(`Filename: ${filename}`);
  console.log(`Exec Filename: ${execFileName}`);
  console.log(`Compile Command: ${compileCmd}`);
  console.log(`Run Command: ${runCmd}`);

  // Make sure both commands are valid
  if (!compileCmd || !runCmd) {
    return res.status(500).send({ output: 'Invalid command setup' });
  }

  try {
    // Compile the code (if necessary)
    const { stdout, stderr } = await execPromisified(compileCmd, { timeout: 7000 });

    // If there are compilation errors, return them
    if (stderr) {
      return res.status(500).send({ output: `Compilation Error: ${stderr}` });
    }

    // Run the code
    const runProcess = exec(runCmd, { timeout: 7000 });

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
app.delete('/delete-executable', (req, res) => {
  const { language } = req.body; // Identify the language type

  // Determine the filename of the compiled executable based on the language
  const compiledFilePath =
    language === 'cpp'
      ? path.join(__dirname, 'solution.exe') // C++ executable
      : language === 'java'
      ? path.join(__dirname, 'Solution.class') // Java compiled file
      : null;

  // If a compiled file exists, delete it
  if (compiledFilePath && fs.existsSync(compiledFilePath)) {
    fs.unlink(compiledFilePath, (err) => {
      if (err) {
        return res.status(500).send({ output: `Error deleting executable: ${err.message}` });
      }
      console.log(`Deleted ${compiledFilePath}`);
      res.status(200).send({ message: 'Compiled executable deleted successfully.' });
    });
  } else {
    return res.status(404).send({ output: 'Compiled file not found.' });
  }
});

// Define a new POST route for submitting code
app.post('/submit', async (req, res) => {
  const { language, code, input } = req.body;
  
  // Log the incoming request body
  console.log('Submit request body:', req.body);

  // Temporary file names for code and output
  const filename =
    language === 'cpp'
      ? 'solution.cpp'
      : language === 'java'
      ? 'Solution.java'
      : 'solution.py';
  const execFileName =
    language === 'cpp'
      ? 'solution'
      : language === 'java'
      ? 'Solution'
      : 'solution.py';

  // Write user code to the respective file
  fs.writeFileSync(path.join(__dirname, filename), code);

  // Check if compiled files already exist
  const compiledFilePath =
    language === 'cpp'
      ? path.join(__dirname, 'solution.exe')
      : language === 'java'
      ? path.join(__dirname, 'Solution.class')
      : null;

  // If the compiled file already exists, don't recompile
  if (language === 'cpp' || language === 'java') {
    if (fs.existsSync(compiledFilePath)) {
      console.log('Using existing compiled file for', language);
    } else {
      // If not, we compile the code
      let compileCmd, runCmd;

      if (language === 'cpp') {
        compileCmd = `g++ -o ${execFileName} ${filename}`;
        runCmd = `.\\${execFileName}`; // Correct the path for Windows
      } else if (language === 'java') {
        compileCmd = `javac ${filename}`;
        runCmd = `java ${execFileName}`;
      }

      try {
        // Compile the code (if necessary)
        const { stdout, stderr } = await execPromisified(compileCmd, { timeout: 7000 });

        // If there are compilation errors, return them
        if (stderr) {
          return res.status(500).send({ output: `Compilation Error: ${stderr}` });
        }
      } catch (err) {
        return res.status(500).send({ output: `Compilation Error: ${err.message}` });
      }
    }
  }

  // Run the code (same as before)
  let runCmd;
  if (language === 'cpp') {
    runCmd = `.\\${execFileName}`;
  } else if (language === 'java') {
    runCmd = `java ${execFileName}`;
  } else if (language === 'python') {
    runCmd = `python ${filename}`;
  }

  // Execute the code
  try {
    const runProcess = exec(runCmd, { timeout: 7000 });

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



mongoose.connect(process.env.URI).then(()=> {
  console.log("Connected successfully");
  app.listen(process.env.PORT || 8000, (error) => {
    if(error) console.log(err);
    console.log("Running Successfully at : " + process.env.PORT)
  });
}).catch((error) => {
  console.log("Error occurred : ", error);
})