import mongoose from 'mongoose'

const DbConnect=async()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
    console.error("MongoDB connection error:", error);
    }
}
export default DbConnect