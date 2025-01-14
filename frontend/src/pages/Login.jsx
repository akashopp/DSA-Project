import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setuserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const user = { userId, password };

  try {
    // Call loginUser endpoint
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      console.log(result);
      const id = result.user_id;
      console.log("Login successful, user ID:", id);

      // Save the session token (user ID) in localStorage
      localStorage.setItem("userSession", id);

      // Redirect to dashboard or another protected route
      navigate("/");
    } else {
      // If login failed, show the error message
      alert(result.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
};


  return (
    <>
      {/* Uncomment and include your Navbar and Footer components if needed */}
      {/* <Navbar isLogged={false} /> */}
      <div className="flex justify-center items-center h-screen bg-[rgb(57, 57, 57)]">
        <div className="w-full max-w-md p-8 bg-[rgb(57, 57, 57)] rounded text-white border-2 border-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userId" className="block text-white text-xl">
                UserId
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setuserId(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300 text-black text-xl"
                placeholder="Enter your User ID"
                required
              />
            </div>

            <div className="mb-4 text-white text-xl">
              <label htmlFor="password" className="block text-white text-xl">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring text-black text-xl"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-blue-500 hover:underline">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;