import api from "./api";

export const adminProductService = {
  // GET /api/admin/product/all
  getProducts: async () => {
    const res = await api.get("/admin/product/all");
    return res.data;
  },

  // GET /api/admin/product/:productId
  getProduct: async (id) => {
    const res = await api.get(`/admin/product/${id}`);
    return res.data;
  },

  // POST /api/admin/product/add  (multipart/form-data with image file)
  addProduct: async (formData) => {
    const res = await api.post("/admin/product/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PATCH /api/admin/product/:productId  (JSON body, no image)
  updateProduct: async (id, data) => {
    const res = await api.patch(`/admin/product/${id}`, data);
    return res.data;
  },

  // DELETE /api/admin/product/:productId
  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/product/${id}`);
    return res.data;
  },

  // PATCH /api/admin/product/update-image  (multipart, body: public_id + productId)
  updateImage: async (formData) => {
    const res = await api.patch("/admin/product/update-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PATCH /api/admin/product/delete-image  (body: { public_id, productId })
  deleteImage: async (data) => {
    const res = await api.patch("/admin/product/delete-image", data);
    return res.data;
  },
};

export const adminOrderService = {
  // GET /api/admin/orders/all
  getOrders: async () => {
    const res = await api.get("/admin/orders/all");
    return res.data;
  },

  // GET /api/admin/orders/single/:id
  getOrder: async (id) => {
    const res = await api.get(`/admin/orders/single/${id}`);
    return res.data;
  },

  // PATCH /api/admin/orders/edit-status/:id
  updateOrderStatus: async (id, orderStatus) => {
    const res = await api.patch(`/admin/orders/edit-status/${id}`, { orderStatus });
    return res.data;
  },
};