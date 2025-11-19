import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/user.model.js";
import ApiResponse from "../../../utils/ApiResponse.utils.js";
import CustomError from "../../../utils/customError.js";
import { generateToken } from "../../../utils/jwt.util.js";
import userModel from "../../models/user.model.js";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, contactNumber } = req.body;
  const newUser = await UserModel.create({
    name,
    email,
    password,
    contactNumber,
  });

  // res.status({success:true,message:"User registered successfully",newUser})

  new ApiResponse(201, "User registered successfully", newUser).send(res);
});
export const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser = await UserModel.findOne({ email });
  if (!existingUser) {
    next(new CustomError(400, "Invalid credentials"));
  }
  let MatchedPassword = await existingUser.comparePassword(password);
  console.log(MatchedPassword);
  if (!MatchedPassword) {
    next(new CustomError(400, "Invalid Password"));
  }

  // ! is verified is set to true

  let token = generateToken(existingUser._id);
  res.cookie("token", token, {
    maxAge: process.env.JWT_TOKEN_EXPIRY * 60 * 60 * 1000,
    httpOnly: true,
  });

  new ApiResponse(200, "Login Successfully", existingUser).send(res);
});
export const logoutUser = expressAsyncHandler(async (req, res, next) => {
  res.clearCookie("token");

  new ApiResponse(200, "logout successfully").send(res);
});

// & this is for frontend ---> check success if true means logged in, else not logged in then redirect client to login page or home page
export const currentUser = expressAsyncHandler(async (req, res, next) => {
  new ApiResponse(200, "User is logged in").send(res);
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.myUser._id,
    req.body,  //? ir returns the updated document
    { new: true, runValidators: true } //? validate the updated document against the schema
  );
  if(!updatedUser) next(new CustomError(404,"user not found"))
  
    new ApiResponse(200,"User profile updated",updatedUser).send(res);
});
