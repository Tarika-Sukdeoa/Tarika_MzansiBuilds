// repositories/collaborationRequestRepository.js
// SRP: Only handles database operations for collaboration requests
// Repository Pattern: Abstracts database queries from business logic

const CollaborationRequest = require("../models/CollaborationRequest");

class CollaborationRequestRepository {
  
  // Create a new collaboration request
  async create(projectId, userId, message) {
    return await CollaborationRequest.create({
      project: projectId,
      requester: userId,
      message: message || "",
      status: "pending"
    });
  }

  // Find pending request by project and user
  async findPendingRequest(projectId, userId) {
    return await CollaborationRequest.findOne({
      project: projectId,
      requester: userId,
      status: "pending"
    });
  }

  // Get all pending requests for a project
  async findPendingByProject(projectId) {
    return await CollaborationRequest.find({
      project: projectId,
      status: "pending"
    }).populate("requester", "username avatar");
  }

  // Find request by ID
  async findById(requestId) {
    return await CollaborationRequest.findById(requestId);
  }

  // Update request status
  async updateStatus(requestId, status) {
    return await CollaborationRequest.findByIdAndUpdate(
      requestId,
      { status: status },
      { new: true }
    );
  }

  // Get all requests by a user (for history)
  async findByRequester(userId) {
    return await CollaborationRequest.find({ requester: userId })
      .populate("project", "title")
      .sort({ createdAt: -1 });
  }

  // Delete a request (if needed)
  async deleteRequest(requestId) {
    return await CollaborationRequest.findByIdAndDelete(requestId);
  }
}

module.exports = new CollaborationRequestRepository();