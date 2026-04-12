//main application entry point

//Forces it to use Google's public DNS servers
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config(); //Loads environment variables first

//Loading classes
const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const AppError = require("./utils/AppError");

const app = express();

database.connect();

//Console
app.use(cors()); //Allows cross origin requests
app.use(express.json());

//Logging to cconsole
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "MzanziBuilds API is running",
        version: "1.0.0",
        endspoints:{
            auth: "/api/auth",
            projects: "/api/projects (comming soon)"
        }
    })

});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);


//handles 404 error not found
app.use((req, res, next) =>{
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});


//Global error handler
app.use((err, req, res, next)=>{

    //Handles validation errors 400 Bad request
    if (err.name === "ValidationError"){
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            status: "fail",
            message: messages.join(", "),
            errors: err.errors
        });
    }

    //Handles duplicate key error
    //Fixed didn't was giving error 500 all the time
    if (err.code === 11000){
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            status: "fail",
            message: `${field} already exists`
        });
    }

    if(err.name === 'JsonWebTokenError'){
        
        return res.status(401).json({
            success: false,
            status: "fail",
            message: "Invalid token"
        });

    }

    if(err.name === "TokenExpiredError"){
        return res.status(401).json({
            success: false,
            status: "fail",
            message: "Token expired. Please log in again"
        });
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({

        success: false,
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack})

    });
});

//Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
    console.log(`Server is runnning on http://localhost:${PORT}`);
    console.log(`Auth api is available at http://localhost:${PORT}/api/auth`);
    console.log(`Environment: ${process.env.NODE_ENV || "Development"}`);
});



