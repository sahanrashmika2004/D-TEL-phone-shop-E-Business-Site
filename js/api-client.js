/**
 * D-TEL MySQL Backend API Client
 * Resolves PHP API relative to the hosted project folder.
 */
const API_BASE_URL = (() => {
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    return new URL('./api', window.location.href).href.replace(/\/$/, '');
  }
  // PHP does not execute from file://. This is the standard XAMPP project-folder fallback.
  return 'http://localhost/D-TEL-Mobile-Shop-PayHere-FIXED-v2/DTEL%20MOBILE%20SHOP%20NEW/api';
})();

async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Server returned invalid JSON (HTTP ${response.status}).`);
  }
  if (!response.ok || data.status === 'error') {
    throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
  }
  return data;
}

const ApiClient = {
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const json = await apiFetch(`${API_BASE_URL}/products.php?${query}`);
      return json.status === 'success' ? json.data : [];
    } catch (err) {
      console.warn('MySQL product API failed:', err);
      return typeof StorageDB !== 'undefined' ? StorageDB.getProducts() : [];
    }
  },

  async getProductById(id) {
    try {
      const json = await apiFetch(`${API_BASE_URL}/products.php?id=${encodeURIComponent(id)}`);
      return json.status === 'success' ? json.data : null;
    } catch (err) {
      console.warn('MySQL product API failed:', err);
      return typeof StorageDB !== 'undefined' ? StorageDB.getProductById(id) : null;
    }
  },

  async createProduct(productData) {
    return apiFetch(`${API_BASE_URL}/products.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData)
    });
  },

  async updateProduct(productData) {
    return apiFetch(`${API_BASE_URL}/products.php`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData)
    });
  },

  async deleteProduct(productId) {
    return apiFetch(`${API_BASE_URL}/products.php?id=${encodeURIComponent(productId)}`, { method: 'DELETE' });
  },

  async getCategories() {
    try {
      const json = await apiFetch(`${API_BASE_URL}/categories.php`);
      return json.status === 'success' ? json.data : [];
    } catch (err) {
      console.warn('MySQL categories API failed:', err);
      return [];
    }
  },

  // Authentication intentionally does NOT silently fall back to fake credentials.
  // A successful login now proves that the MySQL database accepted the credentials.
  async register(userData) {
    return apiFetch(`${API_BASE_URL}/auth.php?action=register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData)
    });
  },

  async login(email, password) {
    return apiFetch(`${API_BASE_URL}/auth.php?action=login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
  },

  async adminLogin(email, password) {
    return apiFetch(`${API_BASE_URL}/auth.php?action=admin_login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
  },

  async getProfile(userId) {
    return apiFetch(`${API_BASE_URL}/auth.php?action=get_profile&user_id=${encodeURIComponent(userId)}`);
  },

  async updateProfile(profileData) {
    return apiFetch(`${API_BASE_URL}/auth.php?action=update_profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
  },

  getCurrentUserId() {
    try {
      const u = JSON.parse(localStorage.getItem('tz_user'));
      return u ? (u.user_id || u.id || null) : null;
    } catch (e) { return null; }
  },

  async getCart(userId = null) {
    const uid = userId || this.getCurrentUserId();
    if (!uid) return { status: 'success', items: [] };
    return apiFetch(`${API_BASE_URL}/cart.php?user_id=${encodeURIComponent(uid)}`);
  },

  async addToCart(userId, productId, quantity = 1) {
    const uid = userId || this.getCurrentUserId();
    if (!uid) throw new Error('Please sign in before adding items to your cart.');
    return apiFetch(`${API_BASE_URL}/cart.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: uid, product_id: productId, quantity })
    });
  },

  async updateCartItem(cartItemId, quantity) {
    return apiFetch(`${API_BASE_URL}/cart.php`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: cartItemId, quantity })
    });
  },

  async clearCart(userId = null) {
    const uid = userId || this.getCurrentUserId();
    if (!uid) return { status: 'success', items: [] };
    return apiFetch(`${API_BASE_URL}/cart.php?user_id=${encodeURIComponent(uid)}`, { method: 'DELETE' });
  },

  async placeOrder(orderPayload) {
    return apiFetch(`${API_BASE_URL}/orders.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload)
    });
  },

  async getOrders(userId = null) {
    const url = userId ? `${API_BASE_URL}/orders.php?user_id=${encodeURIComponent(userId)}` : `${API_BASE_URL}/orders.php`;
    const json = await apiFetch(url);
    return json.status === 'success' ? json.data : [];
  },

  async updateOrderStatus(orderId, status, paymentStatus = null) {
    return apiFetch(`${API_BASE_URL}/orders.php`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status, payment_status: paymentStatus })
    });
  },

  async getAdminDashboard() {
    return apiFetch(`${API_BASE_URL}/admin.php?action=dashboard`);
  },

  async getAdminCustomers() {
    return apiFetch(`${API_BASE_URL}/admin.php?action=customers`);
  },

  async healthCheck() {
    return apiFetch(`${API_BASE_URL}/health.php`);
  }
};

window.ApiClient = ApiClient;
window.DTEL_API_BASE_URL = API_BASE_URL;
