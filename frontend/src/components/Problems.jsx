import React, { useState, useEffect } from 'react';

// ProblemManager class to handle grouping and sorting by difficulty
class ProblemManager {
  static groupByTopic(problems) {
    const grouped = {};

    // Define difficulty levels for sorting
    const difficultyOrder = {
      'Easy': 0,
      'Medium': 1,
      'Hard': 2,
    };

    // Group problems by their topic name and sort by difficulty
    problems.forEach((problem) => {
      if (!grouped[problem.topic]) {
        grouped[problem.topic] = [];
      }
      grouped[problem.topic].push(problem);
    });

    // Sort problems within each topic based on difficulty
    Object.keys(grouped).forEach((topic) => {
      grouped[topic].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    });

    return grouped;
  }
}

function Problems() {
  const [isExpanded, setIsExpanded] = useState({}); // Track expanded/collapsed state for each topic
  const [problems, setProblems] = useState([]); // Store the problem list in state
  const [groupedProblems, setGroupedProblems] = useState({}); // Store the grouped problems by topic
  const [userProblems, setUserProblems] = useState([]); // Store the user's problemId list

  const userId = '67529af276dea13c3d50fbf6'; // This should come from authentication or session data.

  // Fetch problems from the API
  const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:5000/problems');
      if (response.ok) {
        const data = await response.json();
        setProblems(data); // Update the problems state with the fetched data

        // Group problems by topic using ProblemManager
        const grouped = ProblemManager.groupByTopic(data);
        setGroupedProblems(grouped);
      } else {
        console.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  // Fetch user problems
  const fetchUserProblems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/getproblems/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserProblems(userData.problems); // Set the user's problemId list
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch problems and user problems when the component mounts
  useEffect(() => {
    fetchProblems();
    fetchUserProblems();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Toggle the expanded/collapsed state of a particular topic
  const toggleTopic = (topic) => {
    setIsExpanded((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  return (
    <div className="flex-1 bg-slate text-white font-extrabold">
      {/* Render each topic section */}
      {Object.keys(groupedProblems).map((topic) => (
        <div key={topic} className="mb-4">
          {/* Topic Header */}
          <div
            className="flex justify-center mb-2 cursor-pointer p-5 bg-slate-900"
            onClick={() => toggleTopic(topic)}
          >
            <div className="text-xl">{topic}</div>
            <div className='mx-5'>{isExpanded[topic] ? '▲' : '▼'}</div>
          </div>

          {/* Problem List (Only shown if the topic is expanded) */}
          <div
            style={{
              maxHeight: isExpanded[topic] ? '1000px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease-in-out',
            }}
          >
            <table className="w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Problem</th>
                  <th className="p-3 text-left">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {groupedProblems[topic].map((item, index) => (
                  <React.Fragment key={item._id || index}>
                    {/* Use a unique key for each item */}
                    <tr className="bg-gray-800 hover:bg-gray-700 cursor-pointer">
                      <td className="p-3">
                        {/* Checkbox with explicit styling */}
                        <input
                          type="checkbox"
                          checked={userProblems.includes(item._id)} // Check if the problemId exists in user's list
                          onChange={() => toggleProblemStatus(index, topic)} // Toggle the status of the specific problem
                          className="form-checkbox h-5 w-5 text-green-400" // Tailwind styles to ensure visibility and style
                        />
                      </td>
                      <td className="p-3">
                        {/* Make the problemName a clickable link */}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {item.problemName}
                        </a>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-sm font-semibold ${
                            item.difficulty === 'Easy'
                              ? 'text-green-400'
                              : item.difficulty === 'Medium'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Problems;