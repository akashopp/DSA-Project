import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Recommendation from './Recommendation';

function Home(props) {
    useEffect(() => {
      // console.log(props.userId)
    }, [])
  const navigate=useNavigate();
  
  return (
    <>
      <div className='flex'>
      
        <div className='text-white font-extrabold text-4xl mx-36 my-10 flex justify-center flex-col'>
          Data Structures &
          <br></br> Algorithms

          <div className='text-lg font-light mt-2'>Follow a structured path to learn all of the core data structures & algorithms. Perfect for coding preparation.</div>
        </div>

        <div className="flex justify-evenly items-center h-5/6 mt-24">
    

          <div className='border-4 h-auto w-1/3 p-3 duration-500 ease-in-out rounded-2xl hover:scale-110 hover:translate-y-4'>

            <img src="https://imagedelivery.net/CLfkmk9Wzy8_9HRyug4EVA/a65736b6-151f-4572-8e10-87b2b75ab100/public" alt="" className='rounded-2xl'/>

            <div className='font-semibold flex justify-center p-1 text-[20px] text-white'>
              Practice Data Structures & Algorithms</div>

            <div className='font-light flex justify-center text-white text-sm p-1'>Practice from the best ProblemSet for Data Structures and Algorithms.</div>

            <div className='flex justify-center'>

              <button className='bg-red-500 font-bold p-2 rounded-xl hover:bg-red-700 mt-4' onClick={()=>navigate('/practice')}> Practice</button>

            </div>

          </div>

          <div className='border-4 h-auto w-1/3 p-3 duration-500 ease-in-out rounded-2xl hover:scale-110 hover:translate-y-4'>

            <img src="https://media.istockphoto.com/id/1320033559/vector/pensive-man-standing-and-making-business-decision-isolated-flat-vector-illustration-cartoon.jpg?s=612x612&w=0&k=20&c=CwX0Ryk_gJVFXcsIHTsMjZX4jRMt4L0CrMPnDjXHlPo=" alt="" className='rounded-2xl' />

            <div className='font-semibold flex justify-center p-1 text-[20px] text-white'>
              Have a doubt?</div>

            <div className='font-light flex justify-center text-white text-sm p-1'>Ask a question in our discuss section!</div>

            <div className='flex justify-center'>
              <button className='bg-green-500 font-bold p-2 rounded-xl hover:bg-green-700' onClick={()=>navigate('/discuss')}>Discuss</button>

            </div>

          </div>      

        </div>

      </div>
    </>
  )
}

export default Home
