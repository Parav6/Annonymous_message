import mongoose from "mongoose";

export async function connectDb(){
    try {
        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log("Mongodb connected")
        });
        connection.on("error",(err)=>{
            console.log("error in mongo connection")
            console.log(err)
            process.exit(1)
        });
    } catch (error) {
        console.log(`Unable to connect to DB ${error}`)
    }
};