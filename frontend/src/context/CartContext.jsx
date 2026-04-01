import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, isUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isUser) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await getCart();
      setCartItems(data);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isUser]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !isUser) {
        toast.error('Please login to add to cart');
        // Let component handle redirect if needed by checking Auth
        return false;
    }
    try {
      await apiAddToCart(productId, quantity);
      await fetchCart();
      toast.success('Added to cart');
      return true;
    } catch (e) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (e) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart,
      clearCart,
      subtotal,
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
