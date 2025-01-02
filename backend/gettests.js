import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';  // Import GridFSBucket to fetch the file data
import dotenv from 'dotenv';
import testcase from './models/testcase.model.js'; // Assuming TestCase model is defined

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.URI).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Create GridFS bucket after connecting to MongoDB
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    console.log("GridFS initialized successfully.");
});

// Function to check if a file exists in GridFS by metadata
const fileExists = async (fileId) => {
    if (!gfs) {
        console.error('GridFSBucket is not initialized yet.');
        return false;
    }

    try {
        // Check if file exists by querying GridFS metadata
        const files = await gfs.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (files.length > 0) {
            console.log(`File with ID ${fileId} found in GridFS.`);
            return true;
        } else {
            console.log(`File with ID ${fileId} not found.`);
            return false;
        }
    } catch (error) {
        console.error("Error checking if file exists:", error);
        return false;
    }
};

// Function to retrieve file stream
const getFileStream = (fileId) => {
    try {
        return gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    } catch (error) {
        console.error(`Error retrieving file stream for fileId ${fileId}:`, error);
        return null;
    }
};

// Debugging the test case file existence
export const getTestCases = async (problemName) => {
    try {
        const testCases = await testcase.find({ name: problemName });
        console.log('Test cases:', testCases);

        if (testCases.length === 0) {
            console.log('No test cases found for the given problem name.');
            return { error: 'No test cases found for the given problem name.' };
        }

        const testCaseResults = [];

        for (const testCase of testCases) {
            const tests = testCase.tests;

            for (const test of tests) {
                const { inputFileId, outputFileId } = test;

                console.log('Test inputFileId:', inputFileId, 'outputFileId:', outputFileId);

                if (!inputFileId || !outputFileId ||
                    !mongoose.Types.ObjectId.isValid(inputFileId) ||
                    !mongoose.Types.ObjectId.isValid(outputFileId)) {
                    console.log('Invalid file IDs:', inputFileId, outputFileId);
                    continue;
                }

                // Check if the files exist
                const inputFileExists = await fileExists(inputFileId);
                const outputFileExists = await fileExists(outputFileId);

                if (!inputFileExists || !outputFileExists) {
                    console.log(`File not found for inputFileId: ${inputFileId} or outputFileId: ${outputFileId}`);
                    continue;
                }

                // Retrieve file streams
                const inputStream = getFileStream(inputFileId);
                const outputStream = getFileStream(outputFileId);

                if (!inputStream || !outputStream) {
                    console.log(`Error retrieving file streams for inputFileId: ${inputFileId} or outputFileId: ${outputFileId}`);
                    continue;
                }

                let inputData = '';
                let outputData = '';

                // Read file data
                inputStream.on('data', chunk => inputData += chunk.toString());
                outputStream.on('data', chunk => outputData += chunk.toString());

                await new Promise((resolve, reject) => {
                    inputStream.on('end', () => {
                        outputStream.on('end', () => {
                            testCaseResults.push({
                                name: testCase.name,
                                input: inputData,
                                output: outputData,
                            });
                            resolve();
                        });
                    });

                    inputStream.on('error', (error) => {
                        console.error("Error reading input file:", error);
                        reject(error);
                    });
                    outputStream.on('error', (error) => {
                        console.error("Error reading output file:", error);
                        reject(error);
                    });
                });
            }
        }

        return { testCases: testCaseResults };
    } catch (error) {
        console.error("Error retrieving test cases:", error);
        return { error: 'Error retrieving test cases.' };
    }
};
