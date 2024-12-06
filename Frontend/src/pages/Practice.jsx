import React from 'react'
import Problems from '../component/Problems'
import Arrays from '../component/Arrays'
import BinarySearch from '../component/BinarySearch'
import Greedy from '../component/Greedy'
import DynamicProgramming from '../component/DynamicProgramming'

function Practice() {
  return (
    <div className='text-white bg-green-500 justify-center '>
      Practice Page
      <div>
        <Problems/>
        <Arrays/>
        <BinarySearch/>
        <Greedy/>
        <DynamicProgramming/>
      </div>
    </div>
  )
}

export default Practice