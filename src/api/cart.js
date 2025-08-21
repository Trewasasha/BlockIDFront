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
  // Публичные эндпоинты
  getProducts: (skip = 0, limit = 100, category = null, search = null) => {
    const params = new URLSearchParams();
    params.append('skip', skip);
    params.append('limit', limit);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    return api.get(`/products/?${params.toString()}`);
  },
  
  getProduct: (productId) => api.get(`/products/${productId}`),
  
  // Админские эндпоинты
  // Создать товар
  createProduct: (formData) => api.post('/products/admin/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Обновить товар (основные данные - JSON)
  updateProduct: (productId, data) => api.put(`/products/admin/${productId}`, data),
  
  // Обновить изображение товара (multipart/form-data)
  updateProductImage: (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.patch(`/products/admin/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Переключить активность товара
  toggleProductActive: (productId) => api.patch(`/products/admin/${productId}/toggle-active`),
  
  // Удалить товар
  deleteProduct: (productId) => api.delete(`/products/admin/${productId}`),
  
  // Получить все товары (админка)
  getAllProductsAdmin: (skip = 0, limit = 100, includeInactive = false) => {
    const params = new URLSearchParams();
    params.append('skip', skip);
    params.append('limit', limit);
    params.append('include_inactive', includeInactive);
    
    return api.get(`/products/admin/all?${params.toString()}`);
  },
  
  // Статистика товаров
  getProductsStats: () => api.get('/products/admin/stats/products'),
  
  // Статистика категорий
  getCategoriesStats: () => api.get('/products/admin/stats/categories')
};