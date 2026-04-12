//SRP

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");

class AuthMiddleware{

    //verifies token to check if the user has succesfully entered the correct credentials
    async protect(req, res, next){
        try{
            let token;

            if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
                token = req.headers.authorization.split(" ")[1];
            }

            if(!token){
                return next(new AppError("You are not logged in. Please log in to access this source.", 401));
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET || "mzanzibuilds_secret_key_2026");
            const user = await User.findById(decode.id);
            if(!user){
                return next(new AppError("This user no longer exists", 401));
            }

            req.user = user;
            next();
        }catch(error){
            if(error.name === "JsonWebTokenError"){
                return next(new AppError("Invalid token. Please log in again", 401));
            }

            if(error.name === "TokenExpiredError"){
                return next(new AppError("Your token has expired. Please log in again.", 401));
            }

            next(error);
        }
    }

    //Restricts the actions to only certain roles

    restrictTo(...roles){
        return(req, res, next) =>{
            if(!roles.includes(req.user.role)){
                return next(new AppError("You do not have permission to perform this action", 403));
            }
            next();
        };
    }

    
}

module.exports = new AuthMiddleware();