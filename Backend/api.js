// This file is the Vercel serverless entry point
// Vercel does NOT use app.listen() — it just needs the express app exported

import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./src/config/database.config.js";
import app from "./app.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect DB (Vercel reuses connections between invocations)
connectDB();

export default app;