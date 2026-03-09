import dotenv from "dotenv";
dotenv.config({ quiet: true });

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { seedAdmin } from "./src/seed/admin.seed.js";

import { authenticate, authorize } from "./src/middlewares/auth.middleware.js";

import productRoutes from "./src/routes/admin/product.route.js";
import cartRoutes from "./src/routes/shop/cart.route.js";
import shopProductRoutes from "./src/routes/shop/product.route.js";
import userRoutes from "./src/routes/user/user.route.js";
import shopOrderRoutes from "./src/routes/shop/order.route.js"
import shopAddressRoutes from "./src/routes/shop/address.route.js"
import shopReviewRoutes from "./src/routes/shop/review.route.js";
import orderAdminRoutes from "./src/routes/admin/order.route.js"

const app = express();

app.use(
  cors({
   origin: process.env.CLIENT_URL || "http://localhost:5173"  ,
    credentials: true,
  })
);

if (process.argv[2] === "seed") {
  seedAdmin();
}

app.use(cookieParser());
app.use(express.json()); //? to handle json data
app.use(express.urlencoded({ extended: true })); //? to handle form data

app.use("/api/user", userRoutes);
app.use("/api/admin/product", authenticate, authorize, productRoutes);
app.use("/api/shop/cart", authenticate, cartRoutes);
app.use("/api/shop/product", shopProductRoutes);
app.use("/api/shop/order",authenticate, shopOrderRoutes);
app.use("/api/shop/address",authenticate, shopAddressRoutes);
app.use("/api/shop/review",authenticate, shopReviewRoutes);
app.use("/api/admin/orders",authenticate,authorize, orderAdminRoutes);


app.use(errorMiddleware);

export default app;