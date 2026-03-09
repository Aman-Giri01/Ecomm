import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { connectDB } from "./src/config/database.config.js";
import app from "./app.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}