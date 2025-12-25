// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopInfoBar from './components/TopInfoBar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import AdminLogin from './pages/AdminPages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import VacancyManager from './pages/AdminPages/VacancyManager';
import VacancyDetailPage from './pages/VacancyDetailPage';
import MessagesManager from './pages/AdminPages/MessagesManager';
import ProductManager from './pages/AdminPages/ProductManager';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <TopInfoBar />    {/* ← Separate top bar */}
        <Navbar />        {/* ← Main navbar with logo */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<VacancyDetailPage />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/vacancies" element={<ProtectedRoute><VacancyManager /></ProtectedRoute>} />
            <Route path="admin/messages" element={<ProtectedRoute><MessagesManager /></ProtectedRoute>} />
            <Route path="admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;