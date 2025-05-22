import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../config/axiosInstance';

const LoginForm = () => {
  const { setIsAuthenticated, setUsuario } = useContext(AuthContext); // ✅ importar setUsuario
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

   const res = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});


    const data = await res.json();

    if (res.ok) {
      setMensaje('Login exitoso');
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);

      const decoded = jwtDecode(data.token);     // ✅ decodificar token
      setUsuario(decoded);                        // ✅ establecer usuario
      setIsAuthenticated(true);                   // ✅ autenticado

      navigate('/usuarios');                      // redirigir después del login
    } else {
      setMensaje(data.message || 'Error de login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>
      <div className="mb-3">
        <label>Contraseña</label>
        <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit" className="btn btn-primary">Ingresar</button>
    </form>
  );
};

export default LoginForm;


