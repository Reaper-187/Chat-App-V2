import mongoose from "mongoose";

export async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
}
