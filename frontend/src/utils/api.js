import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth config
api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Avoid redirecting if we're just checking /auth/me or already on login pages
      const isAuthCheck = err.config.url.includes('/auth/me');
      const isLoginPage = window.location.pathname.includes('/login');
      if (!isAuthCheck && !isLoginPage) {
         // Determine if admin or shop, then redirect
         if (window.location.pathname.startsWith('/admin')) {
             window.location.href = '/admin/login';
         } else {
             window.location.href = '/login';
         }
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────
export const login = (username, password) =>
  api.post('/auth/login', { username, password });
export const loginWithGoogle = (token) => api.post('/auth/google', { token });
export const signup = (data) => api.post('/auth/signup', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// ── Users ─────────────────────────────────────────────
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// ── Products ─────────────────────────────────────────
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const getCategories = () => api.get('/products/categories');
export const getStats = () => api.get('/products/admin/stats');
export const getChartData = (period = 'month') => api.get('/products/admin/chart-data', { params: { period } });

export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/products/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Cart ──────────────────────────────────────────────
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => api.post('/cart', { product_id: parseInt(productId), quantity });
export const updateCartItem = (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);

// ── Favorites ─────────────────────────────────────────
export const getFavorites = () => api.get('/favorites');
export const toggleFavorite = (productId) => api.post('/favorites', { product_id: parseInt(productId) });
export const removeFavorite = (favoriteId) => api.delete(`/favorites/${favoriteId}`);

// ── Orders ────────────────────────────────────────────
export const checkout = (data) => api.post('/orders/checkout', data);
export const getMyOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrdersAdmin = () => api.get('/orders/admin');
export const updateOrderStatus = (id, status) => api.put(`/orders/admin/${id}/status`, { status });

// ── Site Settings ─────────────────────────────────────
export const getSiteSettings = () => api.get('/settings');
export const updateSiteSettings = (settings) => api.put('/settings', { settings });

// ── Contact ───────────────────────────────────────────
export const sendContactMessage = (data) => api.post('/contact', data);

export default api;
