import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on(`connected`, ()=> {
      console.log(`mongodb connected successfullly : ${mongoose.connection.name}`);
      
    })
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    
  }
}

export default connectDB