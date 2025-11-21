import expressAsyncHandler from "express-async-handler";
import Address from "../../models/address.model.js";
import ApiResponse from "../../../utils/ApiResponse.util.js";
import CustomError from "../../../utils/CustomError.util.js";

export const addAddress = expressAsyncHandler(async (req, res,next) => {
  const { _id } = req.myUser;
  if (!_id) {
    return next(new CustomError(401, "Unauthorized user"));
  }
  const { addressLine, city, state, pinCode, phone, notes } = req.body;
  const add = await Address.create({
    userId:_id,
    addressLine,
    city,
    state,
    pinCode,
    phone,
    notes,
  });

  new ApiResponse(201,"Address added successfully",add).send(res);
});

export const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const address=await Address.find({}).populate("userId");
  if(address.length===0){
    return next(new CustomError(404,"Addresses Not Found"));
  }

  new ApiResponse(200,"Address Found",address).send(res);
});

export const getAddress = expressAsyncHandler(async (req, res, next) => {
  const {id}=req.params;
  const singleAddress=await Address.findById(id);
  if(!singleAddress){
    return next(new CustomError(404,"Address Not Found"));
  }
  new ApiResponse(200,"Address Found",singleAddress).send(res);
});

export const updateAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.myUser._id;   
  const {id} = req.params; 

  const address = await Address.findOne({ _id:id, userId });

  if (!address) {
    return next(new CustomError(404, "Address not found or unauthorized"));
  }
  const updatedAd = await Address.findByIdAndUpdate(
       id,
      req.body,
      {
        new: true, //? it returns the updated document,
        runValidators: true, //? validate the updated document against the schema
      }
    );
  
    if (!updatedAd) next(new CustomError(404, "User Not Found"));
    new ApiResponse(200, "User Updated Successfully", updatedAd).send(res);
});

export const deleteAddress = expressAsyncHandler(async (req, res, next) => {
  const userId=req.myUser;
  const {id}=req.params;
  const address= await Address.findOne({_id:id,userId});
  if(!address){
    return next(new CustomError(404,"Address Not Found"));
  }
  const deleteAd=await Address.findByIdAndDelete(id);
  new ApiResponse(200,"Address Deleted Successfully").send(res);
});
