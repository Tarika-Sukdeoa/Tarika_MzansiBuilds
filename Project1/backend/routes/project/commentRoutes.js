// routes/project/commentRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../../controllers/commentController");
const authMiddleware = require("../../middleware/auth");

// All comment routes require authentication
router.use(authMiddleware.protect);

// Routes
router.post("/", commentController.createComment);
router.get("/", commentController.getProjectComments);
router.put("/:commentId", commentController.editComment);
router.patch("/:commentId", commentController.editComment);
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;