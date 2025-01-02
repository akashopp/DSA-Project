import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';
import testcase from './models/testcase.model.js';

dotenv.config();

// Initialize variables
let gfsBucket;

// Function to connect to MongoDB and initialize GridFS
const initializeMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully.');

    const conn = mongoose.connection;
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

    console.log('GridFS initialized successfully.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;  // Stop further execution if MongoDB connection fails
  }
};

// Function to upload a file to GridFS
const uploadFileToGridFS = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      return reject(new Error('GridFS is not initialized yet.'));
    }

    // Log the file path and check if file exists
    console.log(`Preparing to upload file: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return reject(new Error(`File not found: ${filePath}`));
    }

    const uploadStream = gfsBucket.openUploadStream(path.basename(filePath));
    const fileStream = fs.createReadStream(filePath);

    // Log for file streaming
    console.log(`Piping file stream for ${filePath}`);

    fileStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      console.log(`File uploaded successfully: ${filePath} (ID: ${uploadStream.id})`);
      resolve(uploadStream.id);
    });

    uploadStream.on('error', (err) => {
      console.error(`Error uploading file: ${filePath}`, err);
      reject(err);
    });
  });
};

// Function to check if a file exists in GridFS
const checkIfFileExistsInGridFS = async (fileId) => {
  try {
    const file = await gfsBucket.find({ _id: fileId }).toArray();
    if (file.length > 0) {
      console.log(`File with ID ${fileId} exists in GridFS.`);
    } else {
      console.error(`File with ID ${fileId} does not exist in GridFS.`);
    }
  } catch (err) {
    console.error('Error querying GridFS for file:', err);
  }
};

// Function to save test cases from directory
const saveTestCasesFromDirectory = async (problemName, directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    const testCaseData = [];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(directoryPath, fileName);

      // Log the file name and path being processed
      console.log(`Processing file: ${fileName} at path ${filePath}`);

      // Check if file is an input file (ends with .txt and starts with "input")
      if (fileName.startsWith('input') && fileName.endsWith('.txt')) {
        const outputFileName = `output${i + 1}.txt`;
        const outputFilePath = path.join(directoryPath, outputFileName);

        // Log the output file check
        console.log(`Checking for output file: ${outputFilePath}`);

        // Ensure the output file exists before proceeding
        if (!fs.existsSync(outputFilePath)) {
          console.error(`Output file not found: ${outputFilePath}`);
          continue;
        }

        // Ensure directories for uploads exist before uploading
        const inputDir = path.dirname(filePath);
        fs.mkdirSync(inputDir, { recursive: true });

        // Upload both input and output files to GridFS
        const inputFileId = await uploadFileToGridFS(filePath);
        await checkIfFileExistsInGridFS(inputFileId);  // Verify the file exists in GridFS

        const outputFileId = await uploadFileToGridFS(outputFilePath);
        await checkIfFileExistsInGridFS(outputFileId);  // Verify the file exists in GridFS

        // Log the IDs being stored
        console.log(`Input file ID: ${inputFileId}, Output file ID: ${outputFileId}`);

        testCaseData.push({ inputFileId, outputFileId });
      }
    }

    // Log the test case data before saving
    console.log('Test case data:', testCaseData);

    // Save test case data to MongoDB
    const testCases = new testcase({
      name: problemName,
      tests: testCaseData,
    });

    await testCases.save();
    console.log(`Test cases for "${problemName}" saved successfully!`);
  } catch (error) {
    console.error('Error saving test cases:', error);
  }
};

// Execute script
(async () => {
  try {
    await initializeMongoDB();  // Ensure MongoDB and GridFS are initialized

    const problemName = 'Two Sum';
    // Ensure compatibility with both Windows and Unix file systems
    const directoryPath = path.resolve('Two Sum');  // Simplified handling of the path

    // Create directory structure if necessary
    fs.mkdirSync(directoryPath, { recursive: true });

    console.log('Directory Path:', directoryPath);

    // Save test cases from the directory
    await saveTestCasesFromDirectory(problemName, directoryPath);
  } catch (error) {
    console.error('Unhandled error:', error);
  }
})();
