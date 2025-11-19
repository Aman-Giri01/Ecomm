import dotenv from 'dotenv';
dotenv.config({quiet:true});
import express from "express";
import UserRouter from './src/routes/user/user.route.js'
import { errorMiddleware } from './src/middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';


const app=express();
app.use(express.json());  //? to handle json data
app.use(express.urlencoded({extended:true}))  //? to handle form data

app.use("/api/user",UserRouter);

app.use(cookieParser)
app.use(errorMiddleware);
export default app;