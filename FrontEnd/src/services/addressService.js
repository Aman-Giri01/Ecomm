import api from "./api";

export const addressService = {
  // POST /api/shop/address/add
  addAddress: async (addressData) => {
    const response = await api.post("/shop/address/add", addressData);
    return response.data;
  },

  // GET /api/shop/address/all
  getAddresses: async () => {
    const response = await api.get("/shop/address/all");
    return response.data;
  },

  // GET /api/shop/address/one/:id
  getAddress: async (id) => {
    const response = await api.get(`/shop/address/one/${id}`);
    return response.data;
  },

  // PATCH /api/shop/address/update/:id
  updateAddress: async (id, addressData) => {
    const response = await api.patch(`/shop/address/update/${id}`, addressData);
    return response.data;
  },

  // DELETE /api/shop/address/delete/:id
  deleteAddress: async (id) => {
    const response = await api.delete(`/shop/address/delete/${id}`);
    return response.data;
  },
};