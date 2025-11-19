// ! username,email, password,role, contactNumber

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import CustomError from "../../utils/customError.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required:true,
      default: "user",
    },
    contactNumber: {
      type: String,
      required: true,
      unique:true
    },
    isVerified: {
      type: Boolean,
      required:true,
      default: false,
    },
  },
  { timestamps: true,
    toJSON:"",
    toObject:""
   }
);

userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  // ? this function will only execute when the modified field is  password
  let salt=await bcryptjs.genSalt(10);
  this.password=await bcryptjs.hash(this.password,salt);
  next();
});

userSchema.methods.comparePassword=async function(password){
  return await bcryptjs.compare(password,this.password)

}
export default mongoose.model("User", userSchema);
