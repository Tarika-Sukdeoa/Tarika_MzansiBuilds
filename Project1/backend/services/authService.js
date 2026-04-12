//Users SRP:" Only handles the authentication logic"
//DIP: Depends on abstractions not concerete classes

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

class AuthService{

    //Generates JWT token to authenticate users
    generateToken(userId){
        return jwt.sign(
            {id: userId},
            process.env.JWT_SECRET || "mzanzibuilds_secret_key_2026",
            {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
        );
    }

    async register(userData){
        const {username, email, password} = userData;

        //Checks if user exists
        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        });

        if (existingUser){
            throw new AppError("User already exists with this email or username", 400);
        }

        //Creates a new user
        const user = await User.create({
            username,
            email,
            password
        });

        const token = this.generateToken(user._id);

        return{
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                createdAt: user.createdAt

            }
        };
    }

    async login(email, password){

        const user = await User.findOne({email}).select("+password");

        if (!user){
            throw new AppError ("Invalid credentials", 401);
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            throw new AppError("Invalid credentials", 401);
        }

        //Generate authentication token
        const token = this.generateToken(user._id);

        return{
            success: true,
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        };
    }

    async getUserById(userId){
        const user = await User.findById(userId);

        if(!user){
            throw new AppError("User not found", 404);
        }

        return user;
    }


}

module.exports = new AuthService();