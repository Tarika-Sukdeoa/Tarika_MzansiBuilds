//Open closed principle
//SRP

class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4")? "fail":"error";
        this.isOperational = true;

        //Stores it instack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;