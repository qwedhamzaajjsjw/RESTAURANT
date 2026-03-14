const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function request(url, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  getRestaurants: () => request('/restaurants'),
  getRestaurant: (slug) => request(`/restaurants/${slug}`),
  getRestaurantMenu: (slug) => request(`/restaurants/${slug}/menu`),
  placeOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Admin
  getAdminOrders: (status) => request(`/admin/orders${status ? `?status=${status}` : ''}`),
  getAdminOrder: (id) => request(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminMenu: () => request('/admin/menu'),
  addMenuItem: (item) => request('/admin/menu', { method: 'POST', body: JSON.stringify(item) }),
  updateMenuItem: (id, item) => request(`/admin/menu/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteMenuItem: (id) => request(`/admin/menu/${id}`, { method: 'DELETE' }),
  getCategories: () => request('/admin/categories'),
  addCategory: (category) => request('/admin/categories', { method: 'POST', body: JSON.stringify(category) }),
};
