import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (productId: string, quantity: number) =>
    api.post('/cart/add', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put('/cart/update', { productId, quantity }),
  removeItem: (productId: string) =>
    api.delete(`/cart/remove/${productId}`),
};

export const orderAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  pay: (id: string, paymentResult: any) =>
    api.put(`/orders/${id}/pay`, paymentResult),
};

export const adminAPI = {
  getAllProducts: () => api.get('/admin/products'),
  createProduct: (productData: any) =>
    api.post('/admin/products', productData),
  updateProduct: (id: string, productData: any) =>
    api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`),
  getAllOrders: () => api.get('/admin/orders'),
  deliverOrder: (id: string) =>
    api.put(`/admin/orders/${id}/deliver`),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;
