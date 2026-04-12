//Implements the liskov subsitution principle: Can be swapped out with other models
//Implements Interface segregation: Only provides necessary user methods

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
        default: ""
    },
    avatar:{
        type: String,
        default: "https://ui-avatars.com/api/?background=10b981&color=fff"
    }
},
{
    timestamps: true
});


//Hashes passwords so that it is not stored in plain text
userSchema.pre("save", async function(next){
    if (!this.isModified("password")){
        return; //next();

    } 

    try{
        this.password = await bcrypt.hash(this.password, 12);
        //next();
    } catch(error){
        throw error;
        //next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
};

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model("User", userSchema);