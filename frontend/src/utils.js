// ProblemManager class to handle grouping and sorting by difficulty
export class ProblemManager {
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

// Fetch problems from the API
export const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:5000/problems', {
        method: "GET", 
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
};

// Fetch user problems
export const fetchUserProblems = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/getproblems/${userId}`, {
        method: "GET", 
        credentials: "include",
      });
    //   console.log('response of user problems : ', await response.json());
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
};