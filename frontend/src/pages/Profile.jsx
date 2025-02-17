import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProblems, fetchUserProblems, ProblemManager } from '../utils'; // Assuming these are in the utils file
import { toast } from 'react-toastify';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProblems, setGroupedProblems] = useState({});
  const [groupedUserSolvedProblems, setGroupedUserSolvedProblems] = useState({});
  const navigate = useNavigate();

  const userId = localStorage.getItem('userSession'); // Get user ID from localStorage

  // Redirect if user is not logged in
  useEffect(() => {
    if (!userId) {
      toast.warn('You are not logged in. Please log in to access your profile.', {
        position: 'top-center',
        autoClose: 5000,
        onClose: () => navigate('/login'), // Redirect to login page
      });
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/user/getuser/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problems = await fetchProblems();
        const grouped = ProblemManager.groupByTopic(problems);
        setGroupedProblems(grouped);

        const userSolvedData = await fetchUserProblems(userId);
        const userSolvedIds = Array.isArray(userSolvedData) ? userSolvedData : userSolvedData.problems || [];
        const userSolvedProblems = problems.filter((problem) => userSolvedIds.includes(problem._id));
        setGroupedUserSolvedProblems(ProblemManager.groupByTopic(userSolvedProblems));
      } catch (error) {
        console.error('Error fetching problems or user solved problems:', error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Prevent rendering profile content if userId is null
  if (!userId) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <span className="text-xl text-white">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <span className="text-xl text-red-500">Error: {error}</span>
      </div>
    );
  }

  // Progress computation logic
  const progressByTopic = Object.keys(groupedProblems).map((topic) => {
    const total = groupedProblems[topic]?.length || 0;
    const solved = groupedUserSolvedProblems[topic]?.length || 0;
    const percentage = (solved / total) * 100;

    return { topic, solved, total, percentage };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-green-500 mb-6">Profile</h2>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <div className="mb-4 text-white">
          <p className="text-xl font-semibold"><strong>Name:</strong> {userData?.name}</p>
          <p className="text-xl font-semibold"><strong>User ID:</strong> {userData?.userId}</p>
          <p className="text-xl font-semibold"><strong>Email:</strong> {userData?.email}</p>
          <p className="text-xl font-semibold"><strong>Phone Number:</strong> {userData?.phoneNumber}</p>
          <p className="text-xl font-semibold"><strong>Joined:</strong> {new Date(userData?.createdAt).toLocaleDateString()}</p>
          <p className="text-xl font-semibold"><strong>Last Updated:</strong> {new Date(userData?.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Progress by Topic */}
      <h3 className="text-2xl font-extrabold text-red-500 mb-4">Progress by Topic</h3>
      <div className="space-y-4">
        {progressByTopic.map(({ topic, solved, total, percentage }) => (
          <div key={topic}>
            <p className="text-gray-300">
              {topic}: {solved}/{total} solved
            </p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;