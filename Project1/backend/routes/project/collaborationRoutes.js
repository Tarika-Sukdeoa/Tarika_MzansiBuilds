// routes/project/collaborationRoutes.js
// SRP: Only handles collaboration routes

const express = require("express");
const router = express.Router({ mergeParams: true });
const collaborationController = require("../../controllers/collaborationController");
const authMiddleware = require("../../middleware/auth");

// All collaboration routes require authentication
router.use(authMiddleware.protect);

// Request to collaborate (any logged-in user)
router.post("/request", collaborationController.requestCollaboration);

// Get collaboration requests (owner only)
router.get("/requests", collaborationController.getCollaborationRequests);

// Accept collaboration request (owner only)
router.post("/requests/:requestId/accept", collaborationController.acceptCollaboration);

// Reject collaboration request (owner only)
router.post("/requests/:requestId/reject", collaborationController.rejectCollaboration);

module.exports = router;