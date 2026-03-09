import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { connectDB } from "./src/config/database.config.js";
import app from "./app.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Wrap app in a handler that ensures DB is connected before every request
// Vercel serverless functions are stateless — connection may drop between calls
let isConnected = false;

const connectIfNeeded = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await connectDB();
  isConnected = true;
};

// ✅ Export a handler instead of app directly
export default async function handler(req, res) {
  await connectIfNeeded();
  return app(req, res);
}