import expressAsyncHandler from "express-async-handler";
import ReviewModel from "../models/review.model.js";
import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";

export const updateAverageProductReview = expressAsyncHandler(
  async (productId) => {
    const result = await ReviewModel.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    const average = result.length > 0 ? result[0].averageRating.toFixed(2) : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      averageReviews: average,
    });
  }
);
