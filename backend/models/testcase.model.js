import mongoose from 'mongoose';

// Define the schema for the test cases
const testCaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the problem (e.g., "Two Sum")
  },
  tests: [{
    input: {
      type: String,
      required: true, // Input for the test case
    },
    output: {
      type: String,
      required: true, // Expected output for the test case
    }
  }]
}, { timestamps: true });

// Create the model for test cases
const TestCase = mongoose.model('TestCase', testCaseSchema);

export default TestCase;