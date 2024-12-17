import mongoose from "mongoose";
import "dotenv/config";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("connected to DB");
  } catch (err) {
    console.log("Error while connecting to DB", err);
  }
})()


// const DBConnect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL as string);
//     console.log("connected to DB");
//   } catch (err) {
//     console.log("Error while connecting to DB", err);
//   }
// };
// DBConnect()

