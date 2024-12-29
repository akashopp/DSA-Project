import React, { useState, useEffect } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import './App.css'; // Import Tailwind-based CSS

const App = () => {
  // Define states
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Templates for each language
  const templates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    python: `# Python program to print Hello World
print("Hello, World!")`,
    java: `// Java Solution class should be named 'Solution' for the program to compile
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  };

  // Effect to load code template when language changes
  useEffect(() => {
    setCode(templates[language]);
  }, [language]);

  // Handle form submission and call the API to run the code
  const handleRunCode = async () => {
    setLoading(true);
    setOutput(''); // Clear any previous output
    setError('');  // Clear previous errors

    try {
      // Send the code and input to the backend
      const response = await axios.post('https://code-runner-steel.vercel.app/api/run', {
        language: language, // Send the selected language
        code: code,
        input: input, // Send the input entered by the user
      });

      // Set the output based on the response
      if (response.data.output) {
        setOutput(response.data.output);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      // Display the error message from the backend
      if (error.response && error.response.data && error.response.data.output) {
        setError(error.response.data.output);
      } else {
        setError('Error occurred while executing the code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-200 py-10 px-5">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-center mb-6">Code Runner</h1>

        {/* Language Selection */}
        <div className="mb-6 flex justify-center">
          <label htmlFor="language-select" className="mr-4 text-lg">Select Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 border border-gray-600 rounded-md text-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-600"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* Code Editor */}
        <CodeEditor code={code} setCode={setCode} />

        {/* Input Console */}
        <div className="mt-6">
          <h3 className="text-xl font-medium">Input Console</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your code here..."
            className="w-full mt-2 p-3 border border-gray-600 rounded-md h-40 resize-none text-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Run Code Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? (
              <div className="spinner-border animate-spin h-6 w-6 border-4 border-t-transparent border-blue-500 rounded-full" />
            ) : (
              'Run Code'
            )}
          </button>
        </div>

        {/* Output Console */}
        <div className="mt-6">
          <h3 className="text-xl font-medium">Output Console</h3>
          <pre
            className={`mt-2 p-4 border rounded-md text-lg whitespace-pre-wrap ${error ? 'bg-red-800 border-red-600 text-red-300' : 'bg-gray-700 border-gray-600 text-gray-200'}`}
          >
            {error || output || 'No output yet'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;