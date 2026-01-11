// src/components/ProtectedRoutes.jsx
import { Navigate } from 'react-router-dom';
import { getToken, getCurrentUser } from '../utils/auth';

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const token = getToken();
  const user = getCurrentUser();
  
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Customer Protected Route
export const CustomerProtectedRoute = ({ children }) => {
  const customerToken = localStorage.getItem('customerToken');
  
  if (!customerToken) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    // Verify token is not expired
    const payload = JSON.parse(atob(customerToken.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customer');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    return <Navigate to="/login" replace />;
  }
};