import React, { useEffect, useState } from 'react';
import logo from "../assets/logo.png";
import { CiLight } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { RocketIcon } from './RocketIcon';

function Navbar(props) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userSession"); // Check for user session
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update isLoggedIn state when userId changes
  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userId]);

  // Logout function
  const handleLogout = async () => {
    try {
      // Send a logout request to the server
      const response = await fetch("http://localhost:5000/user/logout", {
        method: "POST", // Or "GET" depending on your backend setup
        headers: {
          "Content-Type": "application/json",
          // Include any authorization headers or cookies if necessary
        },
        credentials: "include",
      });
  
      const result = await response.json();
      
      if (result.success) {
        // If the logout was successful, proceed with frontend actions
        localStorage.removeItem("userSession"); // Remove the session from localStorage
        setIsLoggedIn(false); // Update the state to reflect logout
        navigate('/'); // Redirect to the homepage or any other route
      } else {
        // Handle any errors that occur during the logout process
        console.log("Logout failed:", result.message);
      }
    } catch (error) {
      console.log("Error during logout:", error);
      // Handle errors (e.g., network issues)
    }
  };

  return (
    <>
      <div className='flex justify-between bg-[#404040] p-2'>
        <div className="flex items-center space-x-8">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <RocketIcon className="w-8 h-8 text-white" />
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            <Link to="/courses" className="hover:text-gray-300 transition-colors text-white font-extrabold">
              Courses
            </Link>
            <Link to="/practice" className="hover:text-gray-300 transition-colors text-white font-extrabold">
              Practice
            </Link>
            <Link to="/submit" className="hover:text-gray-300 transition-colors text-white font-extrabold">
              Submit
            </Link>
          </div>
        </div>

        {/* Middle section */}
        <div className='text-white font-extrabold text-4xl mr-40'>
          LearnDSA
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-md transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-md transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;