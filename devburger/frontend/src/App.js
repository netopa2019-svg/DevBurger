import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login           from './containers/Login'
import Register        from './containers/Register'
import Home            from './containers/Home'
import Menu            from './containers/Menu'
import Cart            from './containers/Cart'
import Checkout        from './containers/Checkout'
import CompletePayment from './containers/CompletePayment'
import Orders          from './containers/Orders'

// Admin
import AdminProducts   from './containers/Admin/Products'
import AdminNewProduct from './containers/Admin/NewProduct'
import AdminEditProduct from './containers/Admin/EditProduct'
import AdminOrders     from './containers/Admin/Orders'
import AdminCategories from './containers/Admin/Categories'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('@devburger:token')
  return token ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('@devburger:token')
  const user  = JSON.parse(localStorage.getItem('@devburger:user') || '{}')
  if (!token) return <Navigate to="/login" />
  if (!user.admin) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Autenticadas */}
        <Route path="/"                element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/menu"            element={<PrivateRoute><Menu /></PrivateRoute>} />
        <Route path="/cart"            element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout"        element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/complete-payment" element={<PrivateRoute><CompletePayment /></PrivateRoute>} />
        <Route path="/orders"          element={<PrivateRoute><Orders /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/products"         element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/new"     element={<AdminRoute><AdminNewProduct /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />
        <Route path="/admin/orders"           element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/categories"       element={<AdminRoute><AdminCategories /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
