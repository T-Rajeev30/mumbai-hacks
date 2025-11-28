import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  // console.log("Connecting to MongoDB:", uri);
  await mongoose.connect(uri);
}
