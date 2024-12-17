import mongoose from "mongoose";
import "dotenv/config";

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("connected to DB");
  } catch (err) {
    console.log("Error while connecting to DB", err);
  }
};
export default DBConnect
