// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TopInfoBar from "./components/TopInfoBar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import VacancyManager from "./pages/AdminPages/VacancyManager";
import VacancyDetailPage from "./pages/VacancyDetailPage";
import MessagesManager from "./pages/AdminPages/MessagesManager";
import ProductManager from "./pages/AdminPages/ProductManager";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";

// ✅ IMPORT CUSTOMER PAGES
import LoginPage from "./pages/LoginPage";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import CustomerAccount from "./pages/CustomerAccount";

// ✅ IMPORT PROTECTED ROUTES
import {
  AdminProtectedRoute,
  CustomerProtectedRoute,
} from "./components/CustomerProtectedRoute";
import CartPage from "./pages/CartPage";
import CustomerDetail from "./pages/AdminPages/CustomerDetail";
import CustomerList from "./pages/AdminPages/CustomerList";
import ApplyJobPage from "./pages/ApplyJobPage";
import ApplicantsList from "./pages/AdminPages/ApplicantsList";
import AdminSettings from "./pages/AdminPages/AdminSettings";
import CustomerOrders from "./pages/CustomerOrders";
import OrdersList from "./pages/AdminPages/OrdersList";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <TopInfoBar />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<VacancyDetailPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ProductDetailPage />} />
            {/* ✅ CUSTOMER AUTHENTICATION ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterStep1 />} />
            <Route path="/register/step2" element={<RegisterStep2 />} />
            <Route
              path="/account"
              element={
                <CustomerProtectedRoute>
                  <CustomerAccount />
                </CustomerProtectedRoute>
              }
            />
            <Route path="/orders" element={<CustomerProtectedRoute><CustomerOrders /></CustomerProtectedRoute>} />
            // In your App.jsx routes
            <Route
              path="/cart"
              element={
                <CustomerProtectedRoute>
                  <CartPage />
                </CustomerProtectedRoute>
              }
            />
            // Add these routes to your admin section
            <Route
              path="/admin/customers"
              element={
                <AdminProtectedRoute>
                  <CustomerList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/customers/:id"
              element={
                <AdminProtectedRoute>
                  <CustomerDetail />
                </AdminProtectedRoute>
              }
            />
            <Route path="/apply-job" element={<ApplyJobPage />} />
            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/vacancies"
              element={
                <AdminProtectedRoute>
                  <VacancyManager />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <AdminProtectedRoute>
                  <MessagesManager />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminProtectedRoute>
                  <ProductManager />
                </AdminProtectedRoute>
              }
            />

            <Route 
  path="/admin/settings" 
  element={
    <AdminProtectedRoute>
      <AdminSettings />
    </AdminProtectedRoute>
  } 
/>

<Route path="/admin/orders" element={<AdminProtectedRoute><OrdersList /></AdminProtectedRoute>} />

            <Route path="/admin/applications" element={<AdminProtectedRoute><ApplicantsList /></AdminProtectedRoute>}></Route>
            {/* ✅ CATCH ALL - REDIRECT TO HOME */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
