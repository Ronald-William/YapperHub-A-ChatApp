import mongoose from 'mongoose';
export default async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Db connected successfully!")
    }
    catch(error){
        console.log("Error connecting to db");
        process.exit(1);
    }
}