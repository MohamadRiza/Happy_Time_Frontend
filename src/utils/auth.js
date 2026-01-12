// src/utils/auth.js
// Save and get token/user
export const login = (token, user) => {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// ✅ NEW: Check if user is authenticated (token exists and is valid)
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // JWT token has 3 parts separated by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;
    
    // Decode payload (second part)
    const payloadBase64 = tokenParts[1];
    // Handle base64url padding
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    // Invalid token format
    return false;
  }
};

// ✅ CUSTOMER AUTH UTILITIES WITH USER-SPECIFIC CART STORAGE
export const customerLogin = (token, customer) => {
  localStorage.setItem('customerToken', token);
  localStorage.setItem('customer', JSON.stringify(customer));
  
  // Load user-specific cart
  const userCartKey = `happyTimeCart_${customer._id}`;
  const userCart = localStorage.getItem(userCartKey);
  if (userCart) {
    localStorage.setItem('happyTimeCart', userCart);
  } else {
    localStorage.removeItem('happyTimeCart');
  }
};

export const customerLogout = () => {
  const customer = getCustomer();
  if (customer) {
    // Save current cart under user-specific key
    const currentCart = localStorage.getItem('happyTimeCart');
    if (currentCart) {
      localStorage.setItem(`happyTimeCart_${customer._id}`, currentCart);
    }
  }
  
  localStorage.removeItem('customerToken');
  localStorage.removeItem('customer');
  localStorage.removeItem('happyTimeCart'); // Clear active cart
};

export const getCustomerToken = () => {
  return localStorage.getItem('customerToken');
};

export const getCustomer = () => {
  const customer = localStorage.getItem('customer');
  return customer ? JSON.parse(customer) : null;
};

export const isCustomerAuthenticated = () => {
  const token = getCustomerToken();
  if (!token) return false;
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;
    
    const payloadBase64 = tokenParts[1];
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// ✅ CHECK AUTH TYPE
export const getAuthType = () => {
  if (isAdmin()) return 'admin';
  if (isCustomerAuthenticated()) return 'customer';
  return 'guest';
};