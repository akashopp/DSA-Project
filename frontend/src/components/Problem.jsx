import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';

const Problem = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!problemId) return;

    fetch(`http://localhost:5000/problems/${problemId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch problem details');
        }
        return res.json();
      })
      .then((data) => setProblem(data))
      .catch((err) => setError(err.message));
  }, [problemId]);

  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (!problem) return <div className="text-gray-500 text-center mt-4">Loading...</div>;

  const difficultyColor = {
    Easy: 'text-green-500',
    Medium: 'text-yellow-500',
    Hard: 'text-red-500'
  }[problem.difficulty] || 'text-gray-400';

  return (
    <>
      <div className="w-full px-4 py-6 bg-gray-900 shadow-lg rounded-lg mt-6 text-white">
        <h1 className="text-2xl font-bold text-white mb-4">{problem.problemName}</h1>
        <p className="text-lg"><strong className="text-gray-400">Difficulty:</strong> <span className={difficultyColor}>{problem.difficulty}</span></p>
        <p className="text-lg"><strong className="text-gray-400">Topic:</strong> {problem.topic}</p>
        <p className="mt-4 text-gray-300 w-full"><strong>Description:</strong> {problem.description}</p>
        <p className="mt-4 text-gray-400 font-semibold">Constraints:</p>
        <ul className="list-disc list-inside text-gray-300">
          {problem.constraints?.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
        <a 
          href={problem.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block mt-4 text-blue-400 hover:underline"
        >View on LeetCode</a>
          <div className="w-full px-4 py-6 bg-gray-900 shadow-lg rounded-lg mt-6 text-white">
            <h2 className="text-2xl font-bold text-white mb-4">Submit your code!</h2>
            <CodeEditor />
          </div>
      </div>
    </>
  );
};

export default Problem;