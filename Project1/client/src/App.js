//App.js 

import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import CelebrationWall from "./pages/CelebrationWall";

function App(){
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));


  useEffect(() => {

    const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    };

    //Listens for storage changes
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);

  }, []);
  

  return(
    <Router>
      <Routes>

        <Route path="/login" element={!isAuthenticated ? <Login />: <Navigate to ="/dashboard"/>}/>
        <Route path="/register" element={!isAuthenticated ? <Register />: <Navigate to = "/dashboard"/>}/>
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard />: <Navigate to ="/login"/>}/>
        <Route path = "/create-project" element={isAuthenticated ? <CreateProject />: <Navigate to ="/login"/>}/>
        <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetail/>: <Navigate to="/login"/>}/>
        <Route path ="/" element={<Navigate to ="/login"/>}/>
        <Route path = "/celebration-wall" element ={<CelebrationWall/>}/>

      </Routes>

    </Router>
  );
}

export default App;
