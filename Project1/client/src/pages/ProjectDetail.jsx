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

    // Comment state
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);

    // Collaboration state
    const [showCollaborationForm, setShowCollaborationForm] = useState(false);
    const [collaborationMessage, setCollaborationMessage] = useState("");
    const [collaborationRequests, setCollaborationRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [requesting, setRequesting] = useState(false);

    //Initialize variables for the ditting form
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription]= useState("");
    const [editStage, setEditStage] = useState("");
    const [editSupportRequired, setEditSupportRequired] = useState([]);
    const [updating, setUpdating] = useState(false);


    const [milestoneTitle, setMilestoneTitle] = useState("");
    const [milestoneDescription, setMilestoneDescription] = useState("");
    const [addingMilestone, setAddingMilestone] = useState(false);
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);

    // User info - define these FIRST
    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
    const fetchCollaborationRequests = async () => {
        try {
            const response = await api.get(`/projects/${id}/collaborate/requests`);
            setCollaborationRequests(response.data.data);
        } catch (error) {
        console.error("Failed to fetch requests:", error);
    }
};
    //Fetch project data
    useEffect(() =>{


    const fetchProject = async () =>{
        

        try{

            const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
      setEditTitle(response.data.data.title);
      setEditDescription(response.data.data.description);
      setEditStage(response.data.data.stage);
      setEditSupportRequired(response.data.data.supportRequired || []);

        }catch(error){
            setError(error.response?.data?.message || "Failed to load project");
        }finally{
            setLoading(false);
        }
    };

    fetchProject();

    }, 
    [id]);

    

    // Fetch collaboration requests when project loads and user is owner
    useEffect(() => {
        if (project && project.owner?._id === currentUserId && project.status !== "completed") {
        fetchCollaborationRequests();
        }
    }, [project, currentUserId]);

    useEffect(() =>{
      if(project){
        fetchComments();
      }
    }, [project]);


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

    const handleEditSupportToggle = (option) =>{

        if (editSupportRequired.includes(option)) {
            setEditSupportRequired(editSupportRequired.filter(item => item !== option));
        

        }else{
            setEditSupportRequired([...editSupportRequired, option]);
        }
    };

    const handleUpdateProject = async (e) =>{
        e.preventDefault();
        setUpdating(true);
        setError("");
        setSuccess("");

        try{
            await api.patch(`/projects/${id}/edit/stage`, {stage: editStage});

            const response = await api.get(`/projects/${id}`);
            setProject(response.data.data);

            setSuccess("Project updates successfully");
            setShowEditForm(false);
        }catch(error){
            setError(error.response?.data?.message || "Failed to update project");
        }finally{
            setUpdating(false);
        }
    }

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


    const isCollaborator = project?.collaborators?.some(
        collab => collab._id === currentUserId
    );

    


// Request to collaborate
const handleRequestCollaboration = async (e) => {
  e.preventDefault();
  setRequesting(true);
  try {
    await api.post(`/projects/${id}/collaborate/request`, {
      message: collaborationMessage
    });
    setSuccess("Collaboration request sent!");
    setShowCollaborationForm(false);
    setCollaborationMessage("");
  } catch (error) {
    setError(error.response?.data?.message || "Failed to send request");
  } finally {
    setRequesting(false);
  }
};



// Accept request
const handleAcceptRequest = async (requestId) => {
  try {
    await api.post(`/projects/${id}/collaborate/requests/${requestId}/accept`);
    setSuccess("Collaborator added!");
    fetchCollaborationRequests();
    // Refresh project to show updated collaborators
    const response = await api.get(`/projects/${id}`);
    setProject(response.data.data);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to accept request");
  }
};

// Reject request
const handleRejectRequest = async (requestId) => {
  try {
    await api.post(`/projects/${id}/collaborate/requests/${requestId}/reject`);
    setSuccess("Request rejected");
    fetchCollaborationRequests();
  } catch (error) {
    setError(error.response?.data?.message || "Failed to reject request");
  }
};

// Fetch comments for this project
const fetchComments = async () => {
    setLoadingComments(true);
    try {
        const response = await api.get(`/projects/${id}/comments`);
        setComments(response.data.data || []);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
    } finally {
        setLoadingComments(false);
    }
};

// Add a new comment
const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
        setError("Comment cannot be empty");
        return;
    }
    
    try {
        const response = await api.post(`/projects/${id}/comments`, {
            body: newComment.trim()
        });
        setComments([response.data.data, ...comments]);
        setNewComment("");
        setSuccess("Comment added!");
        setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
        setError(error.response?.data?.message || "Failed to add comment");
    }
};

// Start editing a comment
const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.body);
};

// Cancel editing
const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
};

// Save edited comment
const saveEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
        setError("Comment cannot be empty");
        return;
    }
    
    try {
        const response = await api.put(`/projects/${id}/comments/${commentId}`, {
            body: editingCommentText.trim()
        });
        setComments(comments.map(comment => 
            comment._id === commentId ? response.data.data : comment
        ));
        setEditingCommentId(null);
        setEditingCommentText("");
        setSuccess("Comment updated!");
        setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
        setError(error.response?.data?.message || "Failed to update comment");
    }
};

// Delete a comment
const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
        try {
            await api.delete(`/projects/${id}/comments/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
            setSuccess("Comment deleted!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete comment");
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
    
    
   
    const ownerId = project?.owner?._id || project?.owner;
    const isOwner = currentUserId && ownerId && currentUserId === ownerId;

    //const isOwner = project.owner?._id === localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : false;
    

    //Debug code
    console.log("isOwner:", isOwner);
    console.log("Project owner ID:", project.owner?._id);
    console.log("Current user ID:", localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : "no user");

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
        {/* Success Message */}
        {success && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Project Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{project.title}</h1>
              <p className="text-gray-400">
                By {project.owner?.username || "Unknown"} • Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.status !== "completed" && isOwner && (
                <>
                  <button
                    onClick={() => setShowEditForm(!showEditForm)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                  >
                    ✏️ Edit Project
                  </button>
                  <button
                    onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    + Add Milestone
                  </button>
                  <button
                    onClick={handleCompleteProject}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    ✅ Mark Complete
                  </button>
                </>
              )}
              {isOwner && (
                <button
                  onClick={handleDeleteProject}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>

          {/* Stage Badge */}
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              project.status === "completed" ? "bg-green-600" : "bg-blue-600"
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

        {/* Edit Project Form */}
        {showEditForm && isOwner && project.status !== "completed" && (
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Edit Project</h2>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Stage</label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                >
                  {["Ideation", "MVP", "Development", "Testing", "Launch", "Post-Launch"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-secondary mb-2">Support Needed</label>
                <div className="flex flex-wrap gap-2">
                  {["Backend", "Frontend", "UI/UX", "Testing", "DevOps", "Marketing", "Documentation"].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleEditSupportToggle(option)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        editSupportRequired.includes(option) ? "bg-primary text-dark" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Milestone Form */}
        {showMilestoneForm && isOwner && project.status !== "completed" && (
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Add Milestone</h2>
            <form onSubmit={handleMilestone} className="space-y-4">
              <div>
                <label className="block text-secondary mb-2">Milestone Title *</label>
                <input
                  type="text"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g., MVP Launched"
                  className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Description (Optional)</label>
                <textarea
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  placeholder="What did you achieve?"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={addingMilestone}
                  className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                >
                  {addingMilestone ? "Adding..." : "Add Milestone"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMilestoneForm(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Milestones Section */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-primary mb-4">Milestones</h2>
          {project.milestones?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No milestones yet. Click "Add Milestone" to celebrate your progress!</p>
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

        




{!isOwner && !isCollaborator && project.status !== "completed" && (
  <button
    onClick={() => setShowCollaborationForm(!showCollaborationForm)}
    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
  >
    🤝 Request to Collaborate
  </button>
)}

{isCollaborator && (
  <span className="bg-green-600 text-white px-4 py-2 rounded-lg">
    🤝 Collaborator
  </span>
)}

{/* Collaboration Requests Section (Owner Only) */}
{isOwner && collaborationRequests.length > 0 && (
  <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mt-6">
    <h2 className="text-2xl font-bold text-primary mb-4">Collaboration Requests</h2>
    <div className="space-y-4">
      {collaborationRequests.map((request) => (
        <div key={request._id} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-secondary font-semibold">
                {request.requester?.username || "Unknown User"}
              </p>
              {request.message && (
                <p className="text-gray-400 text-sm mt-1">"{request.message}"</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                Requested: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAcceptRequest(request._id)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleRejectRequest(request._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* Collaboration Request Form */}
{showCollaborationForm && !isOwner && !isCollaborator && (
  <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mb-6">
    <h2 className="text-2xl font-bold text-primary mb-4">Request to Collaborate</h2>
    <form onSubmit={handleRequestCollaboration} className="space-y-4">
      <div>
        <label className="block text-secondary mb-2">Message (Optional)</label>
        <textarea
          value={collaborationMessage}
          onChange={(e) => setCollaborationMessage(e.target.value)}
          placeholder="Tell the project owner why you want to collaborate..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={requesting}
          className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
        >
          {requesting ? "Sending..." : "Send Request"}
        </button>
        <button
          type="button"
          onClick={() => setShowCollaborationForm(false)}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

{/* Comments Section */}
<div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 border border-gray-800 mt-6">
    <h2 className="text-2xl font-bold text-primary mb-4">Comments</h2>
    
    {/* Add Comment Form */}
    <form onSubmit={handleAddComment} className="mb-6">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-800 text-secondary rounded-lg border border-gray-700 focus:outline-none focus:border-primary mb-3"
        />
        <button
            type="submit"
            className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
            Post Comment
        </button>
    </form>
    
    {/* Comments List */}
    {loadingComments ? (
        <p className="text-gray-500 text-center py-4">Loading comments...</p>
    ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
    ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-primary font-semibold">
                                {comment.commenter?.username || "Unknown User"}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {(comment.commenter?._id === currentUserId || isOwner) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditComment(comment)}
                                    className="text-yellow-500 hover:text-yellow-400 text-sm transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-red-500 hover:text-red-400 text-sm transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {editingCommentId === comment._id ? (
                        <div>
                            <textarea
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-secondary rounded-lg border border-gray-600 focus:outline-none focus:border-primary mb-2"
                                rows={2}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => saveEditComment(comment._id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEditComment}
                                    className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">{comment.body}</p>
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