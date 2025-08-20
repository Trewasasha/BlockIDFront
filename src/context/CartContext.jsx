/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from '../components/UseAuth/useAuth';

// Создаем контекст
const CartContext = createContext();

// Хук для использования контекста
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Провайдер контекста
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setCartItems(response.data);
      
      const countResponse = await cartAPI.getCartCount();
      setCartCount(countResponse.data.count);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart({
        product_id: productId,
        quantity: quantity
      });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка обновления корзины:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Экспортируем контекст по умолчанию
export default CartContext;