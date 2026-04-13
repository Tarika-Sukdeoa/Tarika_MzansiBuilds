// services/collaborationService.js
// SRP: Only handles collaboration business logic
// DIP: Depends on abstractions

const CollaborationRequestRepository = require("../repositories/collaborationRequestRepository");
const ProjectRepository = require("../repositories/projectRepository");
const AppError = require("../utils/AppError");

class CollaborationService {
  
  // Request to collaborate
  async requestCollaboration(projectId, userId, message) {
    // Get project to check ownership and collaborators
    const project = await ProjectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    
    // Check if user is owner
    if (project.owner._id.toString() === userId.toString()) {
      throw new AppError("You are the owner of this project", 400);
    }
    
    // Check if already a collaborator
    const isCollaborator = project.collaborators.some(
      collab => collab._id.toString() === userId.toString()
    );
    if (isCollaborator) {
      throw new AppError("You are already a collaborator", 400);
    }
    
    // Check if request already exists
    const existingRequest = await CollaborationRequestRepository.findPendingRequest(projectId, userId);
    if (existingRequest) {
      throw new AppError("You already have a pending request", 400);
    }
    
    const request = await CollaborationRequestRepository.create(projectId, userId, message);
    
    return request;
  }

  // Get collaboration requests (owner only)
  async getCollaborationRequests(projectId, userId) {
    // Verify the user is the project owner
    const project = await ProjectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    
    if (project.owner._id.toString() !== userId.toString()) {
      throw new AppError("Only the project owner can view requests", 403);
    }
    
    return await CollaborationRequestRepository.findPendingByProject(projectId);
  }

  // Accept collaboration request
  async acceptCollaboration(projectId, requestId, userId) {
    // Verify the user is the project owner
    const project = await ProjectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    
    if (project.owner._id.toString() !== userId.toString()) {
      throw new AppError("Only the project owner can accept requests", 403);
    }
    
    const request = await CollaborationRequestRepository.findById(requestId);
    if (!request) {
      throw new AppError("Request not found", 404);
    }
    
    if (request.status !== "pending") {
      throw new AppError("Request already processed", 400);
    }
    
    // Update request status
    await CollaborationRequestRepository.updateStatus(requestId, "accepted");
    
    // Add user as collaborator to the project
    await ProjectRepository.addCollaborator(projectId, request.requester);
    
    return request;
  }

  // Reject collaboration request
  async rejectCollaboration(projectId, requestId, userId) {
    // Verify the user is the project owner
    const project = await ProjectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    
    if (project.owner._id.toString() !== userId.toString()) {
      throw new AppError("Only the project owner can reject requests", 403);
    }
    
    const request = await CollaborationRequestRepository.findById(requestId);
    if (!request) {
      throw new AppError("Request not found", 404);
    }
    
    if (request.status !== "pending") {
      throw new AppError("Request already processed", 400);
    }
    
    await CollaborationRequestRepository.updateStatus(requestId, "rejected");
    
    return request;
  }
}

module.exports = new CollaborationService();