import { useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../services/api";

const CelebrationWall = () =>{

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect( () => {

        const fetchCompletedProjects = async () =>{

            try{
                const response = await api.get("/projects/celebrations");
                setProjects(response.data.data || []);
            }catch(error){
                setError(error.response?.data?.message || "Failed to load celebration wall");
            }finally{
                setLoading(false);
            }
        }

        fetchCompletedProjects();

    }, []);

    if (loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-primary text-xl">Loading celebrations...</div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-dark">

            {/* Header */}
            <header className="bg-gray-900 shadow-lg border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-primary">
                        MzansiBuilds
                    </Link>
                    <Link to="/dashboard" className="text-gray-400 hover:text-white transition">
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h1 className="text-4xl font-bold text-primary mb-2">Celebration Wall</h1>
                    <p className="text-gray-400 text-lg">
                        Honoring developers who built in public and completed their projects
                    </p>
                </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
                    <p className="text-gray-400 text-lg">
                        No completed projects yet.
                    </p>
                    <p className="text-gray-500 mt-2">
                        Be the first to complete a project and get featured here! 🚀
                    </p>
                    <Link
                        to="/create-project"
                        className="inline-block mt-6 bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        Start a Project
                    </Link>
                </div>
                ) : (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project._id}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 border border-gray-700"
                        >

                        {/* Trophy Icon for top 3 */}
                            <div className="relative">
                            {index === 0 && (
                                <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-3 py-1 rounded-bl-lg font-bold text-sm">
                                    🥇 #1
                                </div>
                            )}
                            {index === 1 && (
                                <div className="absolute top-0 right-0 bg-gray-400 text-gray-900 px-3 py-1 rounded-bl-lg font-bold text-sm">
                                    🥈 #2
                                </div>
                            )}
                            {index === 2 && (
                                <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                                    🥉 #3
                                </div>
                            )}
                                <div className="p-6">
                                    <div className="text-4xl mb-3">🎉</div>
                            <h3 className="text-xl font-bold text-primary mb-2">
                                {project.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-500 flex items-center gap-1">
                                    ✅ Completed
                                </span>
                                <span className="text-gray-500">
                                    {new Date(project.completedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <p className="text-xs text-gray-500">
                                    By: {project.owner?.username || "Anonymous"}
                                 </p>
                                {project.milestones?.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        🏅 {project.milestones.length} milestones achieved
                                    </p>
                                )}
                        </div>
                        <Link
                            to={`/projects/${project._id}`}
                            className="inline-block w-full text-center mt-4 bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition text-sm"
                        >
                            View Project Details
                        </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );



};

export default CelebrationWall;