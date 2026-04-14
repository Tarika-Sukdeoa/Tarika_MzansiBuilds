const CommentRepository = require("../repositories/commentRepository");
const AppError = require("../utils/AppError");
const ProjectRepository = require("../repositories/projectRepository");

class CommentService{

    async createComment(projectId, userId, bodyText){
        
        if (!bodyText || bodyText.trim().length === 0){
            throw new AppError("Body text is required for a comment", 400);

        }

        if (bodyText.length > 1000){
            throw new AppError("Comment cannot exceed 1000 characters", 400);
        }

        const project = await ProjectRepository.findById(projectId);

        if (!project){
            throw new AppError("Project not found", 404);
        }

        const comment = await CommentRepository.create({
            body: bodyText,
            commenter: userId,
            project: projectId
        });

        return await CommentRepository.findCommentById(comment._id);
    }

    async getProjectComments(projectId){
        const project = await ProjectRepository.findById(projectId);

        if (!project){
            throw new AppError("Project not found", 404);
        }
        const comments = await CommentRepository.findProjectComments(projectId);
        return comments;
    }

    async editBody(commentId, userId, newBody){

        if (!newBody || newBody.trim().length === 0){

            throw new AppError("Body Text is required for comment", 400);
        }

        const comment = await CommentRepository.findCommentById(commentId);

        if (!comment){

            throw new AppError("Comment not found", 404);

        }

        if (comment.commenter._id.toString() !== userId.toString()){
            throw new AppError("You can only edit your own comment", 403);

        }

        const updatedComment = await CommentRepository.editBody(commentId, newBody.trim());
        return updatedComment;


        
        
    }

    async deleteComment(commentId, userId, isProjectOwner = false){

        const comment = await CommentRepository.findCommentById(commentId);
        
        if(!comment){
            throw new AppError("Comment not found", 404);

        }

        const isCommenter = comment.commenter._id.toString() === userId.toString();

        if (!isCommenter && !isProjectOwner){
             throw new AppError("You can only delete your own comments", 403);

        }
        return await CommentRepository.deleteComment(commentId);
    }
}

module.exports = new CommentService();