import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Try to detect admin role by calling an admin endpoint
// Returns 'admin' if authorized, 'user' otherwise
const detectRole = async () => {
  try {
    await api.get("/admin/product/all");
    return "admin";
  } catch {
    return "user";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      // Verify session is valid
      const res = await authService.current();
      // Detect role by probing admin endpoint
      const role = await detectRole();
      setUser({ loggedIn: true, role, username: res?.payload?.username, email: res?.payload?.email, _id: res?.payload?._id, isVerified: res?.payload?.isVerified, contactNumber: res?.payload?.contactNumber });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const register = async (userData) => {
  try {
    setError(null); setLoading(true);
    const response = await authService.register(userData);
    return { success: true, message: response.message }; 
  } catch (error) {
    const msg = error.response?.data?.message || "Registration Failed";
    setError(msg); toast.error(msg);
    return { success: false, error: msg };
  } finally { setLoading(false); }
};

  const login = async (credentials) => {
    try {
      setError(null); setLoading(true);
      const response = await authService.login(credentials);
      const role = await detectRole();
      setUser({ loggedIn: true, role });
      toast.success(response.message || "Logged in successfully!");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Login Failed";
      setError(msg); toast.error(msg);
      return { success: false, error: msg };
    } finally { setLoading(false); }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
      return { success: true };
    } catch {
      toast.error("Logout failed");
      return { success: false };
    }
  };

  const isLoggedIn = !!user?.loggedIn;

  return (
    <AuthContext.Provider value={{ user, loading, error, isLoggedIn, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};