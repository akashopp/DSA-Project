import React, { useState, useEffect } from 'react';

// ProblemManager class to handle grouping by topic
class ProblemManager {
  static groupByTopic(problems) {
    const grouped = {};

    // Group problems by their topic name
    problems.forEach((problem) => {
      if (!grouped[problem.topic]) {
        grouped[problem.topic] = [];
      }
      grouped[problem.topic].push(problem);
    });

    return grouped;
  }
}

function Problems() {
  const [isExpanded, setIsExpanded] = useState({}); // Track expanded/collapsed state for each topic
  const [problems, setProblems] = useState([]); // Store the problem list in state
  const [groupedProblems, setGroupedProblems] = useState({}); // Store the grouped problems by topic

  // Fetch problems from the API when the component mounts
  useEffect(() => {
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

    fetchProblems();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Toggle the expanded/collapsed state of a particular topic
  const toggleTopic = (topic) => {
    setIsExpanded((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  // Handle checkbox change, marking a problem as solved
  const toggleProblemStatus = async (index, topic) => {
    const problemId = groupedProblems[topic][index]._id; // Get the problem's ID
    const currentStatus = groupedProblems[topic][index].status; // Get the current status

    try {
      // Send a PUT request to update the problem's status in the backend
      const response = await fetch(`http://localhost:5000/problems/update/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: !currentStatus, // Toggle the status
        }),
      });

      if (response.ok) {
        // Update the state with the new status if the update is successful
        const updatedProblem = await response.json();
        setGroupedProblems((prevGrouped) => {
          return {
            ...prevGrouped,
            [topic]: prevGrouped[topic].map((problem) =>
              problem._id === problemId ? updatedProblem : problem
            ),
          };
        });
      } else {
        console.error('Failed to update problem status');
      }
    } catch (error) {
      console.error('Error updating problem status:', error);
    }
  };

  return (
    <div className="flex-1 p-4 bg-gray-900 text-white">
      {/* Render each topic section */}
      {Object.keys(groupedProblems).map((topic) => (
        <div key={topic} className="mb-4">
          {/* Topic Header */}
          <div
            className="flex justify-between mb-2 cursor-pointer"
            onClick={() => toggleTopic(topic)}
          >
            <div className="text-lg">{topic}</div>
            <div>{isExpanded[topic] ? '▲' : '▼'}</div>
          </div>

          {/* Problem List (Only shown if the topic is expanded) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded[topic] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
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
                  <React.Fragment key={item._id || index}> {/* Use a unique key for each item */}
                    <tr className="bg-gray-800 hover:bg-gray-700 cursor-pointer">
                      <td className="p-3">
                        {/* Checkbox with explicit styling */}
                        <input
                          type="checkbox"
                          checked={item.status} // Reflect the current status (checked or unchecked)
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