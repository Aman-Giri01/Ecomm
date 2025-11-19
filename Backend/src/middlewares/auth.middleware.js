import expressAsyncHandler from "express-async-handler";
import CustomError from "../../utils/customError.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticate=expressAsyncHandler(async(req,res,next)=>{
    const token=req?.cookies?.token;
    if(!token){
        next(new CustomError(401,"Please Login to access this route"));
    }

    const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
    const user=await userModel.findById(decodedToken.id);
    if(!user){
        next(new CustomError(401,"Invalid Session, Please login again"))
    }

    req.myUser=user;
    next();


})