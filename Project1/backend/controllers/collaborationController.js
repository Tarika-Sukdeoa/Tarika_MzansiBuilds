// controllers/collaborationController.js
// SRP: Only handles HTTP requests/responses for collaboration

const CollaborationService = require("../services/collaborationService");

class CollaborationController {
  
  // Request to collaborate
  async requestCollaboration(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { message } = req.body;

      const result = await CollaborationService.requestCollaboration(id, userId, message);

      res.status(200).json({
        success: true,
        message: "Collaboration request sent successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get collaboration requests (owner only)
  async getCollaborationRequests(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const requests = await CollaborationService.getCollaborationRequests(id, userId);

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  // Accept collaboration request
  async acceptCollaboration(req, res, next) {
    try {
      const { id, requestId } = req.params;
      const userId = req.user._id;

      const result = await CollaborationService.acceptCollaboration(id, requestId, userId);

      res.status(200).json({
        success: true,
        message: "Collaboration request accepted",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Reject collaboration request
  async rejectCollaboration(req, res, next) {
    try {
      const { id, requestId } = req.params;
      const userId = req.user._id;

      const result = await CollaborationService.rejectCollaboration(id, requestId, userId);

      res.status(200).json({
        success: true,
        message: "Collaboration request rejected"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CollaborationController();