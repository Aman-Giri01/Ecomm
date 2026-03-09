import expressAsyncHandler from "express-async-handler";
import OrderModel from "../../models/order.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import CustomError from "../../utils/CustomError.util.js";

// GET /api/admin/order/all — fetch all orders (admin)
export const getOrders = expressAsyncHandler(async (req, res, next) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  new ApiResponse(200, "Orders fetched successfully", orders).send(res);
});

// GET /api/admin/order/single/:id — fetch single order
export const getOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) return next(new CustomError(404, "Order not found"));
  new ApiResponse(200, "Order fetched successfully", order).send(res);
});

// PATCH /api/admin/order/edit-status/:id — update order status
export const updateOrderStatus = expressAsyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;
  if (!orderStatus) return next(new CustomError(400, "orderStatus is required"));

  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    { orderStatus },
    { new: true }
  );
  if (!order) return next(new CustomError(404, "Order not found"));

  new ApiResponse(200, "Order status updated", order).send(res);
});