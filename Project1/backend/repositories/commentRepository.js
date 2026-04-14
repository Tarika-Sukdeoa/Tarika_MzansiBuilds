const Comment = require("../models/comment");

class CommentRepository{

    async create(commentData){
        return await Comment.create(commentData);
    }

    async findCommentById(commentId){
        return await Comment.findById(commentId).populate("commenter", "username avatar");

    }

    async findProjectComments(projectId){
        return await Comment.find({project: projectId})
        .populate("commenter", "username avatar")
        .sort({createdAt: -1});
    }

    async editBody(commentId, bodyText){

        return await Comment.findByIdAndUpdate(commentId, 
            {$set: {body: bodyText}},
            {new: true}
        );

    }

    async deleteComment(commentId){
        return await Comment.findByIdAndDelete(commentId);
    }

    async deleteProjectComments(projectId){
        return await Comment.deleteMany({project: projectId});
    }
};

module.exports = new CommentRepository();