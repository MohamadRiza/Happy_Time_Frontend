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