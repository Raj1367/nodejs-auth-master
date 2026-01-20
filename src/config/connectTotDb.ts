import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("connected to database successfully");
  } catch (error: any) {
    console.error(error.message || error);
  }
};