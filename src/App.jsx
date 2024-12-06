import {BrowserRouter as Router ,Routes,Route} from "react-router-dom";
import Navbar from "./component/Navbar";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
function App() {
 

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
