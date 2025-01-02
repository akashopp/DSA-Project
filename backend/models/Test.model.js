import mongoose from 'mongoose';

// Create the TestCase schema
const testCaseSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the problem (e.g., "Two Sum")
  inputFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },  // Reference to the input file in GridFS
  outputFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },  // Reference to the output file in GridFS
});

// Create and export the model
const Test = mongoose.model('Test', testCaseSchema);
export default Test;
