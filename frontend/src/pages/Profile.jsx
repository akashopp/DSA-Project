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
  const [activities, setActivities] = useState([]);
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
          const response = await fetch(`http://localhost:5000/user/getuser/${userId}`, {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include"
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          console.log('data : ', data);
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

        const userActivities = await fetch('http://localhost:5000/user/activities', {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
        setActivities(await userActivities.json());
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

  let grand_total = 0;
  // Progress computation logic
  const progressByTopic = Object.keys(groupedProblems).map((topic) => {
    const total = groupedProblems[topic]?.length || 0;
    const solved = groupedUserSolvedProblems[topic]?.length || 0;
    const percentage = (solved / total) * 100;
    grand_total += solved;
    return { topic, solved, total, percentage };
  });

  // Render activities
  const renderActivity = (activity) => {
    const { activityType, activityDescription, link, createdAt } = activity;
  
    // Map activity types to both background and text colors for better contrast
    const activityStyles = {
      solved: { bg: 'bg-green-600', text: 'text-white' },
      wrong_answer: { bg: 'bg-red-600', text: 'text-white' },
      compilation_error: { bg: 'bg-yellow-300', text: 'text-black' },
      replied: { bg: 'bg-blue-600', text: 'text-white' },
      asked_question: { bg: 'bg-purple-700', text: 'text-white' },
      mentioned: { bg: 'bg-pink-500', text: 'text-white' },
    };
  
    const { bg, text } = activityStyles[activityType] || {
      bg: 'bg-gray-600',
      text: 'text-white',
    };
  
    return (
      <div key={activity._id} className={`p-4 rounded-xl mb-4 ${bg} ${text}`}>
        <p className="font-semibold capitalize">{activityType.replace('_', ' ')}</p>
        <p className="opacity-90">{activityDescription}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            View Link
          </a>
        )}
        <p className="text-sm opacity-80">{new Date(createdAt).toLocaleDateString()}</p>
      </div>
    );
  };  

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
                className="bg-green-500 h-3 rounded-full transition-[width] duration-700 ease-in-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className='text-center text-2xl text-gray-300'>
          Total solved : {grand_total}
        </div>
      </div>

      {/* Activities */}
      <h3 className="text-2xl font-extrabold text-yellow-500 mb-4">Recent Activities</h3>
      <div>
        {activities.length === 0 ? (
          <p className="text-gray-300">No activities found.</p>
        ) : (
          activities.map(renderActivity)
        )}
      </div>
    </div>
  );
};

export default Profile;