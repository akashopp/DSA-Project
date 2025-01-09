import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState(0);
  const [password, setPassword] = useState("");
  const [userId, setuserId] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const addUser = { name, userId, email, phoneNumber, password };
    console.log(addUser)

    const response = await fetch("http://localhost:5000/user/register", {
      method: "POST",
      body: JSON.stringify(addUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    const result = await response.json();
    
    if (!response.ok) {
      if(result.message == "User aldready exist") {
        alert("User Aldready exists");
      }
    }
    
    if (response.ok) {
      
      console.log(result);
      setName("");
      setEmail("");
      setphoneNumber("");
      setPassword("");
      setuserId("");

      alert("Registered Successfully");
        navigate("/login");

    }
  };


  return (
    <>
        <form 
        // onSubmit={handleSubmit}
        >
        <div className="mx-96 border-white border-2 p-4 my-3">


          <div className="mb-4">
            <label htmlFor="name" className="block text-white text-xl">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) =>
                
                setName(
                  e.target.value  
                )

              }
              className="text-black text-xl w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your name"
              required
            />
            </div>

            <div className="mb-4">
            <label htmlFor="name" className="block text-white text-xl">
              User Id
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) =>
                
                setuserId(
                  e.target.value  
                )

              }
              className="text-black text-xl w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter User Id"
              required
            />
            </div>


      <div className="mb-4">
            <label htmlFor="email" className="block text-white text-xl">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring text-black text-xl"
              placeholder="Enter your email"
              required
            />
          </div>


          <div className="mb-4">
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


          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-white text-xl">
              Phone number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring text-black text-xl"
              placeholder="Enter your phone number"
              required
            />
          </div>

        <div className="flex justify-center items-center bg-[rgb(57, 57, 57)]">
      <div className=" bg-[rgb(57, 57, 57)] rounded shadow-md text-white">
        {/* <h2 className="text-2xl font-bold mb-6 text-center">Register</h2> */}

        <div className="mb-3 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
          {/* </div> */}
{/* 
          

          

          


          
          */
          
          }
        </form>
    {/* <Navbar isLogged={false}/>
    
    
   


    <Footer/> */}
    </>
  );
};

export default Register;