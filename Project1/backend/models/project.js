//Implements liskov substitution 
//Interface segregation

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        maxlength: [100, "Title may not exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [1000, "Description length may not exceed 1000 characters"]

    },
    stage:{
        type: String,
        enum: ["Ideation", "MVP", "Development", "Testing", "Launch", "Post-Launch"],
        default: "Ideation"
    },
    supportRequired:[{
        type: String,
        enum: ["Backend", "Frontend", "UI/UX", "Testing", "DevOps", "Marketing", "Documentation"]
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    milestones:[{
        title:{
            type: String,
            required: true
        },
        description: String,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    collaborators:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status:{
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },
    completedAt: Date
}, {
    timestamps: true
});


projectSchema.index({owner: 1, status: 1}); //Sorts by owner then status in ascending order
projectSchema.index({createdAt: -1}); //Sorts in descending order
projectSchema.index({status: 1, completedAt: -1});

//Checks if the user is the owner
projectSchema.methods.isOwner = function(userId){
    return this.owner.toString() == userId.toString();
};

//Adds a milestone
projectSchema.methods.addMilestone = function(title, description){

    this.milestones.push({
        title,
        description,
        completedAt: new Date()
    });
    return this.save();
};

//Marks as completed
projectSchema.methods.markCompleted = function(){
    this.status = "completed";
    this.completedAt = new Date();
    return this.save();
};

projectSchema.methods.addCollaborator = function(userId){
    
    if(!this.collaborators.includes(userId)){
        this.collaborators.push(userId)

    }

    return this.save();

};

module.exports = mongoose.model("Project", projectSchema);