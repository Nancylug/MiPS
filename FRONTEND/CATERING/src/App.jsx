import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import Usuarios from './pages/Usuarios';
import Proveedores from './pages/Proveedores';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Administracion from './pages/Administracion';
import Bienvenida from './pages/Bienvenida';

import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/bienvenida" /> : <LoginPage />
      } />
      <Route path="/bienvenida" element={
        <PrivateRoute><Bienvenida /></PrivateRoute>
      } />
      <Route path="/usuarios" element={
        <PrivateRoute><Usuarios /></PrivateRoute>
      } />
      <Route path="/proveedores" element={
        <PrivateRoute><Proveedores /></PrivateRoute>
      } />
      <Route path="/clientes" element={
        <PrivateRoute><Clientes /></PrivateRoute>
      } />
      <Route path="/productos" element={
        <PrivateRoute><Productos /></PrivateRoute>
      } />
      <Route path="/administracion" element={
        <PrivateRoute><Administracion /></PrivateRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


