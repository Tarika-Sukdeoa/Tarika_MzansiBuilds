import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../services/api";

const CreateProject = () =>{

    //Initializing page variables
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //Initializing form variables
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stage, setStage] = useState("Ideation");
    const [supportRequired, setSupportRequired] = useState([]);

    //Possible options
    const stages = ["Ideation", "MVP", "Development", "Testing", "Launch", "Post-Launch"];
    const supportOptions = ["Backend", "Frontend", "UI/UX", "Testing", "DevOps", "Marketing", "Documentation"];

    //Manages support section
    const handleSupportToggle = (option) =>{
        if (supportRequired.includes(option)){
            setSupportRequired(supportRequired.filter(item => item !== option));

        }else{
            setSupportRequired([...supportRequired, option]);
        }
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");
        setLoading(true);
        

        if (!title.trim()){
            setError("Project title is required");
            setLoading(false);
            return;
        }

        if(!description.trim()){
            setError("Decsription is required");
            setLoading(false);
            return;
        }

        try{
            const response = await api.post("/projects", {
                title: title.trim(),
                description: description.trim(),
                stage,
                supportRequired
            });

            navigate("/dashboard");
        }catch(error){
            setError(error.response?.data?.message || 'Failed to create project. Please try again.');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark">

            {/* Header */}
            <header className="bg-gray-900 shadow-lg border-b border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="text-2xl font-bold text-primary">
                    MzansiBuilds
                </Link>
                <Link
                    to="/dashboard"
                    className="text-gray-400 hover:text-white transition"
                >
                    Back to Dashboard
                </Link>
            </div>
      </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Create New Project</h1>
                    <p className="text-gray-400">
                        Share what you're building with the community
                    </p>
            </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div>
                    <label className="block text-secondary mb-2 font-medium">
                    Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                        placeholder="e.g., AI-Powered Task Manager"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-secondary mb-2 font-medium">
                    Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                        placeholder="What are you building? What problem does it solve?"
                        required
                    />
                    <p className="text-gray-500 text-xs mt-1">
                        {description.length}/1000 characters
                    </p>
                 </div>

                {/* Project Stage */}
                <div>
                    <label className="block text-secondary mb-2 font-medium">
                        Current Stage
                    </label>
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                    >
                        {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <p className="text-gray-500 text-xs mt-1">
                    Select the current phase of your project
                    </p>
                </div>

                {/* Support Required */}
                <div>
                    <label className="block text-secondary mb-2 font-medium">
                        Support Needed (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {supportOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSupportToggle(option)}
                                className={`px-3 py-1 rounded-full text-sm transition ${
                                supportRequired.includes(option)
                                ? "bg-primary text-dark font-medium"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                }`}
                            >
                                {option}
                            </button>
                        ))}

                    </div>

                    <p className="text-gray-500 text-xs mt-1">
                        Select what help you need from collaborators
                    </p>
                </div>

                {/* Selected Support Tags */}
                {supportRequired.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-400 mb-2">You need help with:</p>
                        <div className="flex flex-wrap gap-2">
                        {supportRequired.map((item) => (
                        <span key={item} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {item}
                        </span>
                        ))}
                    </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? "Creating Project..." : "Create Project"}
            </button>
          </form>
        </div>
      </main>
    </div>
        
    );
};

export default CreateProject;