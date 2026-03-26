import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Collections from '../pages/Collections';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['user', 'guest']}>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route path="/products" element={<Products />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Checkout />
          </ProtectedRoute>
        } 
      />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes - Protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
