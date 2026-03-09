import api from "./api";

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(`/user/register`, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const { data } = await api.post('/user/login', credentials);
    return data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/user/logout');
    return response.data;
  },

  // Current logged-in user
  current: async () => {
    const response = await api.get('/user/current');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/user/update-profile', userData);
    return response.data;
  },

  // Update password (when already logged in)
  updatePassword: async (passwordData) => {
    const response = await api.patch('/user/update-password', passwordData);
    return response.data;
  },

  // Verify email token
  emailVerify: async (emailToken) => {
    const response = await api.get(`/user/verify-email/${emailToken}`);
    return response.data;
  },

  // Resend email verification link
  resendEmailVerification: async (email) => {
    const response = await api.post('/user/resend-email-link', email);
    return response.data;
  },

  // Send forgot-password email  { email }
  passwordForgot: async (emailData) => {
    const response = await api.post('/user/forgot-password', emailData);
    return response.data;
  },

  // Reset password using token from email URL
  // Backend: POST /api/user/reset-password/:resetPasswordToken  body: { password }
  resetPassword: async (resetPasswordToken, passwordData) => {
    const response = await api.post(
      `/user/reset-password/${resetPasswordToken}`,
      passwordData
    );
    return response.data;
  },
};