import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB.");
  } catch (error) {
    console.log("Error in connecting to DB:\n", error);
  }
};
