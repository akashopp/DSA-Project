import {BrowserRouter as Router ,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
import Submit from "./pages/Submit";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
 

  return (
    <>
      <Router>
        <Navbar userId=""/>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      </Routes>
      </Router>
    </>
  )
}

export default App