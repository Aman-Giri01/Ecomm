import expressAsyncHandler from "express-async-handler";
import Address from "../../models/address.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import CustomError from "../../utils/CustomError.util.js";

export const addAddress = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.myUser;
  if (!_id) return next(new CustomError(401, "Unauthorized user"));

  const { addressLine, city, state, pinCode, phone, notes } = req.body;
  const add = await Address.create({
    userId: _id,
    addressLine, city, state, pinCode, phone, notes,
  });

  new ApiResponse(201, "Address added successfully", add).send(res);
});

export const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const userId = req.myUser._id;

  //  Only return addresses belonging to the logged-in user
  const addresses = await Address.find({ userId });

  new ApiResponse(200, "Addresses fetched successfully", addresses).send(res);
});

export const getAddress = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.myUser._id;

  //  Scope lookup to logged-in user so one user can't fetch another's address
  const singleAddress = await Address.findOne({ _id: id, userId });
  if (!singleAddress) return next(new CustomError(404, "Address Not Found"));

  new ApiResponse(200, "Address Found", singleAddress).send(res);
});

export const updateAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.myUser._id;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) return next(new CustomError(404, "Address not found or unauthorized"));

  const updatedAd = await Address.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  new ApiResponse(200, "Address Updated Successfully", updatedAd).send(res);
});

export const deleteAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.myUser._id;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) return next(new CustomError(404, "Address Not Found"));

  await Address.findByIdAndDelete(id);
  new ApiResponse(200, "Address Deleted Successfully").send(res);
});