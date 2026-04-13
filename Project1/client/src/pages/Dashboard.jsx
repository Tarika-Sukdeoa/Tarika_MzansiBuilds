//dashboard.jsx

import {useEffect, useState, useCallback} from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../services/api";


const Dashboard = () =>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [error, setError] = useState(null);

    //get the projects
    const fetchProjects = useCallback(async () =>{
      setLoading(true);
      setError(null);
        try{
            let projectResponse;
        

            if (activeTab === "all"){
                projectResponse = await api.get("/projects/my/projects");
            }else if (activeTab === "active"){
                projectResponse = await api.get("/projects/my/projects/active");
            }else{
                projectResponse = await api.get("/projects/my/projects/completed");
            }

            setProjects(projectResponse.data.data || []);

            const statsReponse = await api.get("/projects/my/stats");
            setStats(statsReponse.data.data);
        }catch(error){
            console.error("Failed to fetch data:", error);

            if(error.response?.status === 401){
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        }finally{
            setLoading(false);
        }
    
    }, [activeTab, navigate]);

    useEffect(() => {

        //verify that the user is logged in
        const token = localStorage.getItem("token");

        if (!token){
            navigate("/login");
            return;
        }

        //User data from local storage
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }

        fetchProjects();
    }, [navigate, activeTab, fetchProjects]);


    

    //Logout
    const handleLogout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    const handleRetry = () =>{
      fetchProjects();
    };

    const handleDeleteProject = async (projectId) =>{
        if (window.confirm("Are you sure that you want to delete this project?")){
            try{
                await api.delete(`/projects/${projectId}/delete`);
                fetchProjects(); //refresh
            }catch(error){
                console.error("failed to delete project: ", error);
                alert("Failed to delete project please try again");
            }
        }
    };

    if (error && !loading){
      return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center bg-gray-900 p-8 rounded-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-400 mb-4">Could not load your dashboard.</p>
          <button
              onClick={handleRetry}
            className="bg-primary text-dark px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Try Again
          </button>
          <button
            onClick={handleLogout}
            className="ml-3 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
        
      

    }

    if(loading){
         return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <header className="bg-gray-900 shadow-lg border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">MzansiBuilds</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-secondary">Welcome, {user?.username}!</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                        Logout
                        </button>
                    </div>
                 </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
            {/* Stats Cards */}
            {stats && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-primary">{stats.totalProjects}</div>
                        <div className="text-gray-400 mt-1">Total Projects</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                        <div className="text-3xl font-bold text-yellow-500">{stats.inProgressProjects}</div>
                        <div className="text-gray-400 mt-1">In Progress</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                        <div className="text-3xl font-bold text-green-500">{stats.completedProjects}</div>
                        <div className="text-gray-400 mt-1">Completed</div>
                    </div>
                </div>
        )}

        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "all"
                  ? "bg-primary text-dark font-semibold"
                  : "bg-gray-800 text-secondary hover:bg-gray-700"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "active"
                  ? "bg-primary text-dark font-semibold"
                  : "bg-gray-800 text-secondary hover:bg-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "completed"
                  ? "bg-primary text-dark font-semibold"
                  : "bg-gray-800 text-secondary hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
          <Link
            to="/create-project"
            className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            + New Project
          </Link>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400 mb-4">
              {activeTab === "all"
                ? "You haven't created any projects yet."
                : activeTab === "active"
                ? "You don't have any active projects."
                : "You haven't completed any projects yet."}
            </p>
            <Link
              to="/create-project"
              className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition inline-block"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-primary transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-primary">{project.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.status === "completed"
                        ? "bg-green-600"
                        : "bg-blue-600"
                    } text-white`}
                  >
                    {project.stage}
                  </span>
                </div>
                <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                {/* Milestones Preview */}
                {project.milestones && project.milestones.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Latest milestone:
                    </p>
                    <p className="text-sm text-secondary">
                      ✓ {project.milestones[project.milestones.length - 1]?.title}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    View Details →
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-red-500 hover:text-red-400 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );

};

export default Dashboard;

    

