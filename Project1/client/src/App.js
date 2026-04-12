//App.js 

import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";

function App(){
  const isAuthenticated = !!localStorage.getItem("token");

  return(
    <Router>
      <Routes>

        <Route path="/login" element={!isAuthenticated ? <Login />: <Navigate to ="/dashboard"/>}/>
        <Route path="/register" element={!isAuthenticated ? <Register />: <Navigate to = "/dashboard"/>}/>
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard />: <Navigate to ="login"/>}/>
        <Route path = "/create-project" element={isAuthenticated ? <CreateProject />: <Navigate to ="/login"/>}/>
        <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetail/>: <Navigate to="/login"/>}/>
        <Route path ="/" element={<Navigate to ="/login"/>}/>

      </Routes>

    </Router>
  );
}

export default App;
