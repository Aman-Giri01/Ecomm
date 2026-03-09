// import mongoose from "mongoose";
// export const connectDB=async()=>{
//     let client=await mongoose.connect(process.env.MONGODB_URL,{
//         dbName:process.env.DB_NAME
//     });
//     console.log(`Database connected to ${client.connection.host}`)
// }

import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    let client = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log(`Database connected to ${client.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message); // ← add this
    throw err;
  }
};