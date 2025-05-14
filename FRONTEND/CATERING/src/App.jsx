

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import Usuarios from './pages/Usuarios';
import Proveedores from './pages/Proveedores';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Administracion from './pages/Administracion';

import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const Inicio = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const ultimaRuta = localStorage.getItem('ultimaRuta') || '/clientes';

  return isAuthenticated ? <Navigate to={ultimaRuta} /> : <LoginPage />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
            <Route path="/proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
            <Route path="/administracion" element={<PrivateRoute><Administracion /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

