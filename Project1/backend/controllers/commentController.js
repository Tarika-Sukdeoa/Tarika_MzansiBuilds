// controllers/commentController.js
// SRP: Only handles HTTP requests/responses for comments

const CommentService = require("../services/commentService");
const ProjectRepository = require("../repositories/projectRepository");

class CommentController {

    // Create a new comment
    async createComment(req, res, next) {
        try {
            const { id } = req.params;  // project ID
            const userId = req.user._id;
            const { body } = req.body;

            if (!body) {
                return res.status(400).json({
                    success: false,
                    message: "Comment body is required"
                });
            }

            const comment = await CommentService.createComment(id, userId, body);

            res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all comments for a project
    async getProjectComments(req, res, next) {
        try {
            const { id } = req.params;  // project ID

            const comments = await CommentService.getProjectComments(id);

            res.status(200).json({
                success: true,
                count: comments.length,
                data: comments
            });
        } catch (error) {
            next(error);
        }
    }

    // Edit a comment
    async editComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const userId = req.user._id;
            const { body } = req.body;

            if (!body) {
                return res.status(400).json({
                    success: false,
                    message: "Comment body is required"
                });
            }

            const comment = await CommentService.editBody(commentId, userId, body);

            res.status(200).json({
                success: true,
                message: "Comment updated successfully",
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a comment
    async deleteComment(req, res, next) {
        try {
            const { commentId, id } = req.params;  // id = project ID, commentId = comment ID
            const userId = req.user._id;

            // Check if user is project owner (to allow deletion of any comment on their project)
            const project = await ProjectRepository.findById(id);
            const isProjectOwner = project?.owner._id.toString() === userId.toString();

            await CommentService.deleteComment(commentId, userId, isProjectOwner);

            res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController();