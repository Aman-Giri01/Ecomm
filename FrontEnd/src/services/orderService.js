import api from "./api";

export const orderService = {
  // POST /api/shop/order/create  { cartId, addressId, paymentMethod }
  createOrder: async (orderData) => {
    const response = await api.post("/shop/order/create", orderData);
    return response.data;
  },

  // GET /api/shop/order/all-orders — fetch logged-in user's own orders
  getOrders: async () => {
    const response = await api.get("/shop/order/all-orders");
    return response.data;
  },

  // GET /api/shop/order/my-orders/:id — single order detail
  getOrder: async (id) => {
    const response = await api.get(`/shop/order/my-orders/${id}`);
    return response.data;
  },
};