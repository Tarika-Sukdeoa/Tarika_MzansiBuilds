//SRP

const AuthService = require("../services/authService");
const AppError = require("../utils/AppError");

//200 means return already existing
//201 means creating an account

class AuthController{
    
    //register new user
    async register(req, res, next){
        try{
            const result = await AuthService.register(req.body);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result

            });
        }catch (error){
            //Pass error tp global event handler
            next(error);
        }
    }

    //Login old user
    async login(req, res, next){
        
        try{
            const {email, password} = req.body;
            const result = await AuthService.login(email, password);

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: result
            });
        }catch(error){
            next(error);
        }
    }

    async getMe(req, res, next){

        try{

            if(!req.user){
                return next(new AppError("You are not logged in", 401))
            }
            const user = await AuthService.getUserById(req.user._id);

            res.status(200).json({
                success: true,
                data: {
                    user:{
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        bio: user.bio,
                        avatar: user.avatar,
                        createdAt: user.createdAt
                    }
                }
            });
        }catch (error){
            next(error);
        }

    }
}

module.exports = new AuthController();