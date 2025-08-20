import { api } from '../components/UseAuth/useAuth';

export const cartAPI = {
  // Получить корзину
  getCart: () => api.get('/cart/'),
  
  // Добавить в корзину
  addToCart: (productData) => api.post('/cart/', productData),
  
  // Обновить количество
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  
  // Удалить из корзины
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  
  // Очистить корзину
  clearCart: () => api.delete('/cart/'),
  
  // Получить количество товаров в корзине
  getCartCount: () => api.get('/cart/count')
};

export const productsAPI = {
  // Получить все товары
  getProducts: (skip = 0, limit = 100) => api.get(`/products/?skip=${skip}&limit=${limit}`),
  
  // Получить конкретный товар
  getProduct: (productId) => api.get(`/products/${productId}`),
};