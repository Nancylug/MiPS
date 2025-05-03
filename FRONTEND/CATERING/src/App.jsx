
// import React from "react";
// import LoginPage from "./pages/LoginPage";
// import 'bootstrap/dist/css/bootstrap.min.css';

// const App = () => {
//   return <LoginPage />;
// };

// export default App;

// src/App.jsx
// src/App.jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import Usuarios from './pages/Usuarios';
import Proveedores from './pages/Proveedores';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Administracion from './pages/Administracion';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // 👈 importar

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<LoginPage />} />
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
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
