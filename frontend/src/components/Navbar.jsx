import React from 'react'
import logo from "../assets/logo.png"
import { CiLight } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { RocketIcon } from './RocketIcon';

import { Outlet, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate=useNavigate();
  return (
    <>

    {/* <nav className='w-full h-14 pt-0 flex justify-center flex-row  bg-gray-700 text-white pt-3px pb-3px space-x-4'>
        <div className=' flex flex-row gap-2 items-center justify-center'>
        <img className='object-scale-down h-10 w-10 pl-2' src={logo} alt="logo" />
        <a onClick={()=>navigate('/courses')} className='h-auto w-auto pl-1 pr-1 rounded-xl hover:bg-black items-center' href="">Courses</a>
        <a onClick={()=>navigate('/practice')} className=' h-auto w-auto pl-1 pr-1 rounded-xl hover:bg-black' href="">Practice</a>
        <a onClick={()=>navigate('/roadmap')} className='h-auto w-auto pl-1 pr-1 rounded-xl hover:bg-black ' href="">Roadmap</a>
       </div>
        <div className='w-full flex flex-row items-center justify-center space-x-10 pl-[20%]'>
            <span className='pt-1 pb-1 pl-1 pr-1 rounded-lg bg-blue-500 cursor-pointer hover:bg-white hover:text-black items-center'>Pro</span>
            <CiLight className='h-auto w-auto hover:cursor-pointer ' /> 
           <button className='bg-green-600 pt-1 pb-1 pl-1 pr-1 hover:bg-white hover:text-black items-center'>Sign in</button>
          <div>{<Outlet />}</div>
        </div>
       
    </nav> */}



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
        <button className="hover:text-gray-300 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <Link 
          to="/signin" 
          className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-md transition-colors"
        >
          Sign in
        </Link>
      </div>
      </div>


    </>
  )
}

export default Navbar