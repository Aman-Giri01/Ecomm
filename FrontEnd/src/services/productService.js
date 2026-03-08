import api from "./api";

export const productService = {
  // GET /api/shop/product/all?category=&brand=&sortBy=&minPrice=&maxPrice=
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await api.get(`/shop/product/all?${params.toString()}`);
    return response.data;
  },

  // GET /api/shop/product/all/:id
  getProduct: async (id) => {
    const response = await api.get(`/shop/product/all/${id}`);
    return response.data;
  },

  // GET /api/shop/product/search?keyword=
  searchProducts: async (keyword) => {
    const response = await api.get(`/shop/product/search?keyword=${keyword}`);
    return response.data;
  },
};