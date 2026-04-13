import { useState, useEffect } from "react";
import { useNavigate, Link, useParams} from "react-router-dom";
import api from "../services/api";

const ProjectDetail = () =>{

    //Initialize variables
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [milestoneTitle, setMilestoneTitle] = useState("");
    const [milestoneDescription, setMilestoneDescription] = useState("");
    const [addingMilestone, setAddingMilestone] = useState(false);

    //Fetch project data
    useEffect(() =>{


    const fetchProject = async () =>{
        try{
            const response = await api.get(`/projects/${id}`);
            setProject(response.data.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load project");
        }finally{
            setLoading(false);
        }
    };

    fetchProject();

    }, 
    [id]);


    //Adding a milestone
    const handleMilestone = async (e) =>{
        e.preventDefault();

        if (!milestoneTitle.trim()){
            setError("Milestone requires a title");
            return;
        }

        setAddingMilestone(true);

        try{
            const response = await api.post(`/projects/${id}/edit/milestones`, {
                title: milestoneTitle.trim(),
                description: milestoneDescription.trim()
            });

            setProject(response.data.data);
            setMilestoneTitle("");
            setMilestoneDescription("");
        }catch (error){
            setError(error.response?.data?.message || "failed to add milestone");
        }finally{
            setAddingMilestone(false);
        }
    };

    //mark project as complete
    const handleCompleteProject = async () =>{

        if (window.confirm("Mark this project as completed?")){

            try{
                const response = await api.patch(`/projects/${id}/edit/complete`);
                setProject(response.data.data);
            }catch(error){
                setError(error.response?.data?.message || "Failed to mark project as complete");
            }

        }

    };

    const handleDeleteProject = async () =>{
        if (window.confirm("Are you sure you want to delete this project?")){

            try{
                const response = await api.delete(`/projects/${id}/delete`);
                navigate("/dashboard");
            }catch(error){
                setError(error.response?.data?.message || 'Failed to delete project');
            }


        }

        
    };

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !project){
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error || "Project not found"}</div>
                    <Link to="/dashboard" className="text-primary hover:underline">
                            Back to Dashboard
                    </Link>
                </div>
            </div>
        );

    }

    //verify if the user owns the project

    const isOwner = project.owner?._id === localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : false;

    return (
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
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Project Header */}
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">{project.title}</h1>
                        <p className="text-gray-400">
                            By {project.owner?.username || "Unknown"} • Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {project.status !== "completed" && isOwner && (
                            <button
                                onClick={handleCompleteProject}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Mark Complete
                            </button>
                        )}
                        {isOwner && (
                            <button
                                onClick={handleDeleteProject}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Stage Badge */}
                <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        project.status === "completed" 
                        ? "bg-green-600" 
                        : "bg-blue-600"
                        } text-white`}>
                        {project.status === "completed" ? "✅ Completed" : project.stage}
                    </span>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-secondary mb-2">Description</h2>
                    <p className="text-gray-400 whitespace-pre-wrap">{project.description}</p>
                </div>

                {/* Support Needed */}
                {project.supportRequired?.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-secondary mb-2">Support Needed</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.supportRequired.map((item) => (
                                <span key={item} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        {/* Milestones Section */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-primary mb-4">Milestones</h2>
          
            {/* Add Milestone Form */}
            {project.status !== "completed" && isOwner && (
                <form onSubmit={handleMilestone} className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-secondary mb-3">Add New Milestone</h3>
                    <input
                        type="text"
                        value={milestoneTitle}
                        onChange={(e) => setMilestoneTitle(e.target.value)}
                        placeholder="Milestone title (e.g., MVP Launched)"
                        className="w-full px-4 py-2 bg-gray-700 text-secondary rounded-lg border border-gray-600 focus:outline-none focus:border-primary mb-3"
                        required
                    />
                    <textarea
                        value={milestoneDescription}
                        onChange={(e) => setMilestoneDescription(e.target.value)}
                        placeholder="What did you achieve?"
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-700 text-secondary rounded-lg border border-gray-600 focus:outline-none focus:border-primary mb-3"
                    />
                    <button
                        type="submit"
                        disabled={addingMilestone}
                        className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                    >
                        {addingMilestone ? "Adding..." : "Add Milestone"}
                    </button>
                </form>
            )}

            {/* Milestones List */}
            {project.milestones?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No milestones yet. Start celebrating your progress!</p>
                ) : (
                <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                        <div key={milestone._id || index} className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <h3 className="text-lg font-semibold text-secondary">{milestone.title}</h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(milestone.completedAt).toLocaleDateString()}
                                </span>
                            </div>
                                {milestone.description && (
                                    <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                                )}
                        </div>
                    ))}
                </div>
                )}
                </div>

            {/* Error Message */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg">
                    {error}
                </div>
            )}
        </main>
        </div>
    );




    


};

export default ProjectDetail;