import api from "./api";

export const cartService = {
  // GET /api/shop/cart/get
  getCart: async () => {
    const response = await api.get("/shop/cart/get");
    return response.data;
  },

  // POST /api/shop/cart/add  { productId }
  addToCart: async (productId) => {
    const response = await api.post("/shop/cart/add", { productId });
    return response.data;
  },

  // PATCH /api/shop/cart/remove  { productId }
  removeFromCart: async (productId) => {
    const response = await api.patch("/shop/cart/remove", { productId });
    return response.data;
  },

  // PATCH /api/shop/cart/clear
  clearCart: async () => {
    const response = await api.patch("/shop/cart/clear");
    return response.data;
  },
};