import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
import Submit from "./pages/Submit";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from 'react-toastify';
import Problem from "./components/Problem";
import Recommendation from "./pages/Recommendation";

function App() {
  // Call validateSession when the component mounts
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to validate the session
  const validateSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies, auth tokens, etc.)
      });
      const data = await response.json();
      console.log("Session validated: ", data);
    } catch (err) {
      console.error('Error validating session: ', err);
      localStorage.removeItem("userSession");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* If userId is dynamic, you can pass it accordingly */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/playground" element={<Submit />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problem/:problemId" element={<Problem />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </Router>
      <div><ToastContainer></ToastContainer></div>
    </>
  );
}

export default App;