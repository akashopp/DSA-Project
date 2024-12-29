import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { language, code, input } = req.body;

    // Log the incoming request body (for debugging purposes)
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

    // Use the /tmp directory in Vercel to store the file
    const tempDir = '/tmp'; // Vercel provides a temporary file system at /tmp
    const filePath = path.join(tempDir, filename);
    
    // Write user code to the respective file in the temporary directory
    try {
      fs.writeFileSync(filePath, code);
    } catch (err) {
      return res.status(500).json({ output: `File write error: ${err.message}` });
    }

    // Commands to compile and run code based on the language
    let compileCmd, runCmd;

    if (language === 'cpp') {
      compileCmd = `g++ -o ${execFileName} ${filePath}`;
      runCmd = `./${execFileName}`;
    } else if (language === 'java') {
      compileCmd = `javac ${filePath}`;
      runCmd = `java -cp ${tempDir} ${execFileName}`; // Use the /tmp directory for running Java
    } else if (language === 'python') {
      compileCmd = 'python --version'; // No compilation step for Python
      runCmd = `python ${filePath}`;
    } else {
      return res.status(400).json({ output: 'Unsupported language' });
    }

    // Log the command setup for debugging
    console.log(`Language: ${language}`);
    console.log(`Filename: ${filename}`);
    console.log(`Exec Filename: ${execFileName}`);
    console.log(`Compile Command: ${compileCmd}`);
    console.log(`Run Command: ${runCmd}`);

    // Compile the code (if necessary) and then run it
    exec(compileCmd, { timeout: 7000 }, (err, stdout, stderr) => {
      if (err) {
        if (err.signal === 'SIGTERM') {
          // Timeout error
          return res.status(500).json({ output: 'Execution Timeout: Code took too long to run.' });
        }
        // Compilation error
        return res.status(500).json({ output: `Compilation Error: ${stderr || err.message}` });
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
          return res.status(500).json({ output: `${errors || 'Unknown execution error / Timeout (Execution > 7s)\n Check your input!'}` });
        }

        res.status(200).json({ output: output || 'No output generated' });
      });
    });
  } else {
    // If not a POST request, respond with method not allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};