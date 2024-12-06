import React from 'react'
import Problems from '../components/Problems'
import Arrays from '../components/Arrays'
import BinarySearch from '../components/BinarySearch'
import Greedy from '../components/Greedy'
import DynamicProgramming from '../components/DynamicProgramming'

function Practice() {
  return (
    <div className='text-white bg-green-500 justify-center '>
      Practice Page
      <div>
        <Problems/>
      </div>
    </div>
  )
}

export default Practice