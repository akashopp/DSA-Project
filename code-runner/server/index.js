const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import CORS package

const app = express();
const port = 5000;

// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define the POST route for running code
app.post('/run', (req, res) => {
  const { language, code, input } = req.body;

  // Log the incoming request body
  console.log('Request body:', req.body);

  // Temporary file names for code and output
  const filename = language === 'cpp' ? 'solution.cpp' : language === 'java' ? 'Solution.java' : 'solution.py';
  const execFileName = language === 'cpp' ? 'solution' : language === 'java' ? 'Solution' : 'solution.py';

  // Write user code to the respective file
  fs.writeFileSync(path.join(__dirname, filename), code);

  // Commands to compile and run code based on the language
  let compileCmd, runCmd;

  if (language === 'cpp') {
    compileCmd = `g++ -o ${execFileName} ${filename}`;
    runCmd = `.\\${execFileName}`;  // Correct the path for Windows
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

  // Compile the code (if necessary) and then run it
  exec(compileCmd, { timeout: 7000 }, (err, stdout, stderr) => {
    if (err) {
      if (err.signal === 'SIGTERM') {
        // Timeout error
        return res.status(500).send({ output: 'Execution Timeout: Code took too long to run.' });
      }
      // If there's a compilation error
      return res.status(500).send({ output: `Compilation Error: ${stderr || err.message}` });
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
        return res.status(500).send({ output: `${errors || 'Unknown execution error / Timeout (Execution > 7s)\n Check your input!'}` });
      }

      res.send({ output: output || 'No output generated' });
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});