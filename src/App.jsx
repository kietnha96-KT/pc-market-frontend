import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

import ClientLayout from './components/ClientLayout';
import AdminLayout from './components/admin/AdminLayout'; 

// Import các Pages của khách hàng
import HomePage from './components/HomePage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import ProductsPage from './components/ProductsPage';
import RegisterPage from './components/RegisterPage';
import CustomerOrdersPage from './components/CustomerOrdersPage';

// Import các Pages của admin
import AdminProducts from './components/admin/AdminProducts';
import AdminLogin from './components/admin/AdminLogin';
import AdminProductForm from './components/admin/AdminProductForm';
import AdminCategories from './components/admin/AdminCategories';
import AdminOrdersPage from './components/admin/AdminOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 

      <Routes>
        {/* === ROUTE ĐỘC LẬP: Trang Đăng nhập Admin === */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* === NHÓM 1: GIAO DIỆN KHÁCH HÀNG (Dùng ClientLayout) === */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<CustomerOrdersPage />} />
        </Route>

        {/* === NHÓM 2: GIAO DIỆN ADMIN (Dùng AdminLayout) === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products/add" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="products" element={<AdminProducts />} /> 
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;