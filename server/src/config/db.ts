import mongoose from "mongoose";
import { MONGO_URI  }  from "./env.js";
if(!MONGO_URI){
  throw new Error('MongoDB connection string is missing ')
}
export async function connectDB(){
   try{
    await mongoose.connect(MONGO_URI);
    console.log('Mongo db connect successfully')
   }catch(e){
    console.error("Mongodb not connect , error-- "+ e)
     process.exit(1);
   }
}