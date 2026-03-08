import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { UseAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const { isLoggedIn, loading: authLoading } = UseAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // total quantity count for navbar badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      // backend returns payload as cart object or "No Product in Cart"
      if (data.payload && typeof data.payload === "object") {
        setCart(data.payload);
        setCartItems(data.payload.items || []);
      } else {
        setCart(null);
        setCartItems([]);
      }
    } catch {
      setCart(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await cartService.addToCart(productId);
      toast.success("Added to cart!");
      await fetchCart();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      toast.success("Removed from cart");
      await fetchCart();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to remove";
      toast.error(msg);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  // Only fetch cart when user is confirmed logged in
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      fetchCart();
    }
    if (!authLoading && !isLoggedIn) {
      setCart(null);
      setCartItems([]);
    }
  }, [isLoggedIn, authLoading]);

  const value = {
    cart,
    cartItems,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};