import api from "./api";

// ── Admin Product Service ────────────────────────────────────────
export const adminProductService = {
  // GET /api/admin/product/all
  getProducts: async () => {
    const response = await api.get("/admin/product/all");
    return response.data;
  },

  // POST /api/admin/product/add  (FormData with image)
  addProduct: async (formData) => {
    const response = await api.post("/admin/product/add", formData);
    return response.data;
  },

  // PATCH /api/admin/product/:productId  (text fields only, no image)
  updateProduct: async (id, data) => {
    const response = await api.patch(`/admin/product/${id}`, data);
    return response.data;
  },

  // PATCH /api/admin/product/update-image  (FormData: images + public_id + productId)
  updateImage: async (formData) => {
    const response = await api.patch("/admin/product/update-image", formData);
    return response.data;
  },

  // DELETE /api/admin/product/:productId
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/product/${id}`);
    return response.data;
  },
};

// ── Admin Order Service ──────────────────────────────────────────
export const adminOrderService = {
  // GET /api/admin/orders/all
  getOrders: async () => {
    const response = await api.get("/admin/orders/all");
    return response.data;
  },

  // GET /api/admin/orders/single/:id
  getOrder: async (id) => {
    const response = await api.get(`/admin/orders/single/${id}`);
    return response.data;
  },

  // PATCH /api/admin/orders/edit-status/:id  { orderStatus }
  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.patch(`/admin/orders/edit-status/${id}`, { orderStatus });
    return response.data;
  },
};