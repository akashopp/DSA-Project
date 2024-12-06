import React from 'react'
import logo from "../assets/logo.png"
import { CiLight } from "react-icons/ci";
import { Outlet, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate=useNavigate();
  return (
    <nav className='w-full h-14 pt-0 flex justify-center flex-row  bg-gray-700 text-white pt-3px pb-3px space-x-4'>
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
       
    </nav>
  )
}

export default Navbar