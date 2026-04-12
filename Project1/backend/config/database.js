//Implements the single responsibility principle: Only handles the interaction with the database
//Implements the open closed principle: Can be extended but cannot be altered

const mongoose = require("mongoose");

//Handles connection to the database. Checks if connection to the database is established or not
class Database{

    constructor(){
        this.isConnected = false;
    }

    async connect(){

        if (this.isConnected){
            console.log("Database is already connected");
            return;
        }

        try{
            const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mzanzibuilds";

            const conn = await mongoose.connect(mongoURI);

            this.isConnected = true;
            console.log(`MongoDB connected: ${conn.connection.host}`);
            console.log(`Database: ${conn.connection.name}`);
        } catch (error){
            console.error("Database connection failed", error.message);

            if (process.env.NODE_ENV === "production"){
                process.exit(1)
            }
        }

    }

    async disconnect(){
        if (!this.isConnected) return;

        await mongoose.disconnect();
        this.isConnected = false;
        console.log("Database has disconnected");
    }
}

module.exports = new Database();

