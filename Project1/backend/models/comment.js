//Implements liskov substitution 
//Interface segregation

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, "Text is required"],
        maxlength: [100, "Comment may not exceed 1000 characters"]
    },
   
    commenter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    
    completedOn: Date
}, {
    timestamps: true
});


commentSchema.index({project: 1}); //Sorts by project in ascending order
commentSchema.index({createdAt: -1}); //Sorts in descending order


commentSchema.methods.isCommenter = function(userId){
    return this.commenter.toString() === userId.toString();
}

commentSchema.methods.editBody = function(bodyText){
    this.body = bodyText;
    return this.save();
}



module.exports = mongoose.model("Comment", commentSchema);