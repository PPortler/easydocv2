import mongoose from "mongoose";

export async function connectDB(){
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("connected mongodb.")
    }catch(err){
        console.log("Connect mongodb failed !");
    }
}