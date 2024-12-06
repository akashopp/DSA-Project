import React from 'react'
import Courses from "./Courses";
function Home() {
  return (
    <div>
     <div><h1>Neetcode</h1>
      <p>A better way to prepare <br />
       for coding interviews</p>
      <button>Checkout</button>
     </div>
     <div>
          <Courses />
     </div>
    </div> 
  )
}

export default Home